import {DiffElementDiff} from "./diffElementDiff";
import {DiffStyleDiff} from "./diffStyleDiff";

class DiffElement implements diffElementInterface {
    constructor(
        public selector:string,
        public error?:string,
        public elementDiffs:diffElementDiffInterface[] = [],
        public styleDiffs:diffElementDiffInterface[] = []
    ){

    }
    public styleDiffsCount = ko.computed<number>(()=>{
        return this.styleDiffs.filter((e:DiffStyleDiff)=>{
            return e.isVisible();
        }).length;
    });
}

interface DiffElementSource {
    selector: string;
    error?: string;
    original: any;
    comparand: any;
    diff:deepDiff.IDiff[];
}

export const diffElementMapper = {
    create: function (options: KnockoutMappingCreateOptions) {
        let diffElementData = <DiffElementSource>options.data;

        let newDiffElement = new DiffElement(
            diffElementData.selector,
            diffElementData.error
        );
        if(typeof diffElementData.error === 'undefined'){
            for(let diff of diffElementData.diff){
                let isElement = (!!diff.lhs && !!diff.lhs.styleProperties)
                    || (!!diff.rhs && !!diff.rhs.styleProperties);
                isElement ? newDiffElement.elementDiffs.push(new DiffElementDiff(diff)) : newDiffElement.styleDiffs.push(new DiffStyleDiff(diff));
            }
        }

        return newDiffElement;
    }
};