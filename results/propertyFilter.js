define(["require", "exports"], function (require, exports) {
    "use strict";
    class PropertyNameFilter {
        constructor(property, name = property) {
            this.property = property;
            this.name = name;
            this.isSelected = ko.observable(true);
        }
    }
    exports.PropertyNameFilter = PropertyNameFilter;
});
//# sourceMappingURL=propertyFilter.js.map