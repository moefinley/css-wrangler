define(["require", "exports", "./components/collapsiblePanel/collapsiblePanel", "./components/diffElement/diffElement", "./components/diffTable/row/row", "./components/diffTable/diffTable", "./viewModel"], function (require, exports, bsCollapsiblePanel, diffElement, row, diffTable, viewModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ko.components.register('bs-collapsible-panel', {
        viewModel: bsCollapsiblePanel.viewModel,
        template: bsCollapsiblePanel.template
    });
    ko.components.register('diff-table', {
        viewModel: diffTable.viewModel,
        template: diffTable.template
    });
    ko.components.register('diff-element', {
        viewModel: diffElement.viewModel,
        template: diffElement.template
    });
    ko.components.register('row', {
        viewModel: row.viewModel,
        template: row.template
    });
    ko.applyBindings(viewModel_1.viewModel);
});
//# sourceMappingURL=results.js.map