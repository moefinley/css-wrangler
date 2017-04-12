export class PropertyNameFilter {
    public isSelected = ko.observable<boolean>(true);
    constructor(
        public property:string,
        public name:string = property
    ){
    }
    public isMatch(styleProperty:string){
        return styleProperty === this.property;
    }
}