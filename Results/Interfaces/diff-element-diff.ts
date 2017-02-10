interface IDiffElementDiff {
    deepDiffObj: deepDiff.IDiff;
    path: string;
    friendlyPath: string;
    lhs: string;
    rhs: string;
    kind: string;
}
