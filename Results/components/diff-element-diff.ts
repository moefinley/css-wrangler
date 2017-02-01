export const template = `
    <td data-bind="text: deepDiffObj.kind"></td>
    <td class="path" data-bind="text:path"></td>
    <td data-bind="text:lhs"></td>
    <td data-bind="text:rhs"></td>
`.toString();
export function viewModel (params) {
    return params;
};