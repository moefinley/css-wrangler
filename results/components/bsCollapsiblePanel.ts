export let template = `
    <div class="panel" data-bind="css: panelClass">
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