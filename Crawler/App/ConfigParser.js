"use strict";
const nopt = require('nopt');
const path = require('path');
const Page_1 = require("./Page");
class CrawlerConfig {
    constructor(configFile, rawConfig) {
        this.configFile = configFile;
        this.pages = [];
        this.beforeUrl = rawConfig.beforeUrl;
        this.afterUrl = rawConfig.afterUrl;
        rawConfig.pages.forEach(e => this.pages.push(new Page_1.Page(e.id, e.name, e.path, e.elementsToTest, e.elementsToIgnore)));
        this.diffOutputPath = path.parse(rawConfig.outputPath);
        this.originalOutputPath = path.parse(this.diffOutputPath.root + this.diffOutputPath.name + "-original" + this.diffOutputPath.ext);
        this.comparandOutputPath = path.parse(this.diffOutputPath.root + this.diffOutputPath.name + "-comparand" + this.diffOutputPath.ext);
    }
}
let validateRawConfig = function (rawConfig) {
    let checkString = function (stringToCheck) {
        return typeof stringToCheck === "string" && stringToCheck.length > 0;
    };
    let checkArray = function (arrayToCheck) {
        return typeof arrayToCheck !== "undefined" && Array.isArray(arrayToCheck) && arrayToCheck.length > 0;
    };
    let pageIds = [];
    if (!checkString(rawConfig.beforeUrl))
        return false;
    if (!checkString(rawConfig.afterUrl))
        return false;
    if (!checkString(rawConfig.outputPath))
        return false;
    if (checkArray(rawConfig.pages)) {
        let returnVal = true;
        rawConfig.pages.forEach((page) => {
            if (!checkString(page.id))
                returnVal = false;
            if (!checkString(page.name))
                returnVal = false;
            if (!checkString(page.path))
                returnVal = false;
            if (checkArray(page.elementsToTest)) {
                page.elementsToTest.forEach(e => { if (typeof e !== "string")
                    returnVal = false; });
            }
            if (pageIds.indexOf(page.id) > -1)
                returnVal = false;
            pageIds.push(page.id);
        });
        if (!returnVal)
            return false;
    }
    return true;
};
let noptConfigKnownOpts = { "config": path };
let parsed = nopt(noptConfigKnownOpts, {}, process.argv, 2);
let rawConfig;
try {
    rawConfig = require(parsed.config).crawlerConfig;
}
catch (e) {
    throw "No config file found : " + e.message;
}
if (!validateRawConfig(rawConfig)) {
    throw "invalid config";
}
exports.crawlerConfig = new CrawlerConfig(parsed.config, rawConfig);
//# sourceMappingURL=ConfigParser.js.map