export class filter {
    constructor(
        public name:string,
        public property:string
    ){
    }
    public isSelected = ko.observable<boolean>(true);
}