define(["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Created by neilt on 23/01/2017.
     */
    function viewModel(diffElement) {
        var self = this;
        self.selector = diffElement.selector;
        self.diff = diffElement.diff;
    }
    exports.viewModel = viewModel;
    exports.template = "\n<h3 data-bind=\"text: selector\"></h3>\n<table class=\"table table-striped\">\n        <thead>\n        <tr>\n            <th>Kind</th>\n            <th>Property</th>\n            <th>Original</th>\n            <th>Comparand</th>\n        </tr>\n        </thead>\n        <tbody>\n        <!-- ko foreach: diff -->\n        <tr class=\"results-row\" data-bind=\"component: {name: 'diff-element-diff', params: $data}\"></tr>\n        <!-- /ko -->\n        </tbody>\n</table>\n".toString();
});
//# sourceMappingURL=diff-element.js.map