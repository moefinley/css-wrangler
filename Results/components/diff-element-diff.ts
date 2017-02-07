export const template = `
    <td data-bind="text: kind"></td>
    <td class="path" data-bind="text:friendlyPath"></td>
    <td data-bind="text:lhs"></td>
    <td data-bind="text:rhs"></td>
`.toString();
export function viewModel (params) {
    return params;
};