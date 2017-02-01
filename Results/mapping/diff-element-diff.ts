export class DiffElementDiff implements IDiffElementDiff {
    public isElement: boolean;
    public path: string;
    public lhs: string;
    public rhs: string;

    constructor(public deepDiffObj: deepDiff.IDiff) {
        this.path = !!deepDiffObj.path ? deepDiffObj.path.join(', ') : "no path";
        this.rhs = !!deepDiffObj.lhs ? deepDiffObj.lhs.toString() : "---";
        this.lhs = !!deepDiffObj.rhs ? deepDiffObj.rhs.toString() : "---";
        this.isElement = (!!deepDiffObj.lhs && !!deepDiffObj.lhs.styleProperties)
            || (!!deepDiffObj.rhs && !!deepDiffObj.rhs.styleProperties);
    }
}