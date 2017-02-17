interface IPage {
    id:string;
    name: string;
    url:string;
    elementsToTest:IDiffElement[];
    elementsToIgnore:string[];
    isProcessed: boolean;
}
