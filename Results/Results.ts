import * as elementDiff from './components/element-diff';

declare global {
    interface Window {
        FileReader: any;
    }
}

ko.components.register('element-diff', {
    viewModel: elementDiff.viewModel,
    template: elementDiff.template
});

interface Page {
    id: string;
    name: string;
    url: string;
    elementsToTest: string;
}

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
            ko.mapping.fromJSON(lines, {}, self.data);
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