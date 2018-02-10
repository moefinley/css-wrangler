"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const page_1 = require("../data/page");
const diffElement_1 = require("../data/diffElement");
const Config_1 = require("./Config");
const Settings = require("../settings/settings");
const Data = require("../data/data");
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
let rawConfig;
let originalData = null;
function readConfigFile() {
    try {
        rawConfig = require(Settings.config).crawlerConfig;
        if (!Settings.original) {
            /* Create new pages ready to be populated */
            rawConfig.pages.map(page => new page_1.Page(page.id, page.name, page.path, page.elementsToTest.map(elementToTestSelector => new diffElement_1.DiffElement(elementToTestSelector)), page.elementsToIgnore)).forEach((page, index, rawPages) => {
                Data.addPage(page);
            });
        }
    }
    catch (e) {
        throw `No config file found or invalid commonjs module : ${e.message}`;
    }
    if (!validateRawConfig(rawConfig))
        throw 'Invalid config';
    if (Settings.original) {
        try {
            originalData = JSON.parse(fs.readFileSync(Settings.original, 'utf8'));
            /* Map the original pages to the data module */
            originalData.pages.map((page) => {
                let originalDataPage = originalData.pages.find((originalDataPage) => {
                    return page.id === originalDataPage.id;
                });
                return new page_1.Page(page.id, page.name, page.path, originalDataPage.elementsToTest, page.elementsToIgnore);
            }).forEach((page, index, rawPages) => {
                Data.addPage(page);
            });
        }
        catch (e) {
            throw 'could not read original file';
        }
    }
    Config_1.Config.set(Settings.getOriginal, rawConfig.beforeUrl, rawConfig.afterUrl, rawConfig.beforeQueryString, rawConfig.afterQueryString, rawConfig.outputPath);
}
exports.readConfigFile = readConfigFile;
//# sourceMappingURL=ConfigFileParser.js.map