export const template = `
    <td data-bind="text: kind"></td>
    <td class="path" data-bind="text:path"></td>
    <td data-bind="text:lhs"></td>
    <td data-bind="text:rhs"></td>
`.toString();
export function viewModel (params) {
    var self = this;
    self.kind = params.kind;
    self.path = !!params.path ? params.path.join(', ') : "no path";
    /* LHS conditions etc. */
    self.lhs = !!params.lhs ? params.lhs : "---";
    self.rhs = !!params.rhs ? params.rhs : "---";
    return self;
};