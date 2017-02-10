define(["require", "exports", "./Mapping", "./FileOperations", "./Filter"], function (require, exports, Mapping_1, fileOps, Filter_1) {
    "use strict";
    let $fileInputModal = $('#fileInputModal');
    $(function () {
        $fileInputModal.modal();
    });
    class ViewModel {
        constructor() {
            //let self = this;
            this.loadFile = () => {
                fileOps.loadFile('fileinput', (e) => {
                    $fileInputModal.modal('hide');
                    let lines = e.target.result;
                    ko.mapping.fromJSON(lines, Mapping_1.mappingOptions, this.data);
                    /*
                     * Knockout doesn't like updating arrays while mapping
                     * So this...
                     */
                    this.filters(this.filters().concat(this.pendingFilters));
                });
            };
            this.data = {
                configFile: ko.observable('loading...'),
                original: ko.observable('loading...'),
                comparator: ko.observable('loading...'),
                date: ko.observable('loading...'),
                pages: ko.observableArray([])
            };
            this.filters = ko.observableArray([
                new Filter_1.Filter('background-image')]);
            this.pendingFilters = [];
            this.convertedDate = ko.pureComputed(() => {
                if (this.data.date() != 'loading...') {
                    return new Date(this.data.date()).toString();
                }
                else {
                    return this.data.date();
                }
            });
        }
        addFilter(propertyName) {
            if (this.filters().findIndex(filter => filter.property === propertyName) === -1) {
                this.pendingFilters.push(new Filter_1.Filter(propertyName));
            }
        }
        ;
    }
    exports.viewModel = new ViewModel();
});
//# sourceMappingURL=ViewModel.js.map