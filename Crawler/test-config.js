"use strict";
exports.crawlerConfig = {
    beforeUrl: "127.0.0.1:8080/a.html",
    afterUrl: "127.0.0.1:8080/b.html",
    pages: [
        {
            id: 'home',
            name: 'Home page',
            path: '',
            elementsToTest: ['h1', '#paragraphElement', '#listElement']
        }
    ],
    outputPath: 'g:/output.txt'
};
//# sourceMappingURL=test-config.js.map