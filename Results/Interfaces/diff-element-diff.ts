interface IDiffElementDiff {
    isElement: boolean;
    deepDiffObj: deepDiff.IDiff;
    path: string;
    lhs: string;
    rhs: string;
}
