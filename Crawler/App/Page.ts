import {DiffElement} from "./DiffElement";
export class Page implements IPage{
    public elementsToTest:DiffElement[] = [];
    constructor (
        public id:string,
        public name: string,
        public url:string,
        elementsToTest:string[]
    ){
        elementsToTest.forEach(e => this.elementsToTest.push(new DiffElement(e)));
    }
}