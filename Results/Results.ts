import * as bsCollapsiblePanel from './components/bs-collapsible-panel';
import * as diffElement from './components/diff-element';
import * as diffElementDiff from './components/diff-element-diff';
import {diffElementMapper} from "./mapping/diff-element";
import * as fileOps from "./FileOperations";

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

const ViewModel = function (): void {
    var self = this;

    self.loadFile = ()=>{fileOps.loadFile('fileinput', (e)=>{
        let lines = e.target.result;
        let mappingOptions = {
            'elementsToTest': diffElementMapper
        };
        ko.mapping.fromJSON(lines, mappingOptions, self.data);
    })};
    self.data = {
        original: ko.observable<string|any>('loading...'),
        comparator: ko.observable<string|any>('loading...'),
        date: ko.observable<string>('loading...'),
        pages: ko.observableArray<IPage>([])
    };
    self.convertedDate = ko.pureComputed(function () {
        if (self.data.date() != 'loading...') {
            return new Date(self.data.date()).toString();
        } else {
            return self.data.date();
        }
    });

    return self;
};
ko.applyBindings(new ViewModel());