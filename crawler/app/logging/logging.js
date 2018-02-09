"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function logInfo(logMessage) {
    console.log(logMessage);
}
exports.logInfo = logInfo;
let verboseLog = [];
function logVerboseInfo(logMessage) {
    verboseLog.push(logMessage);
}
exports.logVerboseInfo = logVerboseInfo;
function getVerboseLog() {
    return verboseLog;
}
exports.getVerboseLog = getVerboseLog;
let errorLog = [];
function logError(logMessage) {
    errorLog.push(logMessage);
}
exports.logError = logError;
function getErrorLog() {
    return errorLog;
}
exports.getErrorLog = getErrorLog;
//# sourceMappingURL=logging.js.map