export class PropertyNameFilter {
    public isSelected = ko.observable<boolean>(true);
    constructor(
        public propertyName:string,
        public name:string = propertyName
    ){
    }
    public isMatch(styleProperty:string){
        return styleProperty === this.propertyName;
    }
}