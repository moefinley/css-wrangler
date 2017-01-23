const fs = require('fs');
const deepDiff = require('deep-diff');
const differ = deepDiff.diff;
const url = require('url');

const Page = function (id, name, url, elementsToTest) {
    let self = this;

    self.id = id;
    self.name = name;
    self.url = url;
    self.elementsToTest = elementsToTest;
};
const DiffElement = function (selector) {
    let self = this;

    self.selector = selector;
    self.original = {};
    self.comparand = {};
    self.diff = {};
};

const config = {
    beforeUrl: "consumer.xperthrsystest.rbidev.ds",
    afterUrl: "consumer.xperthrlocal.rbidev.ds",
    pages: [
        new Page('home', 'Home', '/', [new DiffElement('.xhr-header-container')]),
        new Page('employment-law-manual', 'Employment law manual', '/employment-law-manual/', [new DiffElement('.xhr-header-container')])
    ],
    outputPath: 'd:/output.txt'
};

var getComputedStyles = function (parentElementQuerySelector) {
    /* This is run in the browser and therefore must stay cross compatible */
    var returnObj = {};
    var parentElement = document.querySelector(parentElementQuerySelector); //TODO: Cross compatible selector
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

            for (var sibling = element.nextSibling; sibling && !hasFollowingSiblings;
                 sibling = sibling.nextSibling) {
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

let compareComputedStyles = function (scope) {
    browser.ignoreSynchronization = true;

    function getAllElementsComputedStyles(browser, page, url, isOriginal) {
        let elementComputedStylesArray = [];
        let promiseArray = [];

        browser.get(url);
        for (let diffElement of page.elementsToTest) {
            promiseArray.push(browser.executeScript(getComputedStyles, diffElement.selector)
                .then((computedStyles) => {
                    console.log(`I resolved: ${diffElement.selector} on page: ${page.name} with ${Object.keys(computedStyles).length}`);
                    if (isOriginal) {
                        diffElement.original = computedStyles;
                    } else {
                        diffElement.comparand = computedStyles;
                    }
                }));
        }
        return Promise.all(promiseArray);
    }

    for (let index in config.pages) {
        let page = config.pages[index];
        let beforeAndAfterPromises = [];
        let beforePageUrl = "http://" + config.beforeUrl + page.url;
        let afterPageUrl = "http://" + config.afterUrl + page.url;
        beforeAndAfterPromises.push(getAllElementsComputedStyles(browser, page, beforePageUrl, true));
        beforeAndAfterPromises.push(getAllElementsComputedStyles(browser, page, afterPageUrl, false));

        Promise.all(beforeAndAfterPromises).then((allResultsArray) => {
            console.log('Diff obj length: ' + allResultsArray.length);

            for (let diffElement of page.elementsToTest) {
                diffElement.diff = differ(diffElement.original, diffElement.comparand);
                console.log('1. diff length: ' + diffElement.diff.length);
                cleanup(diffElement);
                console.log('3. diff length: ' + diffElement.diff.length);
            }
            if (index == (config.pages.length - 1)) {
                console.log('last page complete');
                writeToDisk(createOutputJsonForAllPages());
            }
        }, (err) => {
            console.log(err);
        });
    }
};

let cleanup = function (diffElement) {
    diffElement.diff = diffElement.diff.filter((element, index, array)=>{
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
    console.log('2. diff length: ' + diffElement.diff.length);
};

let createOutputJsonForAllPages = function () {
    let output = {
        date: Date.now(),
        original: config.beforeUrl,
        comparator: config.afterUrl,
        pages: config.pages
    };
    return JSON.stringify(output);
};

let writeToDisk = function (contents) {
    let outputPath = config.outputPath;

    fs.writeFile(outputPath, contents, function (err) {
        if (err)
            console.error(err);
        console.log('Written!');
    });
};

/* Application starts */
describe('CSS computed styles diff testing', function () {
    compareComputedStyles(this);
});