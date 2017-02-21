define(["require", "exports", './components/bsCollapsiblePanel', './components/diffElement', './components/diffElementDiff', "./viewModel"], function (require, exports, bsCollapsiblePanel, diffElement, diffElementDiff, viewModel_1) {
    "use strict";
    ko.components.register('bs-collapsible-panel', {
        viewModel: bsCollapsiblePanel.viewModel,
        template: bsCollapsiblePanel.template
    });
    ko.components.register('diff-element', {
        viewModel: diffElement.viewModel,
        template: diffElement.template
    });
    ko.components.register('diff-element-diff', {
        viewModel: diffElementDiff.viewModel,
        template: diffElementDiff.template
    });
    ko.applyBindings(viewModel_1.viewModel);
});
//# sourceMappingURL=results.js.map