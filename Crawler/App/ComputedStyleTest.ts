import describe = testing.describe;
import * as testing from "selenium-webdriver/testing";
import {crawlerConfig} from './ConfigParser';
import * as fs from "fs";
import * as deepDiff from "deep-diff";
import * as webdriver from "selenium-webdriver";
import {cleanDiffElement} from "./CleanDiffElement";
import {scrapeComputedStyles} from "./BrowserScript/ScrapeComputedStyles";
import {logInfo} from "./Logging/Logging";
import promise = webdriver.promise;
const differ = deepDiff.diff;

let driver = new webdriver.Builder()
    .forBrowser('chrome')
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();

function unloadSelenium() {
    driver.close();
}
export function init() {
    function getAllElementsComputedStyles(page:IPage, url:string, isOriginal:boolean):Promise<Promise<any[]>> {
        let promiseArray:promise.Promise<IComputedStyles>[] = [];

        driver.get(url);
        for (let diffElement of page.elementsToTest) {
            promiseArray.push(driver.executeScript<IComputedStyles>(scrapeComputedStyles, diffElement.selector)
                .then((computedStyles):IComputedStyles => {
                    logInfo(`I resolved: ${diffElement.selector} on page: ${page.name} with ${Object.keys(computedStyles).length}`);
                    if (isOriginal) {
                        diffElement.original = computedStyles;
                    } else {
                        diffElement.comparand = computedStyles;
                    }
                    return computedStyles;
                }));
        }
        return Promise.all(promiseArray);
    }

    for (let index in crawlerConfig.pages) {
        let page = crawlerConfig.pages[index];
        let beforeAndAfterPromises = [];
        let beforePageUrl = "http://" + crawlerConfig.beforeUrl + page.url;
        let afterPageUrl = "http://" + crawlerConfig.afterUrl + page.url;
        beforeAndAfterPromises.push(getAllElementsComputedStyles(page, beforePageUrl, true));
        beforeAndAfterPromises.push(getAllElementsComputedStyles(page, afterPageUrl, false));

        Promise.all(beforeAndAfterPromises).then((allResultsArray) => {
            logInfo('Diff obj length: ' + allResultsArray.length);

            for (let index in page.elementsToTest) {
                let diffElement = page.elementsToTest[index];
                diffElement.diff = differ(diffElement.original, diffElement.comparand);
                cleanDiffElement(diffElement);
            }

            page.elementsToTest = page.elementsToTest.filter((diffElement) => {
                return typeof diffElement.diff !== 'undefined' && diffElement.diff.length > 0;
            });

            if (index == (crawlerConfig.pages.length - 1).toString()) {
                logInfo('last page complete');
                writeToDisk(createOutputJsonForAllPages());
                unloadSelenium();
            }
        }, (err) => {
            console.log(err);
        });
    }
};

let createOutputJsonForAllPages = function () {
    let output = {
        configFile: crawlerConfig.configFile,
        date: Date.now(),
        original: crawlerConfig.beforeUrl,
        comparator: crawlerConfig.afterUrl,
        pages: crawlerConfig.pages
    };
    return JSON.stringify(output);
};

let writeToDisk = function (contents) {
    let outputPath = crawlerConfig.outputPath;

    fs.writeFile(outputPath, contents, function (err) {
        if (err)
            console.error(err);
        console.log('Written!');
    });
};

