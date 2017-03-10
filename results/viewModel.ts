import {mappingOptions} from "./mapping";
import * as fileOps from "./fileOperations";
import {PropertyNameFilter} from "./propertyFilter";
import {PropertyAndValueFilter, valueType} from "./propertyAndValueFilter";

let $fileInputModal = $('#fileInputModal');
let $addPropertyAndValueFilter = $('#addPropertyAndValueFilterDialog');
$(function(){
    $fileInputModal.modal();
});
class ViewModel {
    //let self = this;

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
    public propertyAndValueFilters = ko.observableArray<PropertyAndValueFilter>();
    public addPropertyAndValueFilter = {
        propertyName: ko.observable<string>(''),
        valueName: ko.observable<string>(''),
        valueType: ko.observable<valueType>(valueType.original),

        add: ()=>{
            this.propertyAndValueFilters.push(new PropertyAndValueFilter(
                this.addPropertyAndValueFilter.propertyName(),
                this.addPropertyAndValueFilter.valueName(),
                this.addPropertyAndValueFilter.valueType(),
                `Filter where ${this.addPropertyAndValueFilter.propertyName()} of ${this.addPropertyAndValueFilter.valueType()} is ${this.addPropertyAndValueFilter.valueName()}`
            ))
        },
        openDialog: ()=>{
            $addPropertyAndValueFilter.modal('show');
        }
    };

    public pendingFilters = [];

    public addFilter(propertyName:string) {
        if(this.pendingFilters.findIndex(filter => filter.property === propertyName) === -1){
            this.pendingFilters.push(new PropertyNameFilter(propertyName));
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