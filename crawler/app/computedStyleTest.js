"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Settings = require("./settings/settings");
const Config_1 = require("./config/Config");
const fs = require("fs");
const deepDiff = require("deep-diff");
const webdriver = require("selenium-webdriver");
const CleanDiffElement_1 = require("./CleanDiffElement");
const scrapeComputedStyles_1 = require("./browserScript/scrapeComputedStyles");
const logging_1 = require("./logging/logging");
var logging = webdriver.logging;
const differ = deepDiff.diff;
const Data = require("./data/data");
let driver;
function loadSelenium() {
    let capabilities = webdriver.Capabilities.chrome();
    let loggingPreferences = new logging.Preferences();
    loggingPreferences.setLevel(logging.Type.BROWSER, logging.Level.DEBUG);
    capabilities.setLoggingPrefs(loggingPreferences);
    driver = new webdriver.Builder()
        .forBrowser('chrome')
        .withCapabilities(capabilities)
        .build();
}
function unloadSelenium() {
    driver.manage().logs().get("browser").then(entry => entry.forEach(log => logging_1.logVerboseInfo("Selenium error: " + log.message)));
    driver.close();
}
function getComputedStylesForPage(pageName, url, isOriginalRun, elementsToScrape, elementsToIgnore) {
    let promiseArray = [];
    logging_1.logVerboseInfo(`Opening url: ${url}`);
    driver.get(url);
    for (let diffElement of elementsToScrape) {
        if (typeof diffElement.error === 'undefined') {
            promiseArray.push(driver.executeScript(scrapeComputedStyles_1.scrapeComputedStyles, diffElement.selector, elementsToIgnore)
                .then((resultsOfScraping) => {
                if (typeof resultsOfScraping.error !== "undefined") {
                    logging_1.logError(`${resultsOfScraping.error} on page ${pageName} ${isOriginalRun ? 'original' : 'comparand'}`);
                    diffElement.error = isOriginalRun ?
                        'Error in browser when gathering original styles for element - is the element selector correct?' :
                        'Error in browser when gathering comparand styles for element - is the element selector correct?';
                }
                else {
                    logging_1.logInfo(`Found ${diffElement.selector} on page ${pageName}`);
                    logging_1.logVerboseInfo(`Total ignored: ${resultsOfScraping.ignoreCount}`);
                    if (isOriginalRun) {
                        diffElement.original = resultsOfScraping.computedStyles;
                    }
                    else {
                        diffElement.comparand = resultsOfScraping.computedStyles;
                    }
                    return resultsOfScraping;
                }
            }));
        }
        else {
            logging_1.logError(`${diffElement.selector} had errored when gathering original styles and was skipped when gathering comparand styles.`);
            diffElement.error += ' As this errored gathering original styles and was skipped when gathering comparand styles.';
        }
    }
    return Promise.all(promiseArray);
}
var Modes;
(function (Modes) {
    Modes[Modes["getOriginal"] = 0] = "getOriginal";
    Modes[Modes["getBothAndGenerateDiff"] = 1] = "getBothAndGenerateDiff";
    Modes[Modes["useProvidedOriginalAndGenerateDiff"] = 2] = "useProvidedOriginalAndGenerateDiff";
})(Modes || (Modes = {}));
function getCurrentMode() {
    let currentMode = Modes.getBothAndGenerateDiff;
    if (Settings.original)
        currentMode = Modes.useProvidedOriginalAndGenerateDiff;
    if (Settings.getOriginal)
        currentMode = Modes.getOriginal;
    logging_1.logVerboseInfo(`current mode is: ${Modes[currentMode]}`);
    return currentMode;
}
function beforeExit() {
    if (Settings.verbose) {
        logging_1.getVerboseLog().forEach((message) => {
            console.log(message);
        });
    }
    logging_1.getErrorLog().forEach((message) => {
        console.error(message);
    });
}
exports.beforeExit = beforeExit;
function init() {
    loadSelenium();
    let currentMode = getCurrentMode();
    for (let index in Data.pages) {
        let page = Data.pages[index];
        let beforeAndAfterPromises = [];
        let beforePageUrl = `http://${Config_1.Config.beforeUrl}${page.path}${Config_1.Config.beforeQueryString}`;
        let afterPageUrl = `http://${Config_1.Config.afterUrl}${page.path}${Config_1.Config.afterQueryString}`;
        let addPagePromiseToArray = function (isOriginalRun) {
            beforeAndAfterPromises.push(getComputedStylesForPage(page.name, isOriginalRun ? beforePageUrl : afterPageUrl, isOriginalRun, page.elementsToTest, page.elementsToIgnore));
        };
        if (currentMode === Modes.getBothAndGenerateDiff) {
            addPagePromiseToArray(true);
            addPagePromiseToArray(false);
        }
        if (currentMode === Modes.useProvidedOriginalAndGenerateDiff) {
            addPagePromiseToArray(false);
        }
        if (currentMode === Modes.getOriginal) {
            addPagePromiseToArray(true);
        }
        Promise.all(beforeAndAfterPromises)
            .then((allResultsArray) => {
            if (currentMode === Modes.getOriginal) {
                parseRawOriginalAndSave(page);
            }
            else if (currentMode === Modes.useProvidedOriginalAndGenerateDiff) {
                processComparandAndSaveDiff(page, allResultsArray);
            }
            else {
                processBothAndSaveDiff(page, allResultsArray);
            }
        }, (error) => {
            logging_1.logError(error);
        });
    }
}
exports.init = init;
/**
 * When an original has been provided
 *
 * @param page
 * @param allResultsArray
 */
let processComparandAndSaveDiff = function (page, allResultsArray) {
    processBothAndSaveDiff(page, allResultsArray, false);
};
/**
 * The default action of scraping the original and comparand styles and generating a diff object from them.
 *
 * @param page
 * @param allResultsArray
 * @param writeOriginal
 */
let processBothAndSaveDiff = function (page, allResultsArray, writeOriginal = true) {
    for (let index in page.elementsToTest) {
        let diffElement = page.elementsToTest[index];
        if (typeof diffElement.error === 'undefined') {
            diffElement.diff = differ(diffElement.original, diffElement.comparand);
            CleanDiffElement_1.cleanDiffElement(diffElement);
        }
    }
    page.elementsToTest = page.elementsToTest.filter((diffElement) => {
        /**
         * Keep elements that have diffs or should present an error
         */
        return (typeof diffElement.diff !== 'undefined' && diffElement.diff.length > 0)
            || typeof diffElement.error !== 'undefined';
    });
    page.isProcessed = true;
    if (checkAllPagesProcessed()) {
        logging_1.logInfo('last page complete');
        writeToDisk(createDiffJson(), Config_1.Config.diffOutputPath);
        if (writeOriginal)
            writeToDisk(createOriginalJson(), Config_1.Config.originalOutputPath);
        writeToDisk(createComparandJson(), Config_1.Config.comparandOutputPath);
        unloadSelenium();
    }
};
/**
 * When the --getOriginal switch is passed this function is used to only get original styles and save them to disk.
 * No comparand or diff object is created.
 *
 * @param page
 */
let parseRawOriginalAndSave = function (page) {
    page.isProcessed = true;
    if (checkAllPagesProcessed()) {
        writeToDisk(createOriginalJson(), Config_1.Config.originalOutputPath);
        unloadSelenium();
    }
};
let checkAllPagesProcessed = function () {
    let returnVal = true;
    Data.pages.forEach((page) => {
        if (page.isProcessed === false)
            returnVal = false;
    });
    return returnVal;
};
let createJson = function (mapper) {
    return JSON.stringify({
        configFile: Settings.config,
        date: Date.now(),
        original: Config_1.Config.beforeUrl,
        comparator: Config_1.Config.afterUrl,
        pages: Data.pages.map((page, index, array) => {
            return {
                id: page.id,
                name: page.name,
                path: page.path,
                elementsToTest: page.elementsToTest.map(mapper)
            };
        })
    });
};
let createDiffJson = function () {
    return createJson((diffElement) => {
        if (typeof diffElement.error !== 'undefined') {
            return {
                selector: diffElement.selector,
                error: diffElement.error
            };
        }
        return {
            selector: diffElement.selector,
            diff: diffElement.diff
        };
    });
};
let createOriginalJson = function () {
    return createJson((diffElement) => {
        if (typeof diffElement.error !== "undefined") {
            return {
                selector: diffElement.selector,
                error: diffElement.error
            };
        }
        return {
            selector: diffElement.selector,
            original: diffElement.original
        };
    });
};
let createComparandJson = function () {
    return createJson((diffElement) => {
        if (typeof diffElement.error !== "undefined") {
            return {
                selector: diffElement.selector,
                error: diffElement.error
            };
        }
        return {
            selector: diffElement.selector,
            comparand: diffElement.comparand
        };
    });
};
let writeToDisk = function (contents, pathToFile) {
    fs.writeFile(pathToFile, contents, function (err) {
        if (err)
            console.error(err);
        console.log('Written to ' + pathToFile);
    });
};
//# sourceMappingURL=computedStyleTest.js.map