/* External config file interfaces */
import {WebDriver} from "selenium-webdriver";

export interface IPageExtState {
    id:string;
    action:(driver:WebDriver)=>void
}

export interface IPageExtConfig {
    id: string;
    name: string;
    path: string;
    elementsToTest: string[];
    elementsToIgnore?: string[];
    states?:IPageExtState[]
}