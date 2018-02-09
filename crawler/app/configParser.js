"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nopt = require("nopt");
const path = require("path");
const fs = require("fs");
const Page_1 = require("./Page");
const diffElement_1 = require("./diffElement");
const opn = require("opn");
class CrawlerConfig {
    constructor(configFile, getOriginal, rawConfig, originalData) {
        this.configFile = configFile;
        this.getOriginal = getOriginal;
        this.pages = [];
        this.originalData = originalData;
        this.beforeUrl = rawConfig.beforeUrl;
        this.afterUrl = rawConfig.afterUrl;
        this.beforeQueryString = rawConfig.beforeQueryString;
        this.afterQueryString = rawConfig.afterQueryString;
        let outputPath = path.parse(rawConfig.outputPath);
        this.diffOutputPath = path.normalize(rawConfig.outputPath);
        this.originalOutputPath = path.join(outputPath.dir, outputPath.name + "-original" + outputPath.ext);
        this.comparandOutputPath = path.join(outputPath.dir, outputPath.name + "-comparand" + outputPath.ext);
        if (this.originalData === null) {
            this.pages = rawConfig.pages.map(page => new Page_1.Page(page.id, page.name, page.path, page.elementsToTest.map(elementToTestSelector => new diffElement_1.DiffElement(elementToTestSelector)), page.elementsToIgnore));
        }
        else {
            this.pages = rawConfig.pages.map((page) => {
                let originalDataPage = this.originalData.pages.find((originalDataPage) => {
                    return page.id === originalDataPage.id;
                });
                return new Page_1.Page(page.id, page.name, page.path, originalDataPage.elementsToTest, page.elementsToIgnore);
            });
        }
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
                returnVal = false; //TODO: Check that all IDs are unique
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
let noptConfigKnownOpts = {
    'config': path,
    'getOriginal': Boolean,
    'original': path,
    'showResults': Boolean,
    'verbose': Boolean
};
let parsed = nopt(noptConfigKnownOpts, {}, process.argv, 2);
exports.verboseLogging = parsed.verbose;
exports.showResults = parsed.showResults;
let rawConfig;
let originalData = null;
let configObject = null;
if (parsed.showResults) {
    console.log('opening url');
    opn(path.resolve(__dirname, '../../results/results.html')).then(() => {
        process.exit();
    });
}
else {
    try {
        rawConfig = require(parsed.config).crawlerConfig;
    }
    catch (e) {
        throw `No config file found or invalid commonjs module : ${e.message}`;
    }
    if (!validateRawConfig(rawConfig))
        throw 'Invalid config';
    if (typeof parsed.original !== "undefined") {
        try {
            originalData = JSON.parse(fs.readFileSync(parsed.original, 'utf8'));
        }
        catch (e) {
            throw 'could not read original file';
        }
    }
    configObject = new CrawlerConfig(parsed.config, parsed.getOriginal, rawConfig, originalData);
}
exports.crawlerConfig = configObject;
//# sourceMappingURL=configParser.js.map