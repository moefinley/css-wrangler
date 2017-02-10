define(["require", "exports"], function (require, exports) {
    "use strict";
    class Filter {
        constructor(property, name = property) {
            this.property = property;
            this.name = name;
            this.isSelected = ko.observable(true);
        }
    }
    exports.Filter = Filter;
});
//# sourceMappingURL=Filter.js.map