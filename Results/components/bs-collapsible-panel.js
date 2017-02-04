define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.template = "\n    <div class=\"panel panel-default\">\n        <div class=\"panel-heading\" role=\"tab\" data-bind=\"attr: {href: 'heading' + id}\">\n            <h4 class=\"panel-title\">\n                <a role=\"button\" data-toggle=\"collapse\" aria-expanded=\"true\" aria-controls=\"collapseOne\" data-bind=\"attr: {href: '#' + id}, template: {nodes: panelHeadingNode}\">\n                  \n                </a>\n            </h4>\n        </div>\n        <div class=\"panel-collapse collapse\" role=\"tabpanel\" aria-labelledby=\"headingOne\" data-bind=\"attr: {id: id, 'aria-labelledby': 'heading' + id}, css: {'in': isExpanded}, foreach: panelNodes\">\n            <div class=\"panel-body\" data-bind=\"template: { nodes: [$data], data: $parent }\">\n            \n            </div>\n        </div>\n    </div>\n";
    exports.viewModel = {
        createViewModel: function (params, componentInfo) {
            var self = this;
            Object.keys(params).forEach(function (k) { return self[k] = params[k]; });
            if (!self.hasOwnProperty('isExpanded')) {
                self.isExpanded = false;
            }
            if (!self.hasOwnProperty('id')) {
                self.id = 'collapse' + Math.round(Math.random() * 100);
            }
            componentInfo.templateNodes = componentInfo.templateNodes.filter(function (e) { return e.nodeType !== 3; });
            self.panelHeadingNode = componentInfo.templateNodes.splice(componentInfo.templateNodes.findIndex(function (e) { return e.classList.contains('panel-heading'); }), 1);
            self.panelNodes = componentInfo.templateNodes;
            return self;
        }
    };
});
//# sourceMappingURL=bs-collapsible-panel.js.map