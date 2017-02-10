define(["require", "exports", "./diff-element-diff", "./diff-style-diff"], function (require, exports, diff_element_diff_1, diff_style_diff_1) {
    "use strict";
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
                isElement ? newDiffElement.elementDiffs.push(new diff_element_diff_1.DiffElementDiff(diff)) : newDiffElement.styleDiffs.push(new diff_style_diff_1.DiffStyleDiff(diff));
            }
            return newDiffElement;
        }
    };
});
//# sourceMappingURL=diff-element.js.map