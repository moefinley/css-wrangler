export class DiffElementDiff implements IDiffElementDiff {
    public isElement: boolean;
    public path: string;
    public friendlyPath: string;
    public lhs: string;
    public rhs: string;
    public xpath: string;
    public styleProperty: string;
    public kind: string;

    constructor(public deepDiffObj: deepDiff.IDiff) {
        this.path = !!deepDiffObj.path ? deepDiffObj.path.join(', ') : "no path";
        this.lhs = !!deepDiffObj.lhs ? deepDiffObj.lhs.toString() : "---";
        this.rhs = !!deepDiffObj.rhs ? deepDiffObj.rhs.toString() : "---";
        this.isElement = (!!deepDiffObj.lhs && !!deepDiffObj.lhs.styleProperties)
            || (!!deepDiffObj.rhs && !!deepDiffObj.rhs.styleProperties);
        this.parsePath(deepDiffObj.path);
        if(this.xpath !== null){
            this.friendlyPath = `${this.xpath}, ${this.styleProperty}`;
        } else {
            this.friendlyPath = this.styleProperty;
        }
        this.kind = this.kinds[deepDiffObj.kind];
    }

    private kinds = {
        N : 'New',
        D : 'Deleted',
        E : 'Edit',
        A : 'Change in array'
    };

    private parsePath(rawPath:string[]){
        let pathLength = rawPath.length;
        this.styleProperty = rawPath[pathLength - 2] === "styleProperties" ? rawPath[pathLength - 1] : null;
        let reversedPath = rawPath.reverse();
        this.xpath = reversedPath.find(e => e.substring(0, 6) === 'xpath-') || null;
        this.xpath = this.xpath != null ? this.xpath.substring(7, this.xpath.length) : null;
    }
}