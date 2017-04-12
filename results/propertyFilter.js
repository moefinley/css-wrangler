define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PropertyNameFilter {
        constructor(property, name = property) {
            this.property = property;
            this.name = name;
            this.isSelected = ko.observable(true);
        }
        isMatch(styleProperty) {
            return styleProperty === this.property;
        }
    }
    exports.PropertyNameFilter = PropertyNameFilter;
});
//# sourceMappingURL=propertyFilter.js.map