"use strict";
const ConfigParser_1 = require('./ConfigParser');
const fs = require("fs");
const deepDiff = require("deep-diff");
const webdriver = require("selenium-webdriver");
const CleanDiffElement_1 = require("./CleanDiffElement");
const ScrapeComputedStyles_1 = require("./BrowserScript/ScrapeComputedStyles");
const Logging_1 = require("./Logging/Logging");
const differ = deepDiff.diff;
let driver = new webdriver.Builder()
    .forBrowser('chrome')
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();
function unloadSelenium() {
    driver.close();
}
function init() {
    function getAllElementsComputedStyles(page, url, isOriginal) {
        let promiseArray = [];
        driver.get(url);
        for (let diffElement of page.elementsToTest) {
            promiseArray.push(driver.executeScript(ScrapeComputedStyles_1.scrapeComputedStyles, diffElement.selector)
                .then((computedStyles) => {
                Logging_1.logInfo(`I resolved: ${diffElement.selector} on page: ${page.name} with ${Object.keys(computedStyles).length}`);
                if (isOriginal) {
                    diffElement.original = computedStyles;
                }
                else {
                    diffElement.comparand = computedStyles;
                }
                return computedStyles;
            }));
        }
        return Promise.all(promiseArray);
    }
    for (let index in ConfigParser_1.crawlerConfig.pages) {
        let page = ConfigParser_1.crawlerConfig.pages[index];
        let beforeAndAfterPromises = [];
        let beforePageUrl = "http://" + ConfigParser_1.crawlerConfig.beforeUrl + page.url;
        let afterPageUrl = "http://" + ConfigParser_1.crawlerConfig.afterUrl + page.url;
        beforeAndAfterPromises.push(getAllElementsComputedStyles(page, beforePageUrl, true));
        beforeAndAfterPromises.push(getAllElementsComputedStyles(page, afterPageUrl, false));
        Promise.all(beforeAndAfterPromises).then((allResultsArray) => {
            Logging_1.logInfo('Diff obj length: ' + allResultsArray.length);
            for (let index in page.elementsToTest) {
                let diffElement = page.elementsToTest[index];
                diffElement.diff = differ(diffElement.original, diffElement.comparand);
                CleanDiffElement_1.cleanDiffElement(diffElement);
            }
            page.elementsToTest = page.elementsToTest.filter((diffElement) => {
                return typeof diffElement.diff !== 'undefined' && diffElement.diff.length > 0;
            });
            if (index == (ConfigParser_1.crawlerConfig.pages.length - 1).toString()) {
                Logging_1.logInfo('last page complete');
                writeToDisk(createOutputJsonForAllPages());
                unloadSelenium();
            }
        }, (err) => {
            console.log(err);
        });
    }
}
exports.init = init;
;
let createOutputJsonForAllPages = function () {
    let output = {
        configFile: ConfigParser_1.crawlerConfig.configFile,
        date: Date.now(),
        original: ConfigParser_1.crawlerConfig.beforeUrl,
        comparator: ConfigParser_1.crawlerConfig.afterUrl,
        pages: ConfigParser_1.crawlerConfig.pages
    };
    return JSON.stringify(output);
};
let writeToDisk = function (contents) {
    let outputPath = ConfigParser_1.crawlerConfig.outputPath;
    fs.writeFile(outputPath, contents, function (err) {
        if (err)
            console.error(err);
        console.log('Written!');
    });
};
//# sourceMappingURL=ComputedStyleTest.js.map