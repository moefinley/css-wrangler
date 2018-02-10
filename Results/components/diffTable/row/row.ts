/// <amd-dependency path="text!./row.html" name="rowTemplate"/>
declare let rowTemplate: string;

interface diffElementParams {
    kind: string;
    friendlyPath: string;
    lhs: string;
    rhs: string;
}

export const template = rowTemplate;
export function viewModel (params:diffElementParams) {
    return params;
};