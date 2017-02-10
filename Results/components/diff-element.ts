import {DiffStyleDiff} from "../mapping/diff-style-diff";
/**
 * Created by neilt on 23/01/2017.
 */
export function viewModel(diffElement: IDiffElement) {
    let self = this;
    self.selector = diffElement.selector;
    self.elementDiffs = diffElement.elementDiffs;
    self.styleDiffs = diffElement.styleDiffs;
}
export let template = `
<bs-collapsible-panel params="elementDiffs: elementDiffs, isExpanded: false">
    <span class="panel-heading">Element changes</span>
    <table class="table table-striped">
            <thead>
            <tr>
                <th>Kind</th>
                <th>Path to property<br/><small>XPaths represent an element</small></th>
                <th>Original</th>
                <th>Comparand</th>
            </tr>
            </thead>
            <tbody>
            <!-- ko foreach: elementDiffs -->
            <tr class="results-row" data-bind="component: {name: 'diff-element-diff', params: $data}"></tr>
            <!-- /ko -->
            </tbody>
    </table>
</bs-collapsible-panel>
<bs-collapsible-panel params="styleDiffs: styleDiffs, isExpanded: true">
    <span class="panel-heading">Style changes</span>
    <table class="table table-striped">
            <thead>
            <tr>
                <th>Kind</th>
                <th>Property<br/><small>XPaths represent an element</small></th>
                <th>Original</th>
                <th>Comparand</th>
            </tr>
            </thead>
            <tbody>
            <!-- ko foreach: styleDiffs -->
            <tr class="results-row" data-bind="component: {name: 'diff-element-diff', params: $data}, visible: isVisible"></tr>
            <!-- /ko -->
            </tbody>
    </table>
</bs-collapsible-panel>
`.toString();