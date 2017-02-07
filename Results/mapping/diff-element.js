define(["require", "exports", "./diff-element-diff"], function (require, exports, diff_element_diff_1) {
    "use strict";
    class DiffElement {
        constructor(selector, elementDiffs = [], styleDiffs = []) {
            this.selector = selector;
            this.elementDiffs = elementDiffs;
            this.styleDiffs = styleDiffs;
        }
    }
    exports.diffElementMapper = {
        create: function (options) {
            let diffElementData = options.data;
            let newDiffElement = new DiffElement(diffElementData.selector);
            for (let diff of diffElementData.diff) {
                let newDiffElementDiff = new diff_element_diff_1.DiffElementDiff(diff);
                if (newDiffElementDiff.isElement) {
                    newDiffElement.elementDiffs.push(newDiffElementDiff);
                }
                else {
                    newDiffElement.styleDiffs.push(newDiffElementDiff);
                }
            }
            return newDiffElement;
        }
    };
});
//# sourceMappingURL=diff-element.js.map