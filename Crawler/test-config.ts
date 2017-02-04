export const styleConfig = {
    beforeUrl: "127.0.0.1:8080/a.html",
    afterUrl: "127.0.0.1:8080/b.html",
    pages: [
        {
            id: 'home',
            name: 'Home page',
            path: '',
            elementsToTest: ['body']
        }
    ],
    outputPath: 'g:/output.txt'
};