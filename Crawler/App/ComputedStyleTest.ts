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
import logging = webdriver.logging;
import diff = require("deep-diff");
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
    driver.manage().logs().get("browser").then(entry => entry.forEach(log => logInfo(log.message)));
    driver.close();
}

function getComputedStylesForPage(
    pageName:string,
    url:string,
    isOriginal:boolean,
    elementsToScrape: IDiffElement[],
    elementsToIgnore:string[]
):Promise<Promise<IScrapedObj[]>> {
    let promiseArray:promise.Promise<IScrapedObj>[] = [];

    driver.get(url);
    for (let diffElement of elementsToScrape) {
        promiseArray.push(driver.executeScript<IScrapedObj>(scrapeComputedStyles, diffElement.selector, elementsToIgnore)
            .then((resultsOfScraping):IScrapedObj => {
                logInfo(`I resolved: ${diffElement.selector} on page: ${pageName} with ${Object.keys(resultsOfScraping.computedStyles).length}`);
                logInfo(`Total ignored: ${resultsOfScraping.ignoreCount}`);
                if (isOriginal) {
                    diffElement.original = resultsOfScraping.computedStyles;
                } else {
                    diffElement.comparand = resultsOfScraping.computedStyles;
                }
                return resultsOfScraping;
            }));
    }
    return Promise.all(promiseArray);
}

export function init() {
    for (let index in crawlerConfig.pages) {
        let page = crawlerConfig.pages[index];
        let beforeAndAfterPromises = [];
        let beforePageUrl = `http://${crawlerConfig.beforeUrl}${page.url}`;
        let afterPageUrl = `http://${crawlerConfig.afterUrl}${page.url}`;
        beforeAndAfterPromises.push(getComputedStylesForPage(page.name, beforePageUrl, true, page.elementsToTest, page.elementsToIgnore));
        beforeAndAfterPromises.push(getComputedStylesForPage(page.name, afterPageUrl, false, page.elementsToTest, page.elementsToIgnore));

        Promise.all(beforeAndAfterPromises).then((allResultsArray) => {
            logInfo(`Diff obj length: ${allResultsArray.length}`);

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
                writeToDisk(createDiffJson(), crawlerConfig.diffOutputPath.dir + crawlerConfig.diffOutputPath.base);
                writeToDisk(createOriginalJson(), crawlerConfig.originalOutputPath.dir + crawlerConfig.originalOutputPath.base);
                writeToDisk(createComparandJson(), crawlerConfig.comparandOutputPath.dir + crawlerConfig.comparandOutputPath.base);
                unloadSelenium();
            }
        }, (err) => {
            console.log(err);
        });
    }
};

let createJson = function(mapper:(IDiffElement)=>any):string {
    return JSON.stringify({
        configFile: crawlerConfig.configFile,
        date: Date.now(),
        original: crawlerConfig.beforeUrl,
        comparator: crawlerConfig.afterUrl,
        pages: crawlerConfig.pages.map((page, index, array)=>{
            return {
                id:page.id,
                name: page.name,
                url:page.url,
                elementsToTest: page.elementsToTest.map(mapper)
            }
        })
    });
};

let createDiffJson = function ():string {
    return createJson(
        (diffElement) => {
            return {
                selector: diffElement.selector,
                diff: diffElement.diff
            }
        }
    );
};

let createOriginalJson = function ():string {
    return createJson((diffElement)=>{
        return {
            selector: diffElement.selector,
            original: diffElement.original
        }
    })
};

let createComparandJson = function ():string {
    return createJson((diffElement)=>{
        return {
            selector: diffElement.selector,
            comparand: diffElement.comparand
        }
    })
};

let writeToDisk = function (contents, path) {
    fs.writeFile(path, contents, function (err) {
        if (err)
            console.error(err);
        console.log('Written!');
    });
};

