"use strict";
const ConfigParser_1 = require('./ConfigParser');
const fs = require("fs");
const deepDiff = require("deep-diff");
const webdriver = require("selenium-webdriver");
const CleanDiffElement_1 = require("./CleanDiffElement");
const ScrapeComputedStyles_1 = require("./BrowserScript/ScrapeComputedStyles");
const Logging_1 = require("./Logging/Logging");
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
    driver.manage().logs().get("browser").then(entry => entry.forEach(log => Logging_1.logInfo(log.message)));
    driver.close();
}
function getComputedStylesForPage(pageName, url, isOriginal, elementsToScrape, elementsToIgnore) {
    let promiseArray = [];
    driver.get(url);
    for (let diffElement of elementsToScrape) {
        promiseArray.push(driver.executeScript(ScrapeComputedStyles_1.scrapeComputedStyles, diffElement.selector, elementsToIgnore)
            .then((resultsOfScraping) => {
            Logging_1.logInfo(`I resolved: ${diffElement.selector} on page: ${pageName} with ${Object.keys(resultsOfScraping.computedStyles).length}`);
            Logging_1.logInfo(`Total ignored: ${resultsOfScraping.ignoreCount}`);
            if (isOriginal) {
                diffElement.original = resultsOfScraping.computedStyles;
            }
            else {
                diffElement.comparand = resultsOfScraping.computedStyles;
            }
            return resultsOfScraping;
        }));
    }
    return Promise.all(promiseArray);
}
function init() {
    for (let index in ConfigParser_1.crawlerConfig.pages) {
        let page = ConfigParser_1.crawlerConfig.pages[index];
        let beforeAndAfterPromises = [];
        let beforePageUrl = `http://${ConfigParser_1.crawlerConfig.beforeUrl}${page.url}`;
        let afterPageUrl = `http://${ConfigParser_1.crawlerConfig.afterUrl}${page.url}`;
        if (ConfigParser_1.crawlerConfig.originalData === null) {
            beforeAndAfterPromises.push(getComputedStylesForPage(page.name, beforePageUrl, true, page.elementsToTest, page.elementsToIgnore));
        }
        if (!ConfigParser_1.crawlerConfig.getOriginal)
            beforeAndAfterPromises.push(getComputedStylesForPage(page.name, afterPageUrl, false, page.elementsToTest, page.elementsToIgnore));
        Promise.all(beforeAndAfterPromises)
            .then((allResultsArray) => {
            if (ConfigParser_1.crawlerConfig.getOriginal) {
                generateRawOriginal(page);
            }
            else {
                generateBothAndProcessDiff(page, allResultsArray);
            }
        }, (error) => {
            Logging_1.logError(error);
        });
    }
}
exports.init = init;
/**
 * The default action of scraping the original and comparand styles and generating a diff object from them.
 *
 * @param page
 * @param allResultsArray
 */
let generateBothAndProcessDiff = function (page, allResultsArray) {
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
        Logging_1.logInfo('last page complete');
        writeToDisk(createDiffJson(), ConfigParser_1.crawlerConfig.diffOutputPath.dir + ConfigParser_1.crawlerConfig.diffOutputPath.base);
        writeToDisk(createOriginalJson(), ConfigParser_1.crawlerConfig.originalOutputPath.dir + ConfigParser_1.crawlerConfig.originalOutputPath.base);
        writeToDisk(createComparandJson(), ConfigParser_1.crawlerConfig.comparandOutputPath.dir + ConfigParser_1.crawlerConfig.comparandOutputPath.base);
        unloadSelenium();
    }
};
/**
 * When the --getOriginal switch is passed this function is used to only get original styles and save them to disk.
 * No comparand or diff object is created.
 *
 * @param page
 */
let generateRawOriginal = function (page) {
    page.isProcessed = true;
    if (checkAllPagesProcessed()) {
        writeToDisk(createOriginalJson(), ConfigParser_1.crawlerConfig.originalOutputPath.dir + ConfigParser_1.crawlerConfig.originalOutputPath.base);
    }
};
let checkAllPagesProcessed = function () {
    let returnVal = true;
    ConfigParser_1.crawlerConfig.pages.forEach((page) => {
        if (page.isProcessed === false)
            returnVal = false;
    });
    return returnVal;
};
let createJson = function (mapper) {
    return JSON.stringify({
        configFile: ConfigParser_1.crawlerConfig.configFile,
        date: Date.now(),
        original: ConfigParser_1.crawlerConfig.beforeUrl,
        comparator: ConfigParser_1.crawlerConfig.afterUrl,
        pages: ConfigParser_1.crawlerConfig.pages.map((page, index, array) => {
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
let writeToDisk = function (contents, path) {
    fs.writeFile(path, contents, function (err) {
        if (err)
            console.error(err);
        console.log('Written!');
    });
};
//# sourceMappingURL=ComputedStyleTest.js.map