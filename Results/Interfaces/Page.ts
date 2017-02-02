interface IPage {
    id: string;
    name: string;
    url: string;
    elementsWithStyleChangesCount: number;
    elementsWithElementChangesCount: number;
    elementsToTest: IDiffElement[];
}