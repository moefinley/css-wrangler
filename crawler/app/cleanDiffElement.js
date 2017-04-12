"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url = require("url");
exports.cleanDiffElement = function (diffElement) {
    if (typeof diffElement.diff !== 'undefined') {
        diffElement.diff = diffElement.diff.filter((element, index, array) => {
            let results = [];
            if (element.kind === "E") {
                let lhs = element.lhs;
                let rhs = element.rhs;
                results.push(isUrlDifferentBeyondDomain(lhs, rhs));
            }
            //If there are any false/negative in results array, return false
            return results.indexOf(false) === -1;
        });
    }
};
function isUrlDifferentBeyondDomain(lhs, rhs) {
    /* Remove URLs where the only difference is the domain */
    if (lhs.indexOf('url(') === 0 && rhs.indexOf('url(') === 0) {
        if (lhs.indexOf('"') > -1 || rhs.indexOf('"') > -1) {
            lhs = lhs.replace(/"/g, '');
            rhs = rhs.replace(/"/g, '');
        }
        let lhsUrl = url.parse(lhs.substring(4, lhs.length - 1));
        let rhsUrl = url.parse(rhs.substring(4, rhs.length - 1));
        if (lhsUrl.path === rhsUrl.path) {
            console.log('removing: ' + lhs);
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=cleanDiffElement.js.map