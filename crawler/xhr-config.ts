const elementsOnAllPages = [
    '.xhr-header-container',
    '.xhr-footer-container'
];
const elementsOnToolLikePages = [
    '.page-header'
];
const elementsOnToolLandingPages = [
    '#toolNavigationHeadings'
];

export const crawlerConfig = {
    beforeUrl: "xperthr.systest.gb.xpa.rbxd.ds",
    afterUrl: "consumer.gb.xperthrsystest.rbidev.ds",
    pages: [
        {
            id: 'home',
            name: 'Home page of XpertHR',
            path: '/',
            elementsToTest: elementsOnAllPages.concat(['.page-body']),
            elementsToIgnore: ['.tabbed-panel']
        },
        {
            id: 'employement-law-manual',
            name: 'Employment Law Manual',
            path: '/employment-law-manual/',
            elementsToTest: elementsOnAllPages.concat(elementsOnToolLikePages).concat(elementsOnToolLandingPages)
        },
        {
            id: 'tasks',
            name: 'Tasks',
            path: '/tasks/',
            elementsToTest: elementsOnAllPages.concat(elementsOnToolLikePages).concat(elementsOnToolLandingPages)
        },
        {
            id: 'topics',
            name: 'Topics',
            path: '/topics/',
            elementsToTest: elementsOnAllPages.concat(['.page-article', '.page-aside'])
        },
        {
            id: 'tools',
            name: 'Tools',
            path: '/tools-and-services/',
            elementsToTest: elementsOnAllPages.concat(['.xhr-section'])
        }
    ],
    outputPath: 'd:/output.txt'
};