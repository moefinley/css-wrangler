define(["require", "exports"], function (require, exports) {
    "use strict";
    class DiffGenericDiff {
        constructor(deepDiffObj) {
            this.kinds = {
                N: 'New',
                D: 'Deleted',
                E: 'Edit',
                A: 'Change in array'
            };
            this.path = !!deepDiffObj.path ? deepDiffObj.path.join(', ') : "no path";
            this.lhs = !!deepDiffObj.lhs ? deepDiffObj.lhs.toString() : "---";
            this.rhs = !!deepDiffObj.rhs ? deepDiffObj.rhs.toString() : "---";
            this.kind = this.kinds[deepDiffObj.kind];
        }
    }
    exports.DiffGenericDiff = DiffGenericDiff;
});
//# sourceMappingURL=diff-generic-diff.js.map