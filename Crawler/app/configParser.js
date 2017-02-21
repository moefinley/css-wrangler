"use strict";
var nopt = require('nopt');
var path = require('path');
var fs = require('fs');
var Page_1 = require("./Page");
var DiffElement_1 = require("./diffElement");
var CrawlerConfig = (function () {
    function CrawlerConfig(configFile, getOriginal, rawConfig, originalData) {
        var _this = this;
        this.configFile = configFile;
        this.getOriginal = getOriginal;
        this.pages = [];
        this.originalData = originalData;
        this.beforeUrl = rawConfig.beforeUrl;
        this.afterUrl = rawConfig.afterUrl;
        this.diffOutputPath = path.parse(rawConfig.outputPath);
        this.originalOutputPath = path.parse(this.diffOutputPath.root + this.diffOutputPath.name + "-original" + this.diffOutputPath.ext);
        this.comparandOutputPath = path.parse(this.diffOutputPath.root + this.diffOutputPath.name + "-comparand" + this.diffOutputPath.ext);
        if (this.originalData === null) {
            this.pages = rawConfig.pages.map(function (page) { return new Page_1.Page(page.id, page.name, page.path, page.elementsToTest.map(function (elementToTestSelector) { return new DiffElement_1.DiffElement(elementToTestSelector); }), page.elementsToIgnore); });
        }
        else {
            this.pages = rawConfig.pages.map(function (page) {
                var originalDataPage = _this.originalData.pages.find(function (originalDataPage) {
                    return page.id === originalDataPage.id;
                });
                return new Page_1.Page(page.id, page.name, page.path, originalDataPage.elementsToTest, page.elementsToIgnore);
            });
        }
    }
    return CrawlerConfig;
}());
var validateRawConfig = function (rawConfig) {
    var checkString = function (stringToCheck) {
        return typeof stringToCheck === "string" && stringToCheck.length > 0;
    };
    var checkArray = function (arrayToCheck) {
        return typeof arrayToCheck !== "undefined" && Array.isArray(arrayToCheck) && arrayToCheck.length > 0;
    };
    var pageIds = [];
    if (!checkString(rawConfig.beforeUrl))
        return false;
    if (!checkString(rawConfig.afterUrl))
        return false;
    if (!checkString(rawConfig.outputPath))
        return false;
    if (checkArray(rawConfig.pages)) {
        var returnVal_1 = true;
        rawConfig.pages.forEach(function (page) {
            if (!checkString(page.id))
                returnVal_1 = false; //TODO: Check that all IDs are unique
            if (!checkString(page.name))
                returnVal_1 = false;
            if (!checkString(page.path))
                returnVal_1 = false;
            if (checkArray(page.elementsToTest)) {
                page.elementsToTest.forEach(function (e) { if (typeof e !== "string")
                    returnVal_1 = false; });
            }
            if (pageIds.indexOf(page.id) > -1)
                returnVal_1 = false;
            pageIds.push(page.id);
        });
        if (!returnVal_1)
            return false;
    }
    return true;
};
var noptConfigKnownOpts = {
    'config': path,
    'getOriginal': Boolean,
    'original': path
};
var parsed = nopt(noptConfigKnownOpts, {}, process.argv, 2);
var rawConfig;
try {
    rawConfig = require(parsed.config).crawlerConfig;
}
catch (e) {
    throw "No config file found : " + e.message;
}
if (!validateRawConfig(rawConfig))
    throw 'Invalid config';
var originalData = null;
if (typeof parsed.original !== "undefined") {
    try {
        originalData = JSON.parse(fs.readFileSync(parsed.original, 'utf8'));
    }
    catch (e) {
        throw 'could not read original file';
    }
}
exports.crawlerConfig = new CrawlerConfig(parsed.config, parsed.getOriginal, rawConfig, originalData);
