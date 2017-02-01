import {DiffElementDiff} from "./diff-element-diff";
class DiffElement implements IDiffElement {
    constructor(
        public selector:string,
        public elementDiffs:IDiffElementDiff[] = [],
        public styleDiffs:IDiffElementDiff[] = []
    ){

    }
}

interface DiffElementSource {
    selector: string;
    original: any;
    comparand: any;
    diff:deepDiff.IDiff[];
}

export const diffElementMapper = {
    create: function (options: KnockoutMappingCreateOptions) {
        let diffElementData = <DiffElementSource>options.data;
        let newDiffElement = new DiffElement(
            diffElementData.selector
        );
        for(let diff of diffElementData.diff){
            let newDiffElementDiff = new DiffElementDiff(diff);

            if(newDiffElementDiff.isElement){
                newDiffElement.elementDiffs.push(newDiffElementDiff);
            } else {
                newDiffElement.styleDiffs.push(newDiffElementDiff);
            }
        }
        return newDiffElement;
    }
};