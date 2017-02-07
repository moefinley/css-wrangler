"use strict";
/*
 * This JavaScript get executed in the browser under test and not Node
 * Therefore it should remain as cross compatible as possible
 */
exports.scrapeComputedStyles = function (parentElementQuerySelector) {
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
            var xpathOfChild = 'xpath-' + Xpath.getElementXPath(childElement);
            thisObject.children[xpathOfChild] = {};
            iterateThroughChildren(childElement, thisObject.children[xpathOfChild]);
        }
    }
    iterateThroughChildren(parentElement, returnObj);
    return returnObj;
};
//# sourceMappingURL=ScrapeComputedStyles.js.map