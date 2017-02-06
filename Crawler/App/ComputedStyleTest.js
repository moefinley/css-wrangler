"use strict";
const ConfigParser_1 = require('./ConfigParser');
const fs = require("fs");
const deepDiff = require("deep-diff");
const url = require("url");
const webdriver = require("selenium-webdriver");
const differ = deepDiff.diff;
let driver = new webdriver.Builder()
    .forBrowser('chrome')
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();
var getComputedStyles = function (parentElementQuerySelector) {
    /* This is run in the browser and therefore must stay cross compatible */
    var returnObj = {};
    var parentElement = document.querySelector(parentElementQuerySelector); //TODO: Cross compatible selector
    if (parentElement === null) {
        throw 'could not find element';
    }
    var Xpath = {};
    Xpath.getElementXPath = function (element) {
        if (element && element.id)
            return '//*[@id="' + element.id + '"]';
        else
            return Xpath.getElementTreeXPath(element);
    };
    Xpath.getElementTreeXPath = function (element) {
        var paths = [];
        // Use nodeName (instead of localName) so namespace prefix is included (if any).
        for (; element && element.nodeType == Node.ELEMENT_NODE; element = element.parentNode) {
            var index = 0;
            var hasFollowingSiblings = false;
            for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
                // Ignore document type declaration.
                if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE)
                    continue;
                if (sibling.nodeName == element.nodeName)
                    ++index;
            }
            for (var sibling = element.nextSibling; sibling && !hasFollowingSiblings; sibling = sibling.nextSibling) {
                if (sibling.nodeName == element.nodeName)
                    hasFollowingSiblings = true;
            }
            var tagName = (element.prefix ? element.prefix + ":" : "") + element.localName;
            var pathIndex = (index || hasFollowingSiblings ? "[" + (index + 1) + "]" : "");
            paths.splice(0, 0, tagName + pathIndex);
        }
        return paths.length ? "/" + paths.join("/") : null;
    };
    function iterateThroughStyleProperties(theElement) {
        var returnObj = {};
        var styleDeclaration = window.getComputedStyle(theElement, null);
        for (var j = 0; j < styleDeclaration.length; j++) {
            var propertyName = styleDeclaration.item(j);
            returnObj[propertyName] = styleDeclaration.getPropertyValue(propertyName);
        }
        return returnObj;
    }
    function iterateThroughChildren(thisElement, thisObject) {
        thisObject.styleProperties = iterateThroughStyleProperties(thisElement);
        var thisElementsChildren = thisElement.children;
        thisObject.children = {};
        for (var i = 0; i < thisElementsChildren.length; i++) {
            var childElement = thisElementsChildren[i];
            thisObject.children[Xpath.getElementXPath(childElement)] = {};
            iterateThroughChildren(childElement, thisObject.children[Xpath.getElementXPath(childElement)]);
        }
    }
    iterateThroughChildren(parentElement, returnObj);
    return returnObj;
};
function unloadSelenium() {
    driver.close();
}
exports.compareComputedStyles = function () {
    function getAllElementsComputedStyles(page, url, isOriginal) {
        let promiseArray = [];
        driver.get(url);
        for (let diffElement of page.elementsToTest) {
            promiseArray.push(driver.executeScript(getComputedStyles, diffElement.selector)
                .then((computedStyles) => {
                console.log(`I resolved: ${diffElement.selector} on page: ${page.name} with ${Object.keys(computedStyles).length}`);
                if (isOriginal) {
                    diffElement.original = computedStyles;
                }
                else {
                    diffElement.comparand = computedStyles;
                }
            }));
        }
        return Promise.all(promiseArray);
    }
    for (let index in ConfigParser_1.crawlerConfig.pages) {
        let page = ConfigParser_1.crawlerConfig.pages[index];
        let beforeAndAfterPromises = [];
        let beforePageUrl = "http://" + ConfigParser_1.crawlerConfig.beforeUrl + page.url;
        let afterPageUrl = "http://" + ConfigParser_1.crawlerConfig.afterUrl + page.url;
        beforeAndAfterPromises.push(getAllElementsComputedStyles(page, beforePageUrl, true));
        beforeAndAfterPromises.push(getAllElementsComputedStyles(page, afterPageUrl, false));
        Promise.all(beforeAndAfterPromises).then((allResultsArray) => {
            console.log('Diff obj length: ' + allResultsArray.length);
            for (let index in page.elementsToTest) {
                let diffElement = page.elementsToTest[index];
                diffElement.diff = differ(diffElement.original, diffElement.comparand);
                cleanup(diffElement);
            }
            page.elementsToTest = page.elementsToTest.filter((diffElement) => {
                return typeof diffElement.diff !== 'undefined' && diffElement.diff.length > 0;
            });
            if (index == (ConfigParser_1.crawlerConfig.pages.length - 1).toString()) {
                console.log('last page complete');
                writeToDisk(createOutputJsonForAllPages());
                unloadSelenium();
            }
        }, (err) => {
            console.log(err);
        });
    }
};
let cleanup = function (diffElement) {
    if (typeof diffElement.diff !== 'undefined') {
        diffElement.diff = diffElement.diff.filter((element, index, array) => {
            if (element.kind === "E") {
                let lhs = element.lhs;
                let rhs = element.rhs;
                /* Remove URLs where the only difference is the domain */
                if (lhs.indexOf('url(') === 0 && rhs.indexOf('url(') === 0) {
                    if (lhs.indexOf('"') > -1 || rhs.indexOf('"') > -1) {
                        lhs = lhs.replace(/"/g, '');
                        rhs = rhs.replace(/"/g, '');
                    }
                    let lhsUrl = url.parse(lhs.substring(4, lhs.length - 1));
                    let rhsUrl = url.parse(rhs.substring(4, rhs.length - 1));
                    if (lhsUrl.path === rhsUrl.path) {
                        console.log('removing: ' + lhs);
                        return false;
                    }
                }
            }
            return true;
        });
    }
};
let createOutputJsonForAllPages = function () {
    let output = {
        date: Date.now(),
        original: ConfigParser_1.crawlerConfig.beforeUrl,
        comparator: ConfigParser_1.crawlerConfig.afterUrl,
        pages: ConfigParser_1.crawlerConfig.pages
    };
    return JSON.stringify(output);
};
let writeToDisk = function (contents) {
    let outputPath = ConfigParser_1.crawlerConfig.outputPath;
    fs.writeFile(outputPath, contents, function (err) {
        if (err)
            console.error(err);
        console.log('Written!');
    });
};
//# sourceMappingURL=ComputedStyleTest.js.map