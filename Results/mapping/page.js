define(["require", "exports", "../Mapping"], function (require, exports, Mapping_1) {
    "use strict";
    class Page {
        constructor(data) {
            this.elementsToTest = [];
            ko.mapping.fromJS(data, Mapping_1.mappingOptions, this);
            this.elementsWithStyleChangesCount = ko.computed(() => {
                let count = 0;
                for (let diffElement of this.elementsToTest) {
                    if (!!diffElement.styleDiffs) {
                        count += diffElement.styleDiffs.length;
                    }
                }
                return count;
            });
            this.elementsWithElementChangesCount = ko.computed(() => {
                let count = 0;
                for (let diffElement of this.elementsToTest) {
                    if (!!diffElement.elementDiffs) {
                        count += diffElement.elementDiffs.length;
                    }
                }
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