define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.template = "\n    <td data-bind=\"text: kind\"></td>\n    <td class=\"path\" data-bind=\"text:path\"></td>\n    <td data-bind=\"text:lhs\"></td>\n    <td data-bind=\"text:rhs\"></td>\n".toString();
    function viewModel(params) {
        var self = this;
        self.kind = params.kind;
        self.path = !!params.path ? params.path.join(', ') : "no path";
        /* LHS conditions etc. */
        self.lhs = !!params.lhs ? params.lhs : "---";
        self.rhs = !!params.rhs ? params.rhs : "---";
        return self;
    }
    exports.viewModel = viewModel;
    ;
});
//# sourceMappingURL=diff-element-diff.js.map