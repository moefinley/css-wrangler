export class PropertyAndValueFilter {
    public isSelected = ko.observable<boolean>(true);
    constructor(
        public propertyName:string,
        public propertyValue:string,
        public valueType: valueType,
        public name:string = propertyName
    ){

    }
    public isMatch(
        stylePropertyName:string,
        stylePropertyOriginalValue:string,
        stylePropertyComparandValue: string
    ){
        return stylePropertyName === this.propertyName ? this.doesPropertyMatch(stylePropertyOriginalValue, stylePropertyComparandValue) : false;
    }

    private doesPropertyMatch(stylePropertyOriginalValue: string, stylePropertyComparandValue: string) {
        let originalMatch = stylePropertyOriginalValue === this.propertyValue;
        let comparandMatch = stylePropertyComparandValue === this.propertyValue;
        let eitherMatch = stylePropertyOriginalValue === this.propertyValue || stylePropertyComparandValue === this.propertyValue;

        switch (this.valueType) {
            case valueType.original:
                return originalMatch;
            case valueType.comparand:
                return comparandMatch;
            case valueType.either:
                return eitherMatch;
        }
    }
}

export enum valueType {
    "original",
    "comparand",
    "either"
}