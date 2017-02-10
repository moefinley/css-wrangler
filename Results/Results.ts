import * as bsCollapsiblePanel from './components/bs-collapsible-panel';
import * as diffElement from './components/diff-element';
import * as diffElementDiff from './components/diff-element-diff';
import {viewModel} from "./ViewModel";

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