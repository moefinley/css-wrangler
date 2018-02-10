import * as bsCollapsiblePanel from './components/collapsiblePanel/collapsiblePanel';
import * as diffElement from './components/diffElement/diffElement';
import * as row from './components/diffTable/row/row';
import * as diffTable from './components/diffTable/diffTable';
import {viewModel} from "./viewModel";

declare global {
    interface Window {
        FileReader: any;
    }
}

ko.components.register('bs-collapsible-panel', {
    viewModel: bsCollapsiblePanel.viewModel,
    template: bsCollapsiblePanel.template
});
ko.components.register('diff-table', {
    viewModel: diffTable.viewModel,
    template: diffTable.template
})
ko.components.register('diff-element', {
    viewModel: diffElement.viewModel,
    template: diffElement.template
});
ko.components.register('row', {
    viewModel: row.viewModel,
    template: row.template
});
ko.applyBindings(viewModel);