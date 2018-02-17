import {mappingOptions} from "../mapping";

export class Page implements IPage {
    states: KnockoutObservableArray<IState> = ko.observableArray([]);
    public id: string;
    public name: string;
    public url: string;
    public elementsWithStyleChangesCount: KnockoutComputed<number>;
    public elementsWithElementChangesCount: KnockoutComputed<number>;

    constructor(
        data:IPageSource
    ){
        ko.mapping.fromJS(data, mappingOptions, this);
        this.elementsWithStyleChangesCount = ko.computed(()=>{
            let count = 0;
            this.states().forEach((state)=>{
                for(let diffElement of state.elementsToTest()){
                    if(!!diffElement.styleDiffs) {
                        count += diffElement.styleDiffsCount();
                    }
                }
            });
            return count;
        });
        this.elementsWithElementChangesCount = ko.computed(()=>{
            let count = 0;
            this.states().forEach((state)=>{
                for (let diffElement of state.elementsToTest()) {
                    if (!!diffElement.elementDiffs) {
                        count += diffElement.elementDiffs.length;
                    }
                }
            });
            return count;
        });
    }
}


interface IPageSource {
    id: string;
    name: string;
    url: string;
    states:IState;
}

export const pageMapper = {
    create: function (options: KnockoutMappingCreateOptions) {
        return new Page(options.data)
    }
};