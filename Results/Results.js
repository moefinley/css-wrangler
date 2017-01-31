define(["require", "exports", './components/diff-element', './components/diff-element-diff', "./mapping/diff-element"], function (require, exports, diffElement, diffElementDiff, diff_element_1) {
    "use strict";
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
            var input, file, fr;
            if (typeof window.FileReader !== 'function') {
                alert("The file API isn't supported on this browser yet.");
                return;
            }
            input = document.getElementById('fileinput');
            if (!input) {
                alert("Um, couldn't find the fileinput element.");
            }
            else if (!input.files) {
                alert("This browser doesn't seem to support the `files` property of file inputs.");
            }
            else if (!input.files[0]) {
                alert("Please select a file before clicking 'Load'");
            }
            else {
                file = input.files[0];
                fr = new FileReader();
                fr.onload = receivedText;
                fr.readAsText(file);
            }
            function receivedText(e) {
                var lines = e.target.result;
                var mappingOptions = {
                    'elementsToTest': diff_element_1.diffElementMapper
                };
                ko.mapping.fromJSON(lines, mappingOptions, self.data);
            }
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