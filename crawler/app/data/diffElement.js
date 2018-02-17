"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DiffElement {
    constructor(selector) {
        this.selector = selector;
        this.original = {};
        this.comparand = {};
        this.diff = [];
        this.error = null;
    }
    ;
}
exports.DiffElement = DiffElement;
//# sourceMappingURL=diffElement.js.map