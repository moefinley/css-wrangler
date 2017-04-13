define(["require", "exports", "logging"], function (require, exports, logging_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PropertyAndValueFilter {
        constructor(propertyName, propertyNameIsRegExp, propertyValue, propertyValueIsRegExp, valueType, name = propertyName.toString()) {
            this.propertyName = propertyName;
            this.propertyNameIsRegExp = propertyNameIsRegExp;
            this.propertyValue = propertyValue;
            this.propertyValueIsRegExp = propertyValueIsRegExp;
            this.valueType = valueType;
            this.name = name;
            this.isSelected = ko.observable(false);
            this.propertyNameRegExp = null;
            this.propertyValueRegExp = null;
            if (propertyNameIsRegExp)
                this.propertyNameRegExp = PropertyAndValueFilter.createNewRegExp(propertyName);
            if (propertyValueIsRegExp)
                this.propertyValueRegExp = PropertyAndValueFilter.createNewRegExp(propertyValue);
        }
        static createNewRegExp(regExpString) {
            let regExp;
            try {
                regExp = new RegExp(regExpString);
            }
            catch (e) {
                regExp = new RegExp("");
                logging_1.logError("not a valid regular expression");
            }
            return regExp;
        }
        isMatch(stylePropertyName, stylePropertyOriginalValue, stylePropertyComparandValue) {
            return this.doesPropertyNameMatch(stylePropertyName) ? this.doesPropertyValueMatch(stylePropertyOriginalValue, stylePropertyComparandValue) : false;
        }
        doesPropertyNameMatch(stylePropertyName) {
            return this.propertyNameIsRegExp ? this.propertyNameRegExp.test(stylePropertyName) : this.propertyName === stylePropertyName;
        }
        doesPropertyValueMatch(stylePropertyOriginalValue, stylePropertyComparandValue) {
            let originalMatch = this.propertyValueIsRegExp ? this.propertyValueRegExp.test(stylePropertyOriginalValue) : this.propertyValue === stylePropertyOriginalValue;
            let comparandMatch = this.propertyValueIsRegExp ? this.propertyValueRegExp.test(stylePropertyComparandValue) : this.propertyValue === stylePropertyComparandValue;
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