define(["require", "exports", "../mapping"], function (require, exports, mapping_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Page {
        constructor(data) {
            this.states = ko.observableArray([]);
            ko.mapping.fromJS(data, mapping_1.mappingOptions, this);
            this.elementsWithStyleChangesCount = ko.computed(() => {
                let count = 0;
                this.states().forEach((state) => {
                    for (let diffElement of state.elementsToTest()) {
                        if (!!diffElement.styleDiffs) {
                            count += diffElement.styleDiffsCount();
                        }
                    }
                });
                return count;
            });
            this.elementsWithElementChangesCount = ko.computed(() => {
                let count = 0;
                this.states().forEach((state) => {
                    for (let diffElement of state.elementsToTest()) {
                        if (!!diffElement.elementDiffs) {
                            count += diffElement.elementDiffs.length;
                        }
                    }
                });
                return count;
            });
        }
    }
    exports.Page = Page;
    exports.pageMapper = {
        create: function (options) {
            return new Page(options.data);
        }
    };
});
//# sourceMappingURL=page.js.map