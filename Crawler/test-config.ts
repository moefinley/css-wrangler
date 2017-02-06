const sharedElementsToTest = ['h1', '#paragraphElement', '#listElement'];
export const crawlerConfig = {
    beforeUrl: "127.0.0.1:8080/a",
    afterUrl: "127.0.0.1:8080/b",
    pages: [
        {
            id: 'home',
            name: 'Home page',
            path: '/home.html',
            elementsToTest: sharedElementsToTest
        },
        {
            id: 'about',
            name: 'About page',
            path: '/about.html',
            elementsToTest: sharedElementsToTest.concat(['#aboutFooter'])
        },
        {
            id: 'same',
            name: 'Same page',
            path: '/same.html',
            elementsToTest: sharedElementsToTest
        }
    ],
    outputPath: 'd:/output.txt'
};