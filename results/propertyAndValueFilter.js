define(["require", "exports"], function (require, exports) {
    "use strict";
    class PropertyAndValueFilter {
        constructor(property, value, valueType, name = property) {
            this.property = property;
            this.value = value;
            this.valueType = valueType;
            this.name = name;
            this.isSelected = ko.observable(true);
        }
    }
    exports.PropertyAndValueFilter = PropertyAndValueFilter;
    (function (valueType) {
        valueType[valueType["original"] = 0] = "original";
        valueType[valueType["comparand"] = 1] = "comparand";
        valueType[valueType["either"] = 2] = "either";
    })(exports.valueType || (exports.valueType = {}));
    var valueType = exports.valueType;
});
//# sourceMappingURL=propertyAndValueFilter.js.map