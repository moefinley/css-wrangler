/* External config file interfaces */
interface IPageExtConfig {
    id: string;
    name: string;
    path: string;
    elementsToTest: string[];
}

interface ICrawlerExtConfig {
    beforeUrl: string;
    afterUrl: string;
    pages: IPageExtConfig[];
    outputPath: string;
}

/* Internal config object interfaces */
interface ICrawlerInternalConfig {
    beforeUrl: string;
    afterUrl: string;
    pages: Page[];
    outputPath: string //TODO make this a path passed in as an argument
}

interface IDiffElement {
    selector: string;
    original: any;
    comparand: any;
    diff:deepDiff.IDiff[];
}

class Page {
    public elementsToTest:DiffElement[] = [];
    constructor (
        public id:string,
        public name: string,
        public url:string,
        elementsToTest:string[]
    ){
        elementsToTest.forEach(e => this.elementsToTest.push(new DiffElement(e)));
    }
}

class DiffElement implements IDiffElement{
    public original: any = {};
    public comparand: any = {};
    public diff:deepDiff.IDiff[] = [];
    constructor (public selector: string) {

    };
}

class CrawlerConfig implements ICrawlerInternalConfig {
    public beforeUrl: string;
    public afterUrl: string;
    public pages: Page[] = [];
    public outputPath: string;
    constructor(public configFile: string, rawConfig:ICrawlerExtConfig){
        this.beforeUrl = rawConfig.beforeUrl;
        this.afterUrl = rawConfig.afterUrl;
        rawConfig.pages.forEach(e => this.pages.push(new Page(e.id, e.name, e.path, e.elementsToTest)));
        this.outputPath = rawConfig.outputPath;
    }
}

import * as nopt from 'nopt';
import * as path from 'path';

let noptConfigKnownOpts = { "config" : path };
let parsed = <any>nopt(noptConfigKnownOpts, {}, process.argv, 2);


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

let rawConfig = <ICrawlerExtConfig>require(parsed.config).crawlerConfig;
if(!validateRawConfig(rawConfig)) {
    throw "invalid config";
}
export const crawlerConfig = new CrawlerConfig(parsed.config, rawConfig);
