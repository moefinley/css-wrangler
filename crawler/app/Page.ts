import {DiffElement} from "./diffElement";
export class Page implements pageInterface{
    elementsToIgnore:string[] = [];
    isProcessed: boolean = false;
    constructor (
        public id:string,
        public name: string,
        public path:string,
        public elementsToTest:DiffElement[],
        elementsToIgnore?:string[]
    ){
        if(Array.isArray(elementsToIgnore) && elementsToIgnore.length > 0) this.elementsToIgnore = elementsToIgnore;
    }
}