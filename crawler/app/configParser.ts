import * as nopt from 'nopt';
import * as path from 'path';
import * as fs from 'fs';
import {ParsedPath} from "path";
import {Page} from "./Page";
import {DiffElement} from "./diffElement";

/* External config file interfaces */
interface IPageExtConfig {
    id: string;
    name: string;
    path: string;
    elementsToTest: string[];
    elementsToIgnore?: string[];
}

interface ICrawlerExtConfig {
    beforeUrl: string;
    afterUrl: string;
    pages: IPageExtConfig[];
    outputPath: string;
}

/* Internal config object interfaces */
interface ICrawlerInternalConfig {
    getOriginal: boolean;
    configFile: string;
    diffOutputPath: string;
    originalOutputPath: string;
    comparandOutputPath: string;
    //TODO: Create three versions of the interface for with/without original and diff
    originalData: ICrawlerInternalConfig;
    beforeUrl: string;
    afterUrl: string;
    pages: Page[];
}

class CrawlerConfig implements ICrawlerInternalConfig {
    diffOutputPath: string;
    originalOutputPath: string;
    comparandOutputPath: string;
    originalData: ICrawlerInternalConfig | null;
    beforeUrl: string;
    afterUrl: string;
    pages: Page[] = [];
    constructor(
        public configFile: string,
        public getOriginal: boolean,
        rawConfig:ICrawlerExtConfig,
        originalData: ICrawlerInternalConfig | null
    ){
        this.originalData = originalData;
        this.beforeUrl = rawConfig.beforeUrl;
        this.afterUrl = rawConfig.afterUrl;
        let outputPath = path.parse(rawConfig.outputPath);
        this.diffOutputPath = path.normalize(rawConfig.outputPath);
        this.originalOutputPath = path.join(outputPath.dir, outputPath.name + "-original" + outputPath.ext);
        this.comparandOutputPath = path.join(outputPath.dir, outputPath.name + "-comparand" + outputPath.ext);

        if(this.originalData === null){
            this.pages = rawConfig.pages.map(page => new Page(
                page.id,
                page.name,
                page.path,
                page.elementsToTest.map(elementToTestSelector => new DiffElement(elementToTestSelector)),
                page.elementsToIgnore
            ));
        } else {
            this.pages = rawConfig.pages.map((page) => {
                let originalDataPage = this.originalData.pages.find((originalDataPage)=>{
                    return page.id === originalDataPage.id;
                });
                return new Page(
                    page.id,
                    page.name,
                    page.path,
                    originalDataPage.elementsToTest,
                    page.elementsToIgnore
                )
            });
        }
    }
}

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

let noptConfigKnownOpts = {
    'config' : path,
    'getOriginal' : Boolean,
    'original' : path
};
let parsed = <any>nopt(noptConfigKnownOpts, {}, process.argv, 2);

let rawConfig;
try {
    rawConfig = <ICrawlerExtConfig>require(parsed.config).crawlerConfig;
} catch (e) {
    throw `No config file found or invalid commonjs module : ${e.message}`;
}

if(!validateRawConfig(rawConfig)) throw 'Invalid config';

let originalData = null;
if(typeof parsed.original !== "undefined"){
    try {
        originalData = JSON.parse(fs.readFileSync(parsed.original, 'utf8'));
    } catch(e) {
        throw 'could not read original file';
    }

}

export const crawlerConfig = new CrawlerConfig(
    parsed.config,
    parsed.getOriginal,
    rawConfig,
    originalData
);
