export class Filter {
    constructor(
        public property:string,
        public name:string = property
    ){
    }
    public isSelected = ko.observable<boolean>(true);
}