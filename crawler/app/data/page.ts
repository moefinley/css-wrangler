import {DiffElement} from "./diffElement";
import {WebDriver} from "selenium-webdriver";

export class State {
    constructor(
        public id:string,
        public action:(webdriver:WebDriver)=>void,
        public elementsToTest:DiffElement[]
    ) {

    }
}

export class Page {
    elementsToIgnore:string[] = [];
    isProcessed: boolean = false;
    constructor (
        public id:string,
        public name: string,
        public path:string,
        public states:State[],
        elementsToIgnore?:string[]
    ){
        if(Array.isArray(elementsToIgnore) && elementsToIgnore.length > 0) this.elementsToIgnore = elementsToIgnore;
    }
}