import {valueType, PropertyAndValueFilter} from "./propertyAndValueFilter";
export class AddPropertyAndValueFilterViewModel{
    public propertyName = ko.observable<string>('');
    public isPropertyNameRegExp = ko.observable<string>();
    public value = ko.observable<string>('');
    public isValueRegExp = ko.observable<string>();
    public valueTypeString = ko.observable<string>('');
    public valueType: KnockoutComputed<valueType>;
    public propertyAndValueFilters = ko.observableArray<PropertyAndValueFilter>();
    public add = ()=>{
        this.propertyAndValueFilters.push(new PropertyAndValueFilter(
            this.propertyName(),
            this.isPropertyNameRegExp() == "true",
            this.value(),
            this.isValueRegExp() == "true",
            this.valueType(),
            `Filter where <mark>${this.propertyName()}</mark> of <mark>${this.valueTypeString()}</mark> is ${this.value()}`
        ));
    };
    public openDialog = ()=>{
        this.$addPropertyAndValueFilter.modal('show');
    };

    constructor(private $addPropertyAndValueFilter:JQuery){
        this.valueType = ko.computed<valueType>(()=>{
            switch (this.valueTypeString()) {
                case 'original':
                    return valueType.original;
                case 'comparand':
                    return valueType.comparand;
                case 'either':
                    return valueType.either;
                default:
                    return valueType.original;
            }
        })
    }
}
