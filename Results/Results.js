define(["require", "exports", './components/bs-collapsible-panel', './components/diff-element', './components/diff-element-diff', "./mapping/diff-element", "./FileOperations"], function (require, exports, bsCollapsiblePanel, diffElement, diffElementDiff, diff_element_1, fileOps) {
    "use strict";
    ko.components.register('bs-collapsible-panel', {
        viewModel: bsCollapsiblePanel.viewModel,
        template: bsCollapsiblePanel.template
    });
    ko.components.register('diff-element', {
        viewModel: diffElement.viewModel,
        template: diffElement.template
    });
    ko.components.register('diff-element-diff', {
        viewModel: diffElementDiff.viewModel,
        template: diffElementDiff.template
    });
    var ViewModel = function () {
        var self = this;
        self.loadFile = function () {
            fileOps.loadFile('fileinput', function (e) {
                var lines = e.target.result;
                var mappingOptions = {
                    'elementsToTest': diff_element_1.diffElementMapper
                };
                ko.mapping.fromJSON(lines, mappingOptions, self.data);
            });
        };
        self.data = {
            original: ko.observable('loading...'),
            comparator: ko.observable('loading...'),
            date: ko.observable('loading...'),
            pages: ko.observableArray([])
        };
        self.convertedDate = ko.pureComputed(function () {
            if (self.data.date() != 'loading...') {
                return new Date(self.data.date()).toString();
            }
            else {
                return self.data.date();
            }
        });
        return self;
    };
    ko.applyBindings(new ViewModel());
});
//# sourceMappingURL=Results.js.map