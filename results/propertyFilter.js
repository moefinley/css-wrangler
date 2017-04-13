define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PropertyNameFilter {
        constructor(propertyName, name = propertyName) {
            this.propertyName = propertyName;
            this.name = name;
            this.isSelected = ko.observable(true);
        }
        isMatch(styleProperty) {
            return styleProperty === this.propertyName;
        }
    }
    exports.PropertyNameFilter = PropertyNameFilter;
});
//# sourceMappingURL=propertyFilter.js.map