"use strict";
class Page {
    constructor(id, name, url, elementsToTest) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.elementsToTest = elementsToTest;
    }
}
class DiffElement {
    constructor(selector) {
        this.selector = selector;
        this.original = {};
        this.comparend = {};
    }
    ;
}
const nopt = require('nopt');
const path = require('path');
let knownOpts = { "config": path };
let parsed = nopt(knownOpts, {}, process.argv, 2);
console.log(parsed);
let rawConfig = require(parsed.config);
class CrawlerConfig {
    constructor() {
    }
}
//# sourceMappingURL=ConfigParser.js.map