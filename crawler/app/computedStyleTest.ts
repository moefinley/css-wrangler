import describe = testing.describe;
import * as testing from "selenium-webdriver/testing";
import {crawlerConfig} from './configParser';
import * as fs from "fs";
import * as path from 'path';
import * as deepDiff from "deep-diff";
import * as webdriver from "selenium-webdriver";
import {cleanDiffElement} from "./CleanDiffElement";
import {scrapeComputedStyles} from "./browserScript/scrapeComputedStyles";
import {logInfo, logError, logVerboseInfo} from "./logging/logging";
import promise = webdriver.promise;
import logging = webdriver.logging;
import diff = require("deep-diff");
import IThenable = promise.IThenable;
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
    isOriginalRun:boolean,
    elementsToScrape: diffElementInterface[],
    elementsToIgnore:string[]
):Promise<scrapedObjInterface[]> {
    let promiseArray:IThenable<scrapedObjInterface>[] = [];

    driver.get(url);
    for (let diffElement of elementsToScrape) {
        if(typeof diffElement.error === 'undefined'){
            promiseArray.push(<IThenable<scrapedObjInterface>>driver.executeScript<scrapedObjInterface>(scrapeComputedStyles, diffElement.selector, elementsToIgnore)
                .then((resultsOfScraping):scrapedObjInterface => {
                    if(typeof resultsOfScraping.error !== "undefined"){
                        logError(resultsOfScraping.error + ' on page ' + pageName);
                        diffElement.error = isOriginalRun ?
                            'Error in browser when gathering original styles for element - is the element selector correct?' :
                            'Error in browser when gathering comparand styles for element - is the element selector correct?';
                    }else{
                        logInfo(`I resolved: ${diffElement.selector} on page: ${pageName} with ${Object.keys(resultsOfScraping.computedStyles).length}`);
                        logInfo(`Total ignored: ${resultsOfScraping.ignoreCount}`);
                        if (isOriginalRun) {
                            diffElement.original = resultsOfScraping.computedStyles;
                        } else {
                            diffElement.comparand = resultsOfScraping.computedStyles;
                        }
                        return resultsOfScraping;
                    }
                }));
        } else {
            diffElement.error += ' As this errored gathering original styles is was skipped when gathering comparand styles.';
        }

    }
    return Promise.all<scrapedObjInterface>(<PromiseLike<scrapedObjInterface>[]>promiseArray);
}

enum Modes {
    "getOriginal",
    "getBothAndGenerateDiff",
    "useProvidedOriginalAndGenerateDiff"
}
function getCurrentMode() {
    let currentMode: Modes = Modes.getBothAndGenerateDiff;
    if (crawlerConfig.originalData !== null) currentMode = Modes.useProvidedOriginalAndGenerateDiff;
    if (crawlerConfig.getOriginal) currentMode = Modes.getOriginal;
    logVerboseInfo(`current mode is: ${Modes[currentMode]}`);
    return currentMode;
}

export function init() {
    let currentMode = getCurrentMode();

    for (let index in crawlerConfig.pages) {
        let page = crawlerConfig.pages[index];
        let beforeAndAfterPromises = [];
        let beforePageUrl = `http://${crawlerConfig.beforeUrl}${page.url}${crawlerConfig.beforeQueryString}`;
        let afterPageUrl = `http://${crawlerConfig.afterUrl}${page.url}${crawlerConfig.afterQueryString}`;

        let addPagePromiseToArray = function(isOriginalRun:boolean) {
            beforeAndAfterPromises.push(getComputedStylesForPage(page.name, isOriginalRun?beforePageUrl:afterPageUrl, isOriginalRun, page.elementsToTest, page.elementsToIgnore));
        };
        if(currentMode === Modes.getBothAndGenerateDiff){
            addPagePromiseToArray(true);
            addPagePromiseToArray(false);
        }

        if(currentMode === Modes.useProvidedOriginalAndGenerateDiff){
            addPagePromiseToArray(false);
        }

        if(currentMode === Modes.getOriginal){
            addPagePromiseToArray(true);
        }

        Promise.all(beforeAndAfterPromises)
            .then((allResultsArray) => {
                if(currentMode === Modes.getOriginal) {
                    parseRawOriginalAndSave(page);
                } else if(currentMode === Modes.useProvidedOriginalAndGenerateDiff){
                    processComparandAndSaveDiff(page, allResultsArray);
                } else {
                    processBothAndSaveDiff(page, allResultsArray);
                }
        }, (error) => {
            logError(error);
        });
    }
}

/**
 * When an original has been provided
 *
 * @param page
 * @param allResultsArray
 */
let processComparandAndSaveDiff = function(page:pageInterface, allResultsArray:scrapedObjInterface[][]){
    processBothAndSaveDiff(page, allResultsArray, false);
};

/**
 * The default action of scraping the original and comparand styles and generating a diff object from them.
 *
 * @param page
 * @param allResultsArray
 * @param writeOriginal
 */
let processBothAndSaveDiff = function(page:pageInterface, allResultsArray:scrapedObjInterface[][], writeOriginal:boolean = true){
    for (let index in page.elementsToTest) {
        let diffElement = page.elementsToTest[index];
        if(typeof diffElement.error === 'undefined'){
            diffElement.diff = differ(diffElement.original, diffElement.comparand);
            cleanDiffElement(diffElement);
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
        logInfo('last page complete');
        writeToDisk(createDiffJson(), crawlerConfig.diffOutputPath);
        if(writeOriginal) writeToDisk(createOriginalJson(), crawlerConfig.originalOutputPath);
        writeToDisk(createComparandJson(), crawlerConfig.comparandOutputPath);
        unloadSelenium();
    }
};

/**
 * When the --getOriginal switch is passed this function is used to only get original styles and save them to disk.
 * No comparand or diff object is created.
 *
 * @param page
 */
let parseRawOriginalAndSave = function(page:pageInterface):void{
    page.isProcessed = true;
    if (checkAllPagesProcessed()) {
        writeToDisk(createOriginalJson(), crawlerConfig.originalOutputPath);
        unloadSelenium();
    }
};

let checkAllPagesProcessed = function ():boolean{
    let returnVal = true;
    crawlerConfig.pages.forEach((page)=>{
        if(page.isProcessed === false) returnVal = false;
    });
    return returnVal;
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
            if(typeof diffElement.error !== 'undefined'){
                return {
                    selector: diffElement.selector,
                    error: diffElement.error
                }
            }
            return {
                selector: diffElement.selector,
                diff: diffElement.diff
            }
        }
    );
};

let createOriginalJson = function ():string {
    return createJson((diffElement)=>{
        if(typeof diffElement.error !== "undefined"){
            return {
                selector: diffElement.selector,
                error: diffElement.error
            }
        }
        return {
            selector: diffElement.selector,
            original: diffElement.original
        }
    })
};

let createComparandJson = function ():string {
    return createJson((diffElement)=>{
        if(typeof diffElement.error !== "undefined"){
            return {
                selector: diffElement.selector,
                error: diffElement.error
            }
        }
        return {
            selector: diffElement.selector,
            comparand: diffElement.comparand
        }
    })
};

let writeToDisk = function (contents, pathToFile) {
    fs.writeFile(pathToFile, contents, function (err) {
        if (err)
            console.error(err);
        console.log('Written to ' + pathToFile);
    });
};

