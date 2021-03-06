define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function logInfo(logMessage) {
        console.log(logMessage);
    }
    exports.logInfo = logInfo;
    function logVerboseInfo(logMessage) {
        console.log(logMessage);
    }
    exports.logVerboseInfo = logVerboseInfo;
    function logError(logMessage) {
        console.error(logMessage);
    }
    exports.logError = logError;
});
//# sourceMappingURL=logging.js.map