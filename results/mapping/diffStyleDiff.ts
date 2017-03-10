import {DiffGenericDiff} from "./diffGenericDiff";
import {viewModel} from "../viewModel";
import {valueType} from "../propertyAndValueFilter";
import {logVerboseInfo} from "../../crawler/app/logging/logging";
export class DiffStyleDiff extends DiffGenericDiff {
    public path: string;
    public friendlyPath: string;
    public lhs: string;
    public rhs: string;
    public kind: string;
    public xpath: string;
    public styleProperty: string;

    constructor(public deepDiffObj: deepDiff.IDiff){
        super(deepDiffObj);
        this.parseElementPath(deepDiffObj.path);
        if(this.xpath !== null){
            this.friendlyPath = `${this.xpath}, ${this.styleProperty}`;
        } else {
            this.friendlyPath = this.styleProperty;
        }
        viewModel.addFilter(this.styleProperty);
    }

    public isVisible = ko.computed<boolean>(():boolean=>{
        let index = viewModel.propertyNameFilters().findIndex(e => e.property == this.styleProperty);
        let isVisible = index > -1 ? viewModel.propertyNameFilters()[index].isSelected() : true;

        if(isVisible) {
            let pavFilterIndex = viewModel.addPropertyAndValueFilter.propertyAndValueFilters().findIndex((filter) => {
                let doesValueMatch: boolean = false;
                let doesPropertyMatch: boolean = false;
                if (filter.valueType !== valueType.either) {
                    let relevantValue = filter.valueType === valueType.original ? this.lhs : this.rhs;
                    if (relevantValue === filter.value) doesValueMatch = true;
                } else {
                    //TODO: Do something for either
                }

                if (filter.property === this.styleProperty) doesPropertyMatch = true;


                return doesValueMatch && doesPropertyMatch;
            });
            if(pavFilterIndex > -1) {
                logVerboseInfo('Found match to property and value filter');
                isVisible = false;
            }
        }
        return isVisible;
    });

    private parseElementPath(rawPath:string[]){
        let pathLength = rawPath.length;
        this.styleProperty = rawPath[pathLength - 2] === "styleProperties" ? rawPath[pathLength - 1] : null;
        let reversedPath = rawPath.reverse();
        this.xpath = reversedPath.find(e => e.substring(0, 6) === 'xpath-') || null;
        this.xpath = this.xpath != null ? this.xpath.substring(7, this.xpath.length) : null;
    }
}