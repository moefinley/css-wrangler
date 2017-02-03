interface DiffElementSource {
    selector: string;
    original: any;
    comparand: any;
    diff:deepDiff.IDiff[];
}

interface IPageSource {
    id: string;
    name: string;
    url: string;
    elementsToTest: DiffElementSource[];
}

interface ICrawlerConfig {
    beforeUrl: string;
    afterUrl: string;
    pages: IPageSource[];
    outputPath: string;
}

class Page {
    constructor (
        public id:string,
        public name: string,
        public url:string,
        public elementsToTest:DiffElement[]) {
    }
}

class DiffElement {
    public original: any = {};
    public comparend: any = {};
    public diff:deepDiff.IDiff;
    constructor (public selector: string) {
    };
}

import * as nopt from 'nopt';
import * as path from 'path';

let knownOpts = { "config" : path };
let parsed = <any>nopt(knownOpts, {}, process.argv, 2);
console.log(parsed);

let rawConfig = require(parsed.config);

class CrawlerConfig implements ICrawlerConfig {
    constructor(){

    }
}

