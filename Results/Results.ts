import * as bsCollapsiblePanel from './components/bs-collapsible-panel';
import * as diffElement from './components/diff-element';
import * as diffElementDiff from './components/diff-element-diff';
import * as fileOps from "./FileOperations";
import {mappingOptions} from "./Mapping";

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
let $fileInputModal = $('#fileInputModal');

const ViewModel = function (): void {
    var self = this;

    self.loadFile = ()=>{fileOps.loadFile('fileinput', (e)=>{
        $fileInputModal.modal('hide');
        let lines = e.target.result;

        ko.mapping.fromJSON(lines, mappingOptions, self.data);
    })};
    self.data = {
        configFile: ko.observable<string>('loading...'),
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

$(function(){
    $fileInputModal.modal();
});
ko.applyBindings(new ViewModel());