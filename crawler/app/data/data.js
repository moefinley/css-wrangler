"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pages = [];
/**
 *
 * @param {string} pageId
 * @returns {Page}
 */
function getPage(pageId) {
    return exports.pages.find(page => pageId === page.id);
}
exports.getPage = getPage;
/**
 *
 * @param {Page} page
 */
function addPage(page) {
    //TODO: Check if the page ID clashes
    exports.pages.push(page);
}
exports.addPage = addPage;
//# sourceMappingURL=data.js.map