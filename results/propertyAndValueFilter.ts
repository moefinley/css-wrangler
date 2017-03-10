export class PropertyAndValueFilter {
    public isSelected = ko.observable<boolean>(true);
    constructor(
        public property:string,
        public value:string,
        public valueType: valueType,
        public name:string = property
    ){

    }
}

export enum valueType {
    "original",
    "comparand",
    "either"
}