define(["require", "exports", "./diffGenericDiff", "../viewModel"], function (require, exports, diffGenericDiff_1, viewModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class DiffStyleDiff extends diffGenericDiff_1.DiffGenericDiff {
        constructor(deepDiffObj) {
            super(deepDiffObj);
            this.deepDiffObj = deepDiffObj;
            this.isVisible = ko.computed(() => {
                let isVisible = true;
                viewModel_1.viewModel.propertyNameFilters()
                    .filter(f => !f.isSelected())
                    .forEach(f => f.isMatch(this.styleProperty) ? isVisible = false : null);
                if (isVisible) {
                    viewModel_1.viewModel.addPropertyAndValueFilter.propertyAndValueFilters()
                        .filter(f => !f.isSelected())
                        .forEach(f => f.isMatch(this.styleProperty, this.lhs, this.rhs) ? isVisible = false : null);
                }
                return isVisible;
            });
            this.parseElementPath(deepDiffObj.path);
            if (this.xpath !== null) {
                this.friendlyPath = `${this.xpath}, ${this.styleProperty}`;
            }
            else {
                this.friendlyPath = this.styleProperty;
            }
            viewModel_1.viewModel.addFilter(this.styleProperty);
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
//# sourceMappingURL=diffStyleDiff.js.map