"use strict";
let elementsToCheck = [
    'xhr-header-container',
    'xhr-footer-container'
];
exports.styleConfig = {
    beforeUrl: "consumer.xperthrsystest.rbidev.ds",
    afterUrl: "consumer.xperthrlocal.rbidev.ds",
    pages: [
        {
            id: 'home',
            name: 'Home page of XpertHR',
            path: '/',
            elementsToTest: elementsToCheck
        },
        {
            id: 'employement-law-manual',
            name: 'XpertHRs Employment Law Manual',
            path: '/employment-law-manual/',
            elementsToTest: elementsToCheck.concat(['#toolNavigationHeadings'])
        }
    ],
    outputPath: 'd:/output.txt'
};
//# sourceMappingURL=xhr-config.js.map