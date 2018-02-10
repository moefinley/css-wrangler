define(["require", "exports", "text!./diffElement.html"], function (require, exports, diffElementTemplate) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /// <amd-dependency path="text!./diffElement.html" name="diffElementTemplate"/>
    exports.template = diffElementTemplate;
    function viewModel(diffElement) {
        let self = this;
        self.selector = diffElement.selector;
        self.elementDiffs = diffElement.elementDiffs;
        self.styleDiffs = diffElement.styleDiffs;
    }
    exports.viewModel = viewModel;
});
//# sourceMappingURL=diffElement.js.map