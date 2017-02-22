interface diffElementInterface {
    selector: string;
    original: any;
    comparand: any;
    diff:deepDiff.IDiff[];
}
