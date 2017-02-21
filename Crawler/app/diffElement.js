"use strict";
var DiffElement = (function () {
    function DiffElement(selector) {
        this.selector = selector;
        this.original = {};
        this.comparand = {};
        this.diff = [];
    }
    ;
    return DiffElement;
}());
exports.DiffElement = DiffElement;
