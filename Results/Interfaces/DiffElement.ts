interface IDiffElement {
    selector: string;
    elementDiffs: IDiffElementDiff[]
    styleDiffs: IDiffElementDiff[]
    styleDiffsCount: KnockoutComputed<number>
}