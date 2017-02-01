define(["require", "exports"], function (require, exports) {
    "use strict";
    var DiffElementDiff = (function () {
        function DiffElementDiff(deepDiffObj) {
            this.deepDiffObj = deepDiffObj;
            this.path = !!deepDiffObj.path ? deepDiffObj.path.join(', ') : "no path";
            this.rhs = !!deepDiffObj.lhs ? deepDiffObj.lhs.toString() : "---";
            this.lhs = !!deepDiffObj.rhs ? deepDiffObj.rhs.toString() : "---";
            this.isElement = (!!deepDiffObj.lhs && !!deepDiffObj.lhs.styleProperties)
                || (!!deepDiffObj.rhs && !!deepDiffObj.rhs.styleProperties);
        }
        return DiffElementDiff;
    }());
    exports.DiffElementDiff = DiffElementDiff;
});
//# sourceMappingURL=diff-element-diff.js.map