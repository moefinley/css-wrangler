/// <amd-dependency path="text!./diffElement.html" name="diffElementTemplate"/>
declare var diffElementTemplate:string;
export let template = diffElementTemplate;
export function viewModel(diffElement: diffElementInterface) {
    let self = this;
    self.selector = diffElement.selector;
    self.elementDiffs = diffElement.elementDiffs;
    self.styleDiffs = diffElement.styleDiffs;
}
