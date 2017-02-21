interface pageInterface {
    id:string;
    name: string;
    url:string;
    elementsToTest:diffElementInterface[];
    elementsToIgnore:string[];
    isProcessed: boolean;
}
