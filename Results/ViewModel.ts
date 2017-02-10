import {mappingOptions} from "./Mapping";
import * as fileOps from "./FileOperations";
import {filter} from "./Filter";

let $fileInputModal = $('#fileInputModal');
$(function(){
    $fileInputModal.modal();
});
function ViewModel() {
    let self = this;

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
        pages: ko.observableArray<IPage>([]),
        filters: ko.observableArray([
            new filter('Background Image', 'background-image')
        ])
    };
    self.convertedDate = ko.pureComputed(function () {
        if (self.data.date() != 'loading...') {
            return new Date(self.data.date()).toString();
        } else {
            return self.data.date();
        }
    });
}

export let viewModel = new ViewModel();