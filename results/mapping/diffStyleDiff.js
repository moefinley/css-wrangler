define(["require", "exports", "./diffGenericDiff", "../viewModel", "../propertyAndValueFilter", "../../crawler/app/logging/logging"], function (require, exports, diffGenericDiff_1, viewModel_1, propertyAndValueFilter_1, logging_1) {
    "use strict";
    class DiffStyleDiff extends diffGenericDiff_1.DiffGenericDiff {
        constructor(deepDiffObj) {
            super(deepDiffObj);
            this.deepDiffObj = deepDiffObj;
            this.isVisible = ko.computed(() => {
                let index = viewModel_1.viewModel.propertyNameFilters().findIndex(e => e.property == this.styleProperty);
                let isVisible = index > -1 ? viewModel_1.viewModel.propertyNameFilters()[index].isSelected() : true;
                if (isVisible) {
                    let pavFilterIndex = viewModel_1.viewModel.addPropertyAndValueFilter.propertyAndValueFilters().findIndex((filter) => {
                        let doesValueMatch = false;
                        let doesPropertyMatch = false;
                        if (filter.valueType !== propertyAndValueFilter_1.valueType.either) {
                            let relevantValue = filter.valueType === propertyAndValueFilter_1.valueType.original ? this.lhs : this.rhs;
                            if (relevantValue === filter.value)
                                doesValueMatch = true;
                        }
                        else {
                        }
                        if (filter.property === this.styleProperty)
                            doesPropertyMatch = true;
                        return doesValueMatch && doesPropertyMatch;
                    });
                    if (pavFilterIndex > -1) {
                        logging_1.logVerboseInfo('Found match to property and value filter');
                        isVisible = false;
                    }
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