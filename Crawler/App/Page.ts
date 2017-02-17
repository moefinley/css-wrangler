import {DiffElement} from "./DiffElement";
export class Page implements IPage{
    elementsToIgnore:string[] = [];
    isProcessed: boolean = false;
    constructor (
        public id:string,
        public name: string,
        public url:string,
        public elementsToTest:DiffElement[],
        elementsToIgnore:string[]
    ){
        if(Array.isArray(elementsToIgnore) && elementsToIgnore.length > 0) this.elementsToIgnore = elementsToIgnore;
    }
}