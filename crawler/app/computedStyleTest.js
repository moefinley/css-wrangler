"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configParser_1 = require("./configParser");
const fs = require("fs");
const deepDiff = require("deep-diff");
const webdriver = require("selenium-webdriver");
const CleanDiffElement_1 = require("./CleanDiffElement");
const scrapeComputedStyles_1 = require("./browserScript/scrapeComputedStyles");
const logging_1 = require("./logging/logging");
var logging = webdriver.logging;
const differ = deepDiff.diff;
let capabilities = webdriver.Capabilities.chrome();
let loggingPreferences = new logging.Preferences();
loggingPreferences.setLevel(logging.Type.BROWSER, logging.Level.DEBUG);
capabilities.setLoggingPrefs(loggingPreferences);
let driver = new webdriver.Builder()
    .forBrowser('chrome')
    .withCapabilities(capabilities)
    .build();
function unloadSelenium() {
    driver.manage().logs().get("browser").then(entry => entry.forEach(log => logging_1.logInfo(log.message)));
    driver.close();
}
function getComputedStylesForPage(pageName, url, isOriginal, elementsToScrape, elementsToIgnore) {
    let promiseArray = [];
    driver.get(url);
    for (let diffElement of elementsToScrape) {
        promiseArray.push(driver.executeScript(scrapeComputedStyles_1.scrapeComputedStyles, diffElement.selector, elementsToIgnore)
            .then((resultsOfScraping) => {
            if (typeof resultsOfScraping.error !== "undefined") {
                logging_1.logError(resultsOfScraping.error + ' on page ' + pageName);
                diffElement.error = 'there was an error when gathering styles for this element';
            }
            else {
                logging_1.logInfo(`I resolved: ${diffElement.selector} on page: ${pageName} with ${Object.keys(resultsOfScraping.computedStyles).length}`);
                logging_1.logInfo(`Total ignored: ${resultsOfScraping.ignoreCount}`);
                if (isOriginal) {
                    diffElement.original = resultsOfScraping.computedStyles;
                }
                else {
                    diffElement.comparand = resultsOfScraping.computedStyles;
                }
                return resultsOfScraping;
            }
        }));
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
    if (configParser_1.crawlerConfig.originalData !== null)
        currentMode = Modes.useProvidedOriginalAndGenerateDiff;
    if (configParser_1.crawlerConfig.getOriginal)
        currentMode = Modes.getOriginal;
    logging_1.logVerboseInfo(`current mode is: ${Modes[currentMode]}`);
    return currentMode;
}
function init() {
    let currentMode = getCurrentMode();
    for (let index in configParser_1.crawlerConfig.pages) {
        let page = configParser_1.crawlerConfig.pages[index];
        let beforeAndAfterPromises = [];
        let beforePageUrl = `http://${configParser_1.crawlerConfig.beforeUrl}${page.url}${configParser_1.crawlerConfig.beforeQueryString}`;
        let afterPageUrl = `http://${configParser_1.crawlerConfig.afterUrl}${page.url}${configParser_1.crawlerConfig.afterQueryString}`;
        let addPagePromiseToArray = function (isOriginal) {
            beforeAndAfterPromises.push(getComputedStylesForPage(page.name, isOriginal ? beforePageUrl : afterPageUrl, isOriginal, page.elementsToTest, page.elementsToIgnore));
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
 */
let processBothAndSaveDiff = function (page, allResultsArray, writeOriginal = true) {
    for (let index in page.elementsToTest) {
        let diffElement = page.elementsToTest[index];
        diffElement.diff = differ(diffElement.original, diffElement.comparand);
        CleanDiffElement_1.cleanDiffElement(diffElement);
    }
    page.elementsToTest = page.elementsToTest.filter((diffElement) => {
        return typeof diffElement.diff !== 'undefined' && diffElement.diff.length > 0;
    });
    page.isProcessed = true;
    if (checkAllPagesProcessed()) {
        logging_1.logInfo('last page complete');
        writeToDisk(createDiffJson(), configParser_1.crawlerConfig.diffOutputPath);
        if (writeOriginal)
            writeToDisk(createOriginalJson(), configParser_1.crawlerConfig.originalOutputPath);
        writeToDisk(createComparandJson(), configParser_1.crawlerConfig.comparandOutputPath);
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
        writeToDisk(createOriginalJson(), configParser_1.crawlerConfig.originalOutputPath);
        unloadSelenium();
    }
};
let checkAllPagesProcessed = function () {
    let returnVal = true;
    configParser_1.crawlerConfig.pages.forEach((page) => {
        if (page.isProcessed === false)
            returnVal = false;
    });
    return returnVal;
};
let createJson = function (mapper) {
    return JSON.stringify({
        configFile: configParser_1.crawlerConfig.configFile,
        date: Date.now(),
        original: configParser_1.crawlerConfig.beforeUrl,
        comparator: configParser_1.crawlerConfig.afterUrl,
        pages: configParser_1.crawlerConfig.pages.map((page, index, array) => {
            return {
                id: page.id,
                name: page.name,
                url: page.url,
                elementsToTest: page.elementsToTest.map(mapper)
            };
        })
    });
};
let createDiffJson = function () {
    return createJson((diffElement) => {
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