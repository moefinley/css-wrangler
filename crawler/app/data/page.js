"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class State {
    constructor(id, action, elementsToTest) {
        this.id = id;
        this.action = action;
        this.elementsToTest = elementsToTest;
    }
}
exports.State = State;
class Page {
    constructor(id, name, path, states, elementsToIgnore) {
        this.id = id;
        this.name = name;
        this.path = path;
        this.states = states;
        this.elementsToIgnore = [];
        this.isProcessed = false;
        if (Array.isArray(elementsToIgnore) && elementsToIgnore.length > 0)
            this.elementsToIgnore = elementsToIgnore;
    }
}
exports.Page = Page;
//# sourceMappingURL=page.js.map