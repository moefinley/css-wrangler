import {mappingOptions} from "./mapping";
import * as fileOps from "./fileOperations";
import {PropertyNameFilter} from "./propertyFilter";
import {PropertyAndValueFilter, valueType} from "./propertyAndValueFilter";
import {AddPropertyAndValueFilterViewModel} from "./addPropertyAndValueFilterViewModel";

let $fileInputModal = $('#fileInputModal');
let $addPropertyAndValueFilter = $('#addPropertyAndValueFilterDialog');
$(function(){
    $fileInputModal.modal();
});
class ViewModel {
    public loadFile = ()=>{
        fileOps.loadFile('fileinput', (e)=>{
        $fileInputModal.modal('hide');
        let lines = e.target.result;

        ko.mapping.fromJSON(lines, mappingOptions, this.data);

        /*
         * Knockout doesn't like updating arrays while mapping
         * So this...
         */
        this.propertyNameFilters(this.propertyNameFilters().concat(this.pendingFilters));
    })};
    public data = {
        configFile: ko.observable<string>('loading...'),
        original: ko.observable<string|any>('loading...'),
        comparator: ko.observable<string|any>('loading...'),
        date: ko.observable<string>('loading...'),
        pages: ko.observableArray<pageInterface>([])
    };
    public propertyNameFilters = ko.observableArray<PropertyNameFilter>();
    public addPropertyAndValueFilter = new AddPropertyAndValueFilterViewModel($addPropertyAndValueFilter);

    public pendingFilters = [];

    public addFilter(propertyName:string) {
        if(this.pendingFilters.findIndex(filter => filter.propertyName === propertyName) === -1){
            this.pendingFilters.push(new PropertyNameFilter(propertyName));
        }
    };
    private convertDate = ()=>{
        if (this.data.date() != 'loading...') {
            return new Date(this.data.date()).toString();
        } else {
            return this.data.date();
        }
    };
    public convertedDate = ko.pureComputed(this.convertDate);
}

export let viewModel = new ViewModel();