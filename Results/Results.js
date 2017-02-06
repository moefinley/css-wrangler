define(["require", "exports", './components/bs-collapsible-panel', './components/diff-element', './components/diff-element-diff', "./FileOperations", "./Mapping"], function (require, exports, bsCollapsiblePanel, diffElement, diffElementDiff, fileOps, Mapping_1) {
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
    var $fileInputModal = $('#fileInputModal');
    var ViewModel = function () {
        var self = this;
        self.loadFile = function () {
            fileOps.loadFile('fileinput', function (e) {
                $fileInputModal.modal('hide');
                var lines = e.target.result;
                ko.mapping.fromJSON(lines, Mapping_1.mappingOptions, self.data);
            });
        };
        self.data = {
            configFile: ko.observable('loading...'),
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
    $(function () {
        $fileInputModal.modal();
    });
    ko.applyBindings(new ViewModel());
});
//# sourceMappingURL=Results.js.map