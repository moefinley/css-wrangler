define(["require", "exports", "./Mapping", "./FileOperations", "./Filter"], function (require, exports, Mapping_1, fileOps, Filter_1) {
    "use strict";
    let $fileInputModal = $('#fileInputModal');
    $(function () {
        $fileInputModal.modal();
    });
    function ViewModel() {
        let self = this;
        self.loadFile = () => {
            fileOps.loadFile('fileinput', (e) => {
                $fileInputModal.modal('hide');
                let lines = e.target.result;
                ko.mapping.fromJSON(lines, Mapping_1.mappingOptions, self.data);
            });
        };
        self.data = {
            configFile: ko.observable('loading...'),
            original: ko.observable('loading...'),
            comparator: ko.observable('loading...'),
            date: ko.observable('loading...'),
            pages: ko.observableArray([]),
            filters: ko.observableArray([
                new Filter_1.filter('Background Image', 'background-image')
            ])
        };
        self.convertedDate = ko.pureComputed(function () {
            if (self.data.date() != 'loading...') {
                return new Date(self.data.date()).toString();
            }
            else {
                return self.data.date();
            }
        });
    }
    exports.viewModel = new ViewModel();
});
//# sourceMappingURL=ViewModel.js.map