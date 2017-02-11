interface IDiffElement {
    selector: string;
    original: any;
    comparand: any;
    diff:deepDiff.IDiff[];
}
