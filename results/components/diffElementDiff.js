define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.template = `
    <td data-bind="text: kind"></td>
    <td class="path" data-bind="text:friendlyPath"></td>
    <td data-bind="text:lhs"></td>
    <td data-bind="text:rhs"></td>
`.toString();
    function viewModel(params) {
        return params;
    }
    exports.viewModel = viewModel;
    ;
});
//# sourceMappingURL=diffElementDiff.js.map