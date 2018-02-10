export const template = `
    <td data-bind="text: kind"></td>
    <td class="path" data-bind="text:friendlyPath"></td>
    <td><span data-bind="text:lhs"></span></td>
    <td><span data-bind="text:rhs"></span></td>
`.toString();
export function viewModel (params) {
    return params;
};