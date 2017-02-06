export class DiffElementDiff implements IDiffElementDiff {
    public isElement: boolean;
    public path: string;
    public lhs: string;
    public rhs: string;

    constructor(public deepDiffObj: deepDiff.IDiff) {
        this.path = !!deepDiffObj.path ? deepDiffObj.path.join(', ') : "no path";
        this.lhs = !!deepDiffObj.lhs ? deepDiffObj.lhs.toString() : "---";
        this.rhs = !!deepDiffObj.rhs ? deepDiffObj.rhs.toString() : "---";
        this.isElement = (!!deepDiffObj.lhs && !!deepDiffObj.lhs.styleProperties)
            || (!!deepDiffObj.rhs && !!deepDiffObj.rhs.styleProperties);
    }
}