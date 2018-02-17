export class DiffElement implements diffElementInterface {
    public original: any = {};
    public comparand: any = {};
    public diff:deepDiff.IDiff[] = [];
    public error:string = null;
    constructor (public selector: string) {

    };
}