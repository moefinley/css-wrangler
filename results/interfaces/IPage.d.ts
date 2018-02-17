interface IState {
    id: string;
    elementsToTest: KnockoutObservableArray<diffElementInterface>;
}

interface IPage {
    id: string;
    name: string;
    url: string;
    elementsWithStyleChangesCount: KnockoutComputed<number>;
    elementsWithElementChangesCount: KnockoutComputed<number>;
    states: KnockoutObservableArray<IState>;
}