define(["require", "exports", "../Mapping"], function (require, exports, Mapping_1) {
    "use strict";
    var Page = (function () {
        function Page(data) {
            var _this = this;
            this.elementsToTest = [];
            ko.mapping.fromJS(data, Mapping_1.mappingOptions, this);
            this.elementsWithStyleChangesCount = ko.computed(function () {
                var count = 0;
                for (var _i = 0, _a = _this.elementsToTest; _i < _a.length; _i++) {
                    var diffElement = _a[_i];
                    if (!!diffElement.styleDiffs) {
                        count += diffElement.styleDiffs.length;
                    }
                }
                return count;
            });
            this.elementsWithElementChangesCount = ko.computed(function () {
                var count = 0;
                for (var _i = 0, _a = _this.elementsToTest; _i < _a.length; _i++) {
                    var diffElement = _a[_i];
                    if (!!diffElement.elementDiffs) {
                        count += diffElement.elementDiffs.length;
                    }
                }
                return count;
            });
        }
        return Page;
    }());
    exports.Page = Page;
    exports.pageMapper = {
        create: function (options) {
            return new Page(options.data);
        }
    };
});
//# sourceMappingURL=page.js.map