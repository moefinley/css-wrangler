define(["require", "exports", "./diffGenericDiff"], function (require, exports, diffGenericDiff_1) {
    "use strict";
    class DiffElementDiff extends diffGenericDiff_1.DiffGenericDiff {
        constructor(deepDiffObj) {
            super(deepDiffObj);
            this.deepDiffObj = deepDiffObj;
            this.parseElementPath(deepDiffObj.path);
            if (this.xpath !== null) {
                this.friendlyPath = `${this.xpath}, ${this.styleProperty}`;
            }
            else {
                this.friendlyPath = this.styleProperty;
            }
        }
        parseElementPath(rawPath) {
            let pathLength = rawPath.length;
            this.styleProperty = rawPath[pathLength - 2] === "styleProperties" ? rawPath[pathLength - 1] : null;
            let reversedPath = rawPath.reverse();
            this.xpath = reversedPath.find(e => e.substring(0, 6) === 'xpath-') || null;
            this.xpath = this.xpath != null ? this.xpath.substring(7, this.xpath.length) : null;
        }
    }
    exports.DiffElementDiff = DiffElementDiff;
});
//# sourceMappingURL=diffElementDiff.js.map