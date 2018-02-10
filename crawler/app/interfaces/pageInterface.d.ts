interface pageInterface {
    id: string;
    name: string;
    path: string;
    elementsToTest:diffElementInterface[];
    elementsToIgnore:string[];
    isProcessed: boolean;
}
