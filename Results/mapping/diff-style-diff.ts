import {DiffGenericDiff} from "./diff-generic-diff";
import {viewModel} from "../ViewModel";
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
        let index = viewModel.filters().findIndex(e => e.property == this.styleProperty);
        return index > -1 ? viewModel.filters()[index].isSelected() : true;
    });

    private parseElementPath(rawPath:string[]){
        let pathLength = rawPath.length;
        this.styleProperty = rawPath[pathLength - 2] === "styleProperties" ? rawPath[pathLength - 1] : null;
        let reversedPath = rawPath.reverse();
        this.xpath = reversedPath.find(e => e.substring(0, 6) === 'xpath-') || null;
        this.xpath = this.xpath != null ? this.xpath.substring(7, this.xpath.length) : null;
    }
}