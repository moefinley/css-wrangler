var elementDiffTemplate = `
    <td data-bind="text: kind"></td>
    <td class="path" data-bind="text:path"></td>
    <td data-bind="text:lhs"></td>
    <td data-bind="text:rhs"></td>
`.toString();
var elementDiffViewModel = function(params) {
    var self = this;
    self.kind = params.kind;
    self.path = !!params.path ? params.path().join(', ') : "no path";
    /* LHS conditions etc. */
    self.lhs = !!params.lhs ? params.lhs : "---";
    self.rhs = !!params.rhs ? params.rhs : "---";
    return self;
};
ko.components.register('element-diff', {
    viewModel: elementDiffViewModel,
    template: elementDiffTemplate
});

var ViewModel = function(){
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
            lines = e.target.result;
            ko.mapping.fromJSON(lines, {}, self.data);
        }
    };
    self.data = {
        original: ko.observable('loading...'),
        comparator: ko.observable('loading...'),
        date: ko.observable('loading...'),
        pages: ko.observableArray([])
    };
    self.convertedDate = ko.pureComputed(function(){
        if(self.data.date() != 'loading...'){
            return Date(self.data.date()).toString();
        } else {
            return self.data.date();
        }
    });

    return self;
};
ko.applyBindings(new ViewModel());