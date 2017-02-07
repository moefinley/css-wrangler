define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.template = `
    <div class="panel panel-default">
        <div class="panel-heading" role="tab" data-bind="attr: {href: 'heading' + id}">
            <h4 class="panel-title">
                <a role="button" data-toggle="collapse" aria-expanded="true" aria-controls="collapseOne" data-bind="attr: {href: '#' + id}, template: {nodes: panelHeadingNode}">
                  
                </a>
            </h4>
        </div>
        <div class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne" data-bind="attr: {id: id, 'aria-labelledby': 'heading' + id}, css: {'in': isExpanded}, foreach: panelNodes">
            <div class="panel-body" data-bind="template: { nodes: [$data], data: $parent }">
            
            </div>
        </div>
    </div>
`;
    exports.viewModel = {
        createViewModel: function (params, componentInfo) {
            let self = {};
            Object.keys(params).forEach(k => self[k] = params[k]);
            if (!self.hasOwnProperty('isExpanded')) {
                self.isExpanded = false;
            }
            if (!self.hasOwnProperty('id')) {
                self.id = 'collapse' + Math.round(Math.random() * 100);
            }
            componentInfo.templateNodes = componentInfo.templateNodes.filter(e => e.nodeType !== 3);
            self.panelHeadingNode = componentInfo.templateNodes.splice(componentInfo.templateNodes.findIndex(e => e.classList.contains('panel-heading')), 1);
            self.panelNodes = componentInfo.templateNodes;
            return self;
        }
    };
});
//# sourceMappingURL=bs-collapsible-panel.js.map