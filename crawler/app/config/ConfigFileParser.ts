import * as fs from 'fs';
import {Page, State} from "../data/page";
import {DiffElement} from "../data/diffElement";
import {Config} from "./Config";
import {ICrawlerExtConfig} from "./ICrawlerExtConfig";
import * as Settings from "../settings/settings";
import * as Data from "../data/data";
import {IPageExtConfig, IPageExtState} from "./IPageExtConfig";
import {IOriginalData} from "./IOriginalData";

let validateRawConfig = function(rawConfig:ICrawlerExtConfig){
    let checkString = function(stringToCheck:string):boolean{
        return typeof stringToCheck === "string" && stringToCheck.length > 0;
    };
    let checkArray = function(arrayToCheck:any[]){
        return typeof arrayToCheck !== "undefined" && Array.isArray(arrayToCheck) && arrayToCheck.length > 0;
    };
    let pageIds = [];


    if(!checkString(rawConfig.beforeUrl)) return false;
    if(!checkString(rawConfig.afterUrl)) return false;
    if(!checkString(rawConfig.outputPath)) return false;

    if(checkArray(rawConfig.pages)){
        let returnVal = true;
        rawConfig.pages.forEach((page)=>{
            if(!checkString(page.id)) returnVal = false; //TODO: Check that all IDs are unique
            if(!checkString(page.name)) returnVal = false;
            if(!checkString(page.path)) returnVal = false;
            if(checkArray(page.elementsToTest)){
                page.elementsToTest.forEach(e => {if(typeof e !== "string") returnVal = false});
            }
            if(pageIds.indexOf(page.id) > -1) returnVal = false;
            pageIds.push(page.id);
        });
        if (!returnVal) return false;
    }

    return true;
};

let rawConfig:ICrawlerExtConfig;
let originalData:IOriginalData = null;

export function readConfigFile(){
    rawConfig = <ICrawlerExtConfig>require(Settings.config).crawlerConfig;
    try {
        if(!Settings.original){
            /* Create new pages ready to be populated */
            let defaultState = [{id:"default", action: ()=>{}}];
            rawConfig.pages.map(page => {
                let diffElements = page.elementsToTest.map((elementSelector)=> new DiffElement(elementSelector));
                page.states = typeof page.states === "undefined" ? defaultState : page.states;

                return new Page(
                    page.id,
                    page.name,
                    page.path,
                    page.states.map(state => new State(state.id, state.action, diffElements)),
                    page.elementsToIgnore
                );
            }).forEach((page, index, rawPages) => {
                Data.addPage(page);
            });
        }
    } catch (e) {
        throw `No config file found or invalid commonjs module : ${e.message}`;
    }

    if(!validateRawConfig(rawConfig)) throw 'Invalid config';

    if(Settings.original){
        try {
            originalData = <IOriginalData>JSON.parse(fs.readFileSync(Settings.original, 'utf8'));
            /* Map the original pages to the data module */
            originalData.pages.map((page) => {

                let rawConfigPage = rawConfig.pages.find((rawConfigPage) => {
                    return page.id === rawConfigPage.id;
                });

                return new Page(
                    page.id,
                    page.name,
                    page.path,
                    page.states.map(state => {
                        let stateAction = rawConfigPage.states.find(rawState => rawState.id === state.id).action;

                        return new State(state.id, stateAction, state.elementsToTest.map(originalDataDiffElement => {
                            let diffElement = new DiffElement(originalDataDiffElement.selector);
                            diffElement.original = originalDataDiffElement.original;
                            return diffElement;
                        }));
                    }),
                    rawConfigPage.elementsToIgnore
                )
            }).forEach((page, index, rawPages) => {
                Data.addPage(page);
            });
        } catch(e) {
            throw 'could not read original file';
        }
    }

    Config.set(
        Settings.getOriginal,
        rawConfig.beforeUrl,
        rawConfig.afterUrl,
        rawConfig.beforeQueryString,
        rawConfig.afterQueryString,
        rawConfig.outputPath
    );
}


