define(["require", "exports", "./mapping", "./fileOperations", "./propertyFilter", "./addPropertyAndValueFilterViewModel"], function (require, exports, mapping_1, fileOps, propertyFilter_1, addPropertyAndValueFilterViewModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let $fileInputModal = $('#fileInputModal');
    let $addPropertyAndValueFilter = $('#addPropertyAndValueFilterDialog');
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
                    ko.mapping.fromJSON(lines, mapping_1.mappingOptions, this.data);
                    /*
                     * Knockout doesn't like updating arrays while mapping
                     * So this...
                     */
                    this.propertyNameFilters(this.propertyNameFilters().concat(this.pendingFilters));
                });
            };
            this.data = {
                configFile: ko.observable('loading...'),
                original: ko.observable('loading...'),
                comparator: ko.observable('loading...'),
                date: ko.observable('loading...'),
                pages: ko.observableArray([])
            };
            this.propertyNameFilters = ko.observableArray();
            this.addPropertyAndValueFilter = new addPropertyAndValueFilterViewModel_1.AddPropertyAndValueFilterViewModel($addPropertyAndValueFilter);
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
            if (this.pendingFilters.findIndex(filter => filter.propertyName === propertyName) === -1) {
                this.pendingFilters.push(new propertyFilter_1.PropertyNameFilter(propertyName));
            }
        }
        ;
    }
    exports.viewModel = new ViewModel();
});
//# sourceMappingURL=viewModel.js.map