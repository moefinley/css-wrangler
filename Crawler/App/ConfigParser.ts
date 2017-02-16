import * as nopt from 'nopt';
import * as path from 'path';
import {ParsedPath} from "path";
import {Page} from "./Page";

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
    diffOutputPath: ParsedPath;
    originalOutputPath: ParsedPath;
    comparandOutputPath: ParsedPath;
    beforeUrl: string;
    afterUrl: string;
    pages: Page[];
}

class CrawlerConfig implements ICrawlerInternalConfig {
    diffOutputPath: ParsedPath;
    originalOutputPath: ParsedPath;
    comparandOutputPath: ParsedPath;
    beforeUrl: string;
    afterUrl: string;
    pages: Page[] = [];
    constructor(
        public configFile: string,
        public getOriginal: boolean,
        rawConfig:ICrawlerExtConfig
    ){
        this.beforeUrl = rawConfig.beforeUrl;
        this.afterUrl = rawConfig.afterUrl;
        rawConfig.pages.forEach(e => this.pages.push(new Page(e.id, e.name, e.path, e.elementsToTest, e.elementsToIgnore)));
        this.diffOutputPath = path.parse(rawConfig.outputPath);
        this.originalOutputPath = path.parse(this.diffOutputPath.root + this.diffOutputPath.name + "-original" + this.diffOutputPath.ext);
        this.comparandOutputPath = path.parse(this.diffOutputPath.root + this.diffOutputPath.name + "-comparand" + this.diffOutputPath.ext);
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
            if(!checkString(page.id)) returnVal = false;
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
    "config" : path,
    "getOriginal" : Boolean
};
let parsed = <any>nopt(noptConfigKnownOpts, {}, process.argv, 2);

let rawConfig;
try {
    rawConfig = <ICrawlerExtConfig>require(parsed.config).crawlerConfig;
} catch (e) {
    throw "No config file found : " + e.message;
}

if(!validateRawConfig(rawConfig)) {
    throw "invalid config";
}
export const crawlerConfig = new CrawlerConfig(parsed.config, parsed.getOriginal, rawConfig);
