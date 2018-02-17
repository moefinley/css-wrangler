class IOriginalDataDiffElement {
    selector: string;
    original: {
        children: IOriginalDataDiffElement;
        styleProperties: any;
    }
}

interface IOriginalDataPage {
    id: string;
    name: string;
    path: string;
    states: {
        id: string;
        elementsToTest: IOriginalDataDiffElement[];
    }[]
}

export interface IOriginalData {
    configFile: string;
    date: number;
    original: string;
    comparator: string;
    pages: IOriginalDataPage[];
}