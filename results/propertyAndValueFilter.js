define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PropertyAndValueFilter {
        constructor(propertyName, propertyValue, valueType, name = propertyName) {
            this.propertyName = propertyName;
            this.propertyValue = propertyValue;
            this.valueType = valueType;
            this.name = name;
            this.isSelected = ko.observable(false);
            this.propertyNameRegExp = new RegExp(propertyName);
            this.propertyValueRegExp = new RegExp(propertyValue);
        }
        isMatch(stylePropertyName, stylePropertyOriginalValue, stylePropertyComparandValue) {
            return this.propertyNameRegExp.test(stylePropertyName) ? this.doesPropertyMatch(stylePropertyOriginalValue, stylePropertyComparandValue) : false;
        }
        doesPropertyMatch(stylePropertyOriginalValue, stylePropertyComparandValue) {
            let originalMatch = this.propertyValueRegExp.test(stylePropertyOriginalValue);
            let comparandMatch = this.propertyValueRegExp.test(stylePropertyComparandValue);
            let eitherMatch = originalMatch || comparandMatch;
            switch (this.valueType) {
                case valueType.original:
                    return originalMatch;
                case valueType.comparand:
                    return comparandMatch;
                case valueType.either:
                    return eitherMatch;
            }
        }
    }
    exports.PropertyAndValueFilter = PropertyAndValueFilter;
    var valueType;
    (function (valueType) {
        valueType[valueType["original"] = 0] = "original";
        valueType[valueType["comparand"] = 1] = "comparand";
        valueType[valueType["either"] = 2] = "either";
    })(valueType = exports.valueType || (exports.valueType = {}));
});
//# sourceMappingURL=propertyAndValueFilter.js.map