import {logError} from "logging";
export class PropertyAndValueFilter {
    public isSelected = ko.observable<boolean>(false);
    private propertyNameRegExp:RegExp = null;
    private propertyValueRegExp:RegExp = null;
    constructor(
        public propertyName:string,
        public propertyNameIsRegExp:boolean,
        public propertyValue:string,
        public propertyValueIsRegExp:boolean,
        public valueType: valueType,
        public name:string = propertyName.toString()
    ){
        if(propertyNameIsRegExp) this.propertyNameRegExp = PropertyAndValueFilter.createNewRegExp(propertyName);
        if(propertyValueIsRegExp) this.propertyValueRegExp = PropertyAndValueFilter.createNewRegExp(propertyValue);
    }

    private static createNewRegExp(regExpString: string):RegExp {
        let regExp;
        try {
            regExp = new RegExp(regExpString)
        } catch (e){
            regExp = new RegExp("");
            logError("not a valid regular expression");
        }
        return regExp;
    }

    public isMatch(
        stylePropertyName:string,
        stylePropertyOriginalValue:string,
        stylePropertyComparandValue: string
    ){
        return this.doesPropertyNameMatch(stylePropertyName) ? this.doesPropertyValueMatch(stylePropertyOriginalValue, stylePropertyComparandValue) : false;
    }

    private doesPropertyNameMatch(stylePropertyName: string):boolean {
        return this.propertyNameIsRegExp ? this.propertyNameRegExp.test(stylePropertyName) : this.propertyName === stylePropertyName;
    }

    private doesPropertyValueMatch(stylePropertyOriginalValue: string, stylePropertyComparandValue: string) {
        let originalMatch = this.propertyValueIsRegExp ? this.propertyValueRegExp.test(stylePropertyOriginalValue) : this.propertyValue === stylePropertyOriginalValue;
        let comparandMatch = this.propertyValueIsRegExp ? this.propertyValueRegExp.test(stylePropertyComparandValue) : this.propertyValue === stylePropertyComparandValue;
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