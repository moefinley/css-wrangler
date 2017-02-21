"use strict";
var Page = (function () {
    function Page(id, name, url, elementsToTest, elementsToIgnore) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.elementsToTest = elementsToTest;
        this.elementsToIgnore = [];
        this.isProcessed = false;
        if (Array.isArray(elementsToIgnore) && elementsToIgnore.length > 0)
            this.elementsToIgnore = elementsToIgnore;
    }
    return Page;
}());
exports.Page = Page;
