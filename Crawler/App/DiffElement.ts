export class DiffElement implements IDiffElement{
    public original: any = {};
    public comparand: any = {};
    public diff:deepDiff.IDiff[] = [];
    constructor (public selector: string) {

    };
}