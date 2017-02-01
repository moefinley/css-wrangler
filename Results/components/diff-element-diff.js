define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.template = "\n    <td data-bind=\"text: deepDiffObj.kind\"></td>\n    <td class=\"path\" data-bind=\"text:path\"></td>\n    <td data-bind=\"text:lhs\"></td>\n    <td data-bind=\"text:rhs\"></td>\n".toString();
    function viewModel(params) {
        return params;
    }
    exports.viewModel = viewModel;
    ;
});
//# sourceMappingURL=diff-element-diff.js.map