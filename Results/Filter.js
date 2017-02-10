define(["require", "exports"], function (require, exports) {
    "use strict";
    class filter {
        constructor(name, property) {
            this.name = name;
            this.property = property;
            this.isSelected = ko.observable(true);
        }
    }
    exports.filter = filter;
});
//# sourceMappingURL=Filter.js.map