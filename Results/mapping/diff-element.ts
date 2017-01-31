class DiffElement implements DiffElement {
    constructor(
        public selector:string,
        public diff:deepDiff.IDiff
    ){

    }
}

interface DiffElementSource {
    selector: string;
    original: any;
    comparand: any;
    diff:deepDiff.IDiff;
}

export const diffElementMapper = {
    create: function (options: KnockoutMappingCreateOptions) {
        let diffElementData = <DiffElementSource>options.data;
        return new DiffElement(
            diffElementData.selector,
            diffElementData.diff
        );
    }
};