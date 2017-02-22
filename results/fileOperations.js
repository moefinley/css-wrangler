define(["require", "exports"], function (require, exports) {
    "use strict";
    function loadFile(inputElementId, callback) {
        var input, file, fr;
        if (typeof window.FileReader !== 'function') {
            alert("The file API isn't supported on this browser yet.");
            return;
        }
        input = document.getElementById(inputElementId);
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
            callback(e);
        }
    }
    exports.loadFile = loadFile;
});
//# sourceMappingURL=fileOperations.js.map