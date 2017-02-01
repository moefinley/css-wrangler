define(["require", "exports", "./diff-element-diff"], function (require, exports, diff_element_diff_1) {
    "use strict";
    var DiffElement = (function () {
        function DiffElement(selector, elementDiffs, styleDiffs) {
            if (elementDiffs === void 0) { elementDiffs = []; }
            if (styleDiffs === void 0) { styleDiffs = []; }
            this.selector = selector;
            this.elementDiffs = elementDiffs;
            this.styleDiffs = styleDiffs;
        }
        return DiffElement;
    }());
    exports.diffElementMapper = {
        create: function (options) {
            var diffElementData = options.data;
            var newDiffElement = new DiffElement(diffElementData.selector);
            for (var _i = 0, _a = diffElementData.diff; _i < _a.length; _i++) {
                var diff = _a[_i];
                var newDiffElementDiff = new diff_element_diff_1.DiffElementDiff(diff);
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