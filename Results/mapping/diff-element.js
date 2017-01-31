define(["require", "exports"], function (require, exports) {
    "use strict";
    var DiffElement = (function () {
        function DiffElement(selector, diff) {
            this.selector = selector;
            this.diff = diff;
        }
        return DiffElement;
    }());
    exports.diffElementMapper = {
        create: function (options) {
            var diffElementData = options.data;
            return new DiffElement(diffElementData.selector, diffElementData.diff);
        }
    };
});
//# sourceMappingURL=diff-element.js.map