interface diffElementInterface {
    selector: string;
    elementDiffs: diffElementDiffInterface[]
    styleDiffs: diffElementDiffInterface[]
    styleDiffsCount: KnockoutComputed<number>
}