define(["require", "exports", "text!./collapsiblePanel.html"], function (require, exports, collapsiblePanelTemplate) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /// <amd-dependency path="text!./collapsiblePanel.html" name="collapsiblePanelTemplate"/>
    exports.template = collapsiblePanelTemplate;
    exports.viewModel = {
        createViewModel: function (params, componentInfo) {
            let self = {};
            Object.keys(params).forEach(k => self[k] = params[k]);
            if (!self.hasOwnProperty('isExpanded')) {
                self.isExpanded = false;
            }
            if (!self.hasOwnProperty('id')) {
                self.id = 'collapse' + Math.round(Math.random() * 10000);
            }
            componentInfo.templateNodes = componentInfo.templateNodes.filter(e => e.nodeType !== 3);
            self.panelHeadingNode = componentInfo.templateNodes.splice(componentInfo.templateNodes.findIndex(e => e.classList.contains('panel-heading')), 1);
            self.panelNodes = componentInfo.templateNodes;
            self.panelClass = 'panel-default';
            if (!!self.diffElement && typeof self.diffElement.error === 'string') {
                self.panelClass = 'panel-danger';
            }
            return self;
        }
    };
});
//# sourceMappingURL=collapsiblePanel.js.map