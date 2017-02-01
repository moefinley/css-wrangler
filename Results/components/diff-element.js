define(["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Created by neilt on 23/01/2017.
     */
    function viewModel(diffElement) {
        var self = this;
        self.selector = diffElement.selector;
        self.elementDiffs = diffElement.elementDiffs;
        self.styleDiffs = diffElement.styleDiffs;
    }
    exports.viewModel = viewModel;
    exports.template = "\n<h3 data-bind=\"text: selector\"></h3>\n<bs-collapsible-panel params=\"elementDiffs: elementDiffs, isExpanded: false\">\n    <span class=\"panel-heading\">Element changes</span>\n    <table class=\"table table-striped\">\n            <thead>\n            <tr>\n                <th>Kind</th>\n                <th>Property</th>\n                <th>Original</th>\n                <th>Comparand</th>\n            </tr>\n            </thead>\n            <tbody>\n            <!-- ko foreach: $parent.params.elementDiffs -->\n            <tr class=\"results-row\" data-bind=\"component: {name: 'diff-element-diff', params: $data}\"></tr>\n            <!-- /ko -->\n            </tbody>\n    </table>\n</bs-collapsible-panel>\n<bs-collapsible-panel params=\"styleDiffs: styleDiffs, isExpanded: true\">\n    <span class=\"panel-heading\">Style changes</span>\n    <table class=\"table table-striped\">\n            <thead>\n            <tr>\n                <th>Kind</th>\n                <th>Property</th>\n                <th>Original</th>\n                <th>Comparand</th>\n            </tr>\n            </thead>\n            <tbody>\n            <!-- ko foreach: $parent.params.styleDiffs -->\n            <tr class=\"results-row\" data-bind=\"component: {name: 'diff-element-diff', params: $data}\"></tr>\n            <!-- /ko -->\n            </tbody>\n    </table>\n</bs-collapsible-panel>\n".toString();
});
//# sourceMappingURL=diff-element.js.map