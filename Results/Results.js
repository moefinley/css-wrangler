define(["require", "exports", './components/bs-collapsible-panel', './components/diff-element', './components/diff-element-diff', "./ViewModel"], function (require, exports, bsCollapsiblePanel, diffElement, diffElementDiff, ViewModel_1) {
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
    ko.applyBindings(ViewModel_1.viewModel);
});
//# sourceMappingURL=Results.js.map