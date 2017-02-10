define(["require", "exports", "./diff-generic-diff", "../ViewModel"], function (require, exports, diff_generic_diff_1, ViewModel_1) {
    "use strict";
    class DiffStyleDiff extends diff_generic_diff_1.DiffGenericDiff {
        constructor(deepDiffObj) {
            super(deepDiffObj);
            this.deepDiffObj = deepDiffObj;
            this.isVisible = ko.computed(() => {
                let index = ViewModel_1.viewModel.filters().findIndex(e => e.property == this.styleProperty);
                return index > -1 ? ViewModel_1.viewModel.filters()[index].isSelected() : true;
            });
            this.parseElementPath(deepDiffObj.path);
            if (this.xpath !== null) {
                this.friendlyPath = `${this.xpath}, ${this.styleProperty}`;
            }
            else {
                this.friendlyPath = this.styleProperty;
            }
            ViewModel_1.viewModel.addFilter(this.styleProperty);
        }
        parseElementPath(rawPath) {
            let pathLength = rawPath.length;
            this.styleProperty = rawPath[pathLength - 2] === "styleProperties" ? rawPath[pathLength - 1] : null;
            let reversedPath = rawPath.reverse();
            this.xpath = reversedPath.find(e => e.substring(0, 6) === 'xpath-') || null;
            this.xpath = this.xpath != null ? this.xpath.substring(7, this.xpath.length) : null;
        }
    }
    exports.DiffStyleDiff = DiffStyleDiff;
});
//# sourceMappingURL=diff-style-diff.js.map