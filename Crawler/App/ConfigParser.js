"use strict";
class Page {
    constructor(id, name, url, elementsToTest) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.elementsToTest = [];
        elementsToTest.forEach(e => this.elementsToTest.push(new DiffElement(e)));
    }
}
class DiffElement {
    constructor(selector) {
        this.selector = selector;
        this.original = {};
        this.comparand = {};
        this.diff = [];
    }
    ;
}
class CrawlerConfig {
    constructor(rawConfig) {
        this.pages = [];
        this.beforeUrl = rawConfig.beforeUrl;
        this.afterUrl = rawConfig.afterUrl;
        rawConfig.pages.forEach(e => this.pages.push(new Page(e.id, e.name, e.path, e.elementsToTest)));
        this.outputPath = rawConfig.outputPath;
    }
}
const nopt = require('nopt');
const path = require('path');
let noptConfigKnownOpts = { "config": path };
let parsed = nopt(noptConfigKnownOpts, {}, process.argv, 2);
let rawConfig = require(parsed.config).crawlerConfig;
exports.crawlerConfig = new CrawlerConfig(rawConfig);
//# sourceMappingURL=ConfigParser.js.map