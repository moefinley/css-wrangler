let elementsToCheck = [
    'xhr-header-container',
    'xhr-footer-container'
];

export const styleConfig = {
    beforeUrl: "consumer.xperthrsystest.rbidev.ds",
    afterUrl: "consumer.xperthrlocal.rbidev.ds",
    pages: [
        {
            id: 'home',
            name: 'Home page of XpertHR',
            path: '/',
            elementsToCheck: elementsToCheck
        },
        {
            id: 'employement-law-manual',
            name: 'XpertHRs Employment Law Manual',
            path: '/employment-law-manual/',
            elementsToCheck: elementsToCheck.concat(['#toolNavigationHeadings'])
        }
    ],
    outputPath: 'd:/output.txt'
};