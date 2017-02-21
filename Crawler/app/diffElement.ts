export class DiffElement implements diffElementInterface{
    public original: any = {};
    public comparand: any = {};
    public diff:deepDiff.IDiff[] = [];
    constructor (public selector: string) {

    };
}