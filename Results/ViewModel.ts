import {mappingOptions} from "./Mapping";
import * as fileOps from "./FileOperations";
import {Filter} from "./Filter";

let $fileInputModal = $('#fileInputModal');
$(function(){
    $fileInputModal.modal();
});
class ViewModel {
    //let self = this;

    public loadFile = ()=>{fileOps.loadFile('fileinput', (e)=>{
        $fileInputModal.modal('hide');
        let lines = e.target.result;

        ko.mapping.fromJSON(lines, mappingOptions, this.data);

        /*
         * Knockout doesn't like updating arrays while mapping
         * So this...
         */
        this.filters(this.filters().concat(this.pendingFilters));
    })};
    public data = {
        configFile: ko.observable<string>('loading...'),
        original: ko.observable<string|any>('loading...'),
        comparator: ko.observable<string|any>('loading...'),
        date: ko.observable<string>('loading...'),
        pages: ko.observableArray<IPage>([])
    };
    public filters = ko.observableArray<Filter>([
        new Filter('background-image')]);

    public pendingFilters = [];

    public addFilter(propertyName:string) {
        if(this.filters().findIndex(filter => filter.property === propertyName) === -1){
            this.pendingFilters.push(new Filter(propertyName));
        }
    };
    public convertedDate = ko.pureComputed(() => {
        if (this.data.date() != 'loading...') {
            return new Date(this.data.date()).toString();
        } else {
            return this.data.date();
        }
    });
}

export let viewModel = new ViewModel();