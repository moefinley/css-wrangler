import {DiffElement} from "./DiffElement";
export class Page implements IPage{
    public elementsToTest:DiffElement[] = [];
    public elementsToIgnore:string[] = [];
    constructor (
        public id:string,
        public name: string,
        public url:string,
        elementsToTest:string[],
        elementsToIgnore:string[]
    ){
        elementsToTest.forEach(e => this.elementsToTest.push(new DiffElement(e)));
        if(Array.isArray(elementsToIgnore) && elementsToIgnore.length > 0) this.elementsToIgnore = elementsToIgnore;
    }
}