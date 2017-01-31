/**
 * Created by neilt on 23/01/2017.
 */
export function viewModel(diffElement:DiffElement){
    let self = this;
    self.selector = diffElement.selector;
    self.diff = diffElement.diff;
}
export var template = `
<h3 data-bind="text: selector"></h3>
<table class="table table-striped">
        <thead>
        <tr>
            <th>Kind</th>
            <th>Property</th>
            <th>Original</th>
            <th>Comparand</th>
        </tr>
        </thead>
        <tbody>
        <!-- ko foreach: diff -->
        <tr class="results-row" data-bind="component: {name: 'diff-element-diff', params: $data}"></tr>
        <!-- /ko -->
        </tbody>
</table>
`.toString();