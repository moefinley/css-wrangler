"use strict";
const DiffElement_1 = require("./DiffElement");
class Page {
    constructor(id, name, url, elementsToTest) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.elementsToTest = [];
        elementsToTest.forEach(e => this.elementsToTest.push(new DiffElement_1.DiffElement(e)));
    }
}
exports.Page = Page;
//# sourceMappingURL=Page.js.map