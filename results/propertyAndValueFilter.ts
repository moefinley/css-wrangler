export class PropertyAndValueFilter {
    public isSelected = ko.observable<boolean>(true);
    private propertyNameRegExp:RegExp;
    private propertyValueRegExp:RegExp;
    constructor(
        public propertyName:string,
        public propertyValue:string,
        public valueType: valueType,
        public name:string = propertyName
    ){
        this.propertyNameRegExp = new RegExp(propertyName);
        this.propertyValueRegExp = new RegExp(propertyValue);
    }
    public isMatch(
        stylePropertyName:string,
        stylePropertyOriginalValue:string,
        stylePropertyComparandValue: string
    ){
        return this.propertyNameRegExp.test(stylePropertyName) ? this.doesPropertyMatch(stylePropertyOriginalValue, stylePropertyComparandValue) : false;
    }

    private doesPropertyMatch(stylePropertyOriginalValue: string, stylePropertyComparandValue: string) {
        let originalMatch = this.propertyValueRegExp.test(stylePropertyOriginalValue);
        let comparandMatch = this.propertyValueRegExp.test(stylePropertyComparandValue);
        let eitherMatch = originalMatch || comparandMatch;

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