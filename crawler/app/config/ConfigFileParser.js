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
    rawConfig = require(Settings.config).crawlerConfig;
    try {
        if (!Settings.original) {
            /* Create new pages ready to be populated */
            let defaultState = [{ id: "default", action: () => { } }];
            rawConfig.pages.map(page => {
                let diffElements = page.elementsToTest.map((elementSelector) => new diffElement_1.DiffElement(elementSelector));
                page.states = typeof page.states === "undefined" ? defaultState : page.states;
                return new page_1.Page(page.id, page.name, page.path, page.states.map(state => new page_1.State(state.id, state.action, diffElements)), page.elementsToIgnore);
            }).forEach((page, index, rawPages) => {
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
                let rawConfigPage = rawConfig.pages.find((rawConfigPage) => {
                    return page.id === rawConfigPage.id;
                });
                return new page_1.Page(page.id, page.name, page.path, page.states.map(state => {
                    let stateAction = rawConfigPage.states.find(rawState => rawState.id === state.id).action;
                    return new page_1.State(state.id, stateAction, state.elementsToTest.map(originalDataDiffElement => {
                        let diffElement = new diffElement_1.DiffElement(originalDataDiffElement.selector);
                        diffElement.original = originalDataDiffElement.original;
                        return diffElement;
                    }));
                }), rawConfigPage.elementsToIgnore);
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