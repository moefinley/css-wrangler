import * as bsCollapsiblePanel from './components/bsCollapsiblePanel';
import * as diffElement from './components/diffElement';
import * as diffElementDiff from './components/diffElementDiff';
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
ko.components.register('diff-element', {
    viewModel: diffElement.viewModel,
    template: diffElement.template
});
ko.components.register('diff-element-diff', {
    viewModel: diffElementDiff.viewModel,
    template: diffElementDiff.template
});
ko.applyBindings(viewModel);