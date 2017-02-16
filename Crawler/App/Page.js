"use strict";
const DiffElement_1 = require("./DiffElement");
class Page {
    constructor(id, name, url, elementsToTest, elementsToIgnore) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.elementsToTest = [];
        this.elementsToIgnore = [];
        elementsToTest.forEach(e => this.elementsToTest.push(new DiffElement_1.DiffElement(e)));
        if (Array.isArray(elementsToIgnore) && elementsToIgnore.length > 0)
            this.elementsToIgnore = elementsToIgnore;
    }
}
exports.Page = Page;
//# sourceMappingURL=Page.js.map