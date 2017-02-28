interface diffElementInterface {
    selector: string;
    original: any;
    comparand: any;
    error?:string;
    diff:deepDiff.IDiff[];
}
