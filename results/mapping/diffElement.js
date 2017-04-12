define(["require", "exports", "./diffElementDiff", "./diffStyleDiff"], function (require, exports, diffElementDiff_1, diffStyleDiff_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DiffElement {
        constructor(selector, elementDiffs = [], styleDiffs = []) {
            this.selector = selector;
            this.elementDiffs = elementDiffs;
            this.styleDiffs = styleDiffs;
            this.styleDiffsCount = ko.computed(() => {
                return this.styleDiffs.filter((e) => {
                    return e.isVisible();
                }).length;
            });
        }
    }
    exports.diffElementMapper = {
        create: function (options) {
            let diffElementData = options.data;
            let newDiffElement = new DiffElement(diffElementData.selector);
            for (let diff of diffElementData.diff) {
                let isElement = (!!diff.lhs && !!diff.lhs.styleProperties)
                    || (!!diff.rhs && !!diff.rhs.styleProperties);
                isElement ? newDiffElement.elementDiffs.push(new diffElementDiff_1.DiffElementDiff(diff)) : newDiffElement.styleDiffs.push(new diffStyleDiff_1.DiffStyleDiff(diff));
            }
            return newDiffElement;
        }
    };
});
//# sourceMappingURL=diffElement.js.map