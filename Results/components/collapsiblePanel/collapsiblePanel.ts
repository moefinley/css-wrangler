/// <amd-dependency path="text!./collapsiblePanel.html" name="collapsiblePanelTemplate"/>
declare let collapsiblePanelTemplate:string;

export let template = collapsiblePanelTemplate;
export let viewModel = {
    createViewModel: function (params, componentInfo) {
        let self:any = {};
        Object.keys(params).forEach(k => self[k] = params[k]);
        if(!self.hasOwnProperty('isExpanded')){
            self.isExpanded = false;
        }
        if(!self.hasOwnProperty('id')) {
            self.id = 'collapse' + Math.round(Math.random() * 10000);
        }

        componentInfo.templateNodes = componentInfo.templateNodes.filter(e => e.nodeType !== 3);
        self.panelHeadingNode = componentInfo.templateNodes.splice(componentInfo.templateNodes.findIndex(e => e.classList.contains('panel-heading')), 1);
        self.panelNodes = componentInfo.templateNodes;
        self.panelClass = 'panel-default';
        if(!!self.diffElement && typeof self.diffElement.error === 'string'){
            self.panelClass = 'panel-danger';
        }
        return self;
    }
};