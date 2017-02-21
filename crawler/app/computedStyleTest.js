"use strict";
var ConfigParser_1 = require('./configParser');
var fs = require("fs");
var deepDiff = require("deep-diff");
var webdriver = require("selenium-webdriver");
var CleanDiffElement_1 = require("./CleanDiffElement");
var ScrapeComputedStyles_1 = require("./browserScript/scrapeComputedStyles");
var Logging_1 = require("./logging/logging");
var logging = webdriver.logging;
var differ = deepDiff.diff;
var capabilities = webdriver.Capabilities.chrome();
var loggingPreferences = new logging.Preferences();
loggingPreferences.setLevel(logging.Type.BROWSER, logging.Level.DEBUG);
capabilities.setLoggingPrefs(loggingPreferences);
var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .withCapabilities(capabilities)
    .build();
function unloadSelenium() {
    driver.manage().logs().get("browser").then(function (entry) { return entry.forEach(function (log) { return Logging_1.logInfo(log.message); }); });
    driver.close();
}
function getComputedStylesForPage(pageName, url, isOriginal, elementsToScrape, elementsToIgnore) {
    var promiseArray = [];
    driver.get(url);
    var _loop_1 = function(diffElement) {
        promiseArray.push(driver.executeScript(ScrapeComputedStyles_1.scrapeComputedStyles, diffElement.selector, elementsToIgnore)
            .then(function (resultsOfScraping) {
            Logging_1.logInfo("I resolved: " + diffElement.selector + " on page: " + pageName + " with " + Object.keys(resultsOfScraping.computedStyles).length);
            Logging_1.logInfo("Total ignored: " + resultsOfScraping.ignoreCount);
            if (isOriginal) {
                diffElement.original = resultsOfScraping.computedStyles;
            }
            else {
                diffElement.comparand = resultsOfScraping.computedStyles;
            }
            return resultsOfScraping;
        }));
    };
    for (var _i = 0, elementsToScrape_1 = elementsToScrape; _i < elementsToScrape_1.length; _i++) {
        var diffElement = elementsToScrape_1[_i];
        _loop_1(diffElement);
    }
    return Promise.all(promiseArray);
}
function init() {
    var _loop_2 = function(index) {
        var page = ConfigParser_1.crawlerConfig.pages[index];
        var beforeAndAfterPromises = [];
        var beforePageUrl = "http://" + ConfigParser_1.crawlerConfig.beforeUrl + page.url;
        var afterPageUrl = "http://" + ConfigParser_1.crawlerConfig.afterUrl + page.url;
        if (ConfigParser_1.crawlerConfig.originalData === null) {
            beforeAndAfterPromises.push(getComputedStylesForPage(page.name, beforePageUrl, true, page.elementsToTest, page.elementsToIgnore));
        }
        if (!ConfigParser_1.crawlerConfig.getOriginal)
            beforeAndAfterPromises.push(getComputedStylesForPage(page.name, afterPageUrl, false, page.elementsToTest, page.elementsToIgnore));
        Promise.all(beforeAndAfterPromises)
            .then(function (allResultsArray) {
            if (ConfigParser_1.crawlerConfig.getOriginal) {
                generateRawOriginal(page);
            }
            else {
                generateBothAndProcessDiff(page, allResultsArray);
            }
        }, function (error) {
            Logging_1.logError(error);
        });
    };
    for (var index in ConfigParser_1.crawlerConfig.pages) {
        _loop_2(index);
    }
}
exports.init = init;
/**
 * The default action of scraping the original and comparand styles and generating a diff object from them.
 *
 * @param page
 * @param allResultsArray
 */
var generateBothAndProcessDiff = function (page, allResultsArray) {
    for (var index in page.elementsToTest) {
        var diffElement = page.elementsToTest[index];
        diffElement.diff = differ(diffElement.original, diffElement.comparand);
        CleanDiffElement_1.cleanDiffElement(diffElement);
    }
    page.elementsToTest = page.elementsToTest.filter(function (diffElement) {
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
var generateRawOriginal = function (page) {
    page.isProcessed = true;
    if (checkAllPagesProcessed()) {
        writeToDisk(createOriginalJson(), ConfigParser_1.crawlerConfig.originalOutputPath.dir + ConfigParser_1.crawlerConfig.originalOutputPath.base);
    }
};
var checkAllPagesProcessed = function () {
    var returnVal = true;
    ConfigParser_1.crawlerConfig.pages.forEach(function (page) {
        if (page.isProcessed === false)
            returnVal = false;
    });
    return returnVal;
};
var createJson = function (mapper) {
    return JSON.stringify({
        configFile: ConfigParser_1.crawlerConfig.configFile,
        date: Date.now(),
        original: ConfigParser_1.crawlerConfig.beforeUrl,
        comparator: ConfigParser_1.crawlerConfig.afterUrl,
        pages: ConfigParser_1.crawlerConfig.pages.map(function (page, index, array) {
            return {
                id: page.id,
                name: page.name,
                url: page.url,
                elementsToTest: page.elementsToTest.map(mapper)
            };
        })
    });
};
var createDiffJson = function () {
    return createJson(function (diffElement) {
        return {
            selector: diffElement.selector,
            diff: diffElement.diff
        };
    });
};
var createOriginalJson = function () {
    return createJson(function (diffElement) {
        return {
            selector: diffElement.selector,
            original: diffElement.original
        };
    });
};
var createComparandJson = function () {
    return createJson(function (diffElement) {
        return {
            selector: diffElement.selector,
            comparand: diffElement.comparand
        };
    });
};
var writeToDisk = function (contents, path) {
    fs.writeFile(path, contents, function (err) {
        if (err)
            console.error(err);
        console.log('Written!');
    });
};
