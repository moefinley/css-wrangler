import describe = testing.describe;
import * as testing from "selenium-webdriver/testing";
import * as Settings from "./settings/settings";
import {Config} from './config/Config';
import * as fs from "fs";
import * as deepDiff from "deep-diff";
import * as webdriver from "selenium-webdriver";
import {cleanDiffElement} from "./utils";
import {scrapeComputedStyles} from "./browserScript/scrapeComputedStyles";
import {logInfo, logError, logVerboseInfo, getVerboseLog, getErrorLog} from "./logging/logging";
import promise = webdriver.promise;
import logging = webdriver.logging;
import IThenable = promise.IThenable;
const differ = deepDiff.diff;
import * as Data from "./data/data";
import {WebDriver} from "selenium-webdriver";
import {Page} from "./data/page";

let driver: WebDriver;

function loadSelenium(){
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
    driver.manage().logs().get("browser").then(
        entry => entry.forEach(log => logVerboseInfo("Selenium error: " + log.message))
    );
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
    logVerboseInfo(`Opening url: ${url}`);
    driver.get(url);
    for (let diffElement of elementsToScrape) {
        if(diffElement.error === null){
            promiseArray.push(<IThenable<scrapedObjInterface>>driver.executeScript<scrapedObjInterface>(scrapeComputedStyles, diffElement.selector, elementsToIgnore)
                .then((resultsOfScraping):scrapedObjInterface => {
                    if(typeof resultsOfScraping.error !== "undefined"){
                        logError(`${resultsOfScraping.error} on page ${pageName} ${isOriginalRun ? 'original' : 'comparand'}`);
                        diffElement.error = isOriginalRun ?
                            'Error in browser when gathering original styles for element - is the element selector correct?' :
                            'Error in browser when gathering comparand styles for element - is the element selector correct?';
                    }else{
                        logInfo(`Found ${diffElement.selector} on page ${pageName}`);
                        logVerboseInfo(`Total ignored: ${resultsOfScraping.ignoreCount}`);
                        if (isOriginalRun) {
                            diffElement.original = resultsOfScraping.computedStyles;
                        } else {
                            diffElement.comparand = resultsOfScraping.computedStyles;
                        }
                        return resultsOfScraping;
                    }
                }));
        } else {
            logError(`${diffElement.selector} had errored when gathering original styles and was skipped when gathering comparand styles.`);
            diffElement.error += ' As this errored gathering original styles and was skipped when gathering comparand styles.';
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
    if (Settings.original) currentMode = Modes.useProvidedOriginalAndGenerateDiff;
    if (Settings.getOriginal) currentMode = Modes.getOriginal;
    logVerboseInfo(`current mode is: ${Modes[currentMode]}`);
    return currentMode;
}

export function beforeExit() {
    if(Settings.verbose){
        getVerboseLog().forEach((message)=>{
            console.log(message);
        });
    }
    getErrorLog().forEach((message) =>{
        console.error(message)
    });
}

export function init() {
    loadSelenium();
    let currentMode = getCurrentMode();

    for (let index in Data.pages) {
        let page = Data.pages[index];
        let beforeAndAfterPromises = [];
        let beforePageUrl = `http://${Config.beforeUrl}${page.path}${Config.beforeQueryString}`;
        let afterPageUrl = `http://${Config.afterUrl}${page.path}${Config.afterQueryString}`;

        let addPagePromiseToArray = function(isOriginalRun:boolean) {
            page.states.forEach((state)=>{
                beforeAndAfterPromises.push(getComputedStylesForPage(page.name, isOriginalRun?beforePageUrl:afterPageUrl, isOriginalRun, state.elementsToTest, page.elementsToIgnore));
            });
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
let processComparandAndSaveDiff = function(page:Page, allResultsArray:scrapedObjInterface[][]){
    processBothAndSaveDiff(page, allResultsArray, false);
};

/**
 * The default action of scraping the original and comparand styles and generating a diff object from them.
 *
 * @param page
 * @param allResultsArray
 * @param writeOriginal
 */
let processBothAndSaveDiff = function(page:Page, allResultsArray:scrapedObjInterface[][], writeOriginal:boolean = true){
    page.states.forEach((state)=>{
        for (let index in state.elementsToTest) {
            let diffElement = state.elementsToTest[index];
            if(diffElement.error === null){
                diffElement.diff = differ(diffElement.original, diffElement.comparand);
                cleanDiffElement(diffElement);
            }
        }
    });

    page.states.forEach((state)=>{
        state.elementsToTest = state.elementsToTest.filter((diffElement) => {
            /**
             * Keep elements that have diffs or should present an error
             */
            return (typeof diffElement.diff !== 'undefined' && diffElement.diff.length > 0)
                || diffElement.error !== null;
        });
    });


    page.isProcessed = true;

    if (checkAllPagesProcessed()) {
        logInfo('last page complete');
        writeToDisk(createDiffJson(), Config.diffOutputPath);
        if(writeOriginal) writeToDisk(createOriginalJson(), Config.originalOutputPath);
        writeToDisk(createComparandJson(), Config.comparandOutputPath);
        unloadSelenium();
    }
};

/**
 * When the --getOriginal switch is passed this function is used to only get original styles and save them to disk.
 * No comparand or diff object is created.
 *
 * @param page
 */
let parseRawOriginalAndSave = function(page:Page):void{
    page.isProcessed = true;
    if (checkAllPagesProcessed()) {
        writeToDisk(createOriginalJson(), Config.originalOutputPath);
        unloadSelenium();
    }
};

let checkAllPagesProcessed = function ():boolean{
    let returnVal = true;
    Data.pages.forEach((page)=>{
        if(page.isProcessed === false) returnVal = false;
    });
    return returnVal;
};

let createJson = function(mapper:(IDiffElement)=>any):string {
    return JSON.stringify({
        configFile: Settings.config,
        date: Date.now(),
        original: Config.beforeUrl,
        comparator: Config.afterUrl,
        pages: Data.pages.map((page, index, array)=>{
            return {
                id:page.id,
                name: page.name,
                path:page.path,
                states: page.states.map((state)=>{
                    return {
                        id: state.id,
                        elementsToTest: state.elementsToTest.map(mapper)
                    }
                }),

            }
        })
    });
};

let createDiffJson = function ():string {
    return createJson(
        (diffElement) => {
            if(diffElement.error !== null){
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
        if(diffElement.error !== null){
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
        if(diffElement.error !== null){
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

