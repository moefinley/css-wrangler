export class DiffGenericDiff implements IDiffElementDiff {
    deepDiffObj: deepDiff.IDiff;
    path: string;
    friendlyPath: string;
    lhs: string;
    rhs: string;
    kind: string;
    constructor(deepDiffObj){
        this.path = !!deepDiffObj.path ? deepDiffObj.path.join(', ') : "no path";
        this.lhs = !!deepDiffObj.lhs ? deepDiffObj.lhs.toString() : "---";
        this.rhs = !!deepDiffObj.rhs ? deepDiffObj.rhs.toString() : "---";
        this.kind = this.kinds[deepDiffObj.kind];
    }

    private kinds = {
        N : 'New',
        D : 'Deleted',
        E : 'Edit',
        A : 'Change in array'
    };
}