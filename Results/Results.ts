import * as diffElement from './components/diff-element';
import * as diffElementDiff from './components/diff-element-diff';
import {diffElementMapper} from "./mapping/diff-element";

declare global {
    interface Window {
        FileReader: any;
    }
}

ko.components.register('diff-element', {
    viewModel: diffElement.viewModel,
    template: diffElement.template
});
ko.components.register('diff-element-diff', {
    viewModel: diffElementDiff.viewModel,
    template: diffElementDiff.template
});

const ViewModel = function (): void {
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
            let lines = e.target.result;
            let mappingOptions = {
                'elementsToTest': diffElementMapper
            };
            ko.mapping.fromJSON(lines, mappingOptions, self.data);
        }
    };
    self.data = {
        original: ko.observable<string|any>('loading...'),
        comparator: ko.observable<string|any>('loading...'),
        date: ko.observable<string>('loading...'),
        pages: ko.observableArray<Page>([])
    };
    self.convertedDate = ko.pureComputed(function () {
        if (self.data.date() != 'loading...') {
            return new Date(self.data.date()).toString();
        } else {
            return self.data.date();
        }
    });

    return self;
};
ko.applyBindings(new ViewModel());