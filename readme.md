# Frozen DOM/Computed Style testing
To help refactor CSS across a large site this will crawl through an original and revised version of the site and show you the difference to the computed styles (the final result of all CSS applied to an element) of all the elements on all of the pages.

The simplest way to use this is to provide:
- Two different URLs to the site you want to check - the original and revised (normally the site hosted on your local dev machine and the live version of the site)
- A number of paths to pages you want the to crawl (i.e. /home/ or /article/)
- A number of selectors for elements on those pages (i.e. #header or .article-heading). This can just be the html element if you don't want to divide up the results

When run the application will generate three files:
- A JSON file containing all the original computed styles scraped
- A JSON file containing all the revised computed styles scraped
- A JSON file containing the difference between the two

The difference can then be viewed through Results/Results.html
![screen shot](https://github.com/moefinley/css-wrangler/raw/master/screenshot.png)
 
## Running the Crawler
To run crawler use the following command

```node Crawler\App.js --config your-config-file.js```

The config file is a CommonJS module exporting a variable called ```crawlerConfig```

```
export const crawlerConfig = {
    beforeUrl: "127.0.0.1:8080/a.html",
    afterUrl: "127.0.0.1:8080/b.html",
    pages: [
        {
            id: 'home',
            name: 'Home page',
            path: '/',
            elementsToTest: ['h1', '.element-with-class', '#elementWithId']
        }
        {
            id: 'about',
            name: 'About page',
            path: '/about/',
            elementsToTest: ['h1', '.element-with-class', '#elementWithId']
        }
    ],
    outputPath: 'c:/crawlerOutput.txt'
};
```

The ```pages``` object's ```id``` must not contain whitespace or hyphens.
 
## Viewing the results
Open ```Results/Results.html``` and load any JSON file the crawler has produced. If there were any difference you should see a list of each page where differences occurred.

The numbers next to each page show the number of style changes and the number of element/content changes. 
Potentially there are more style changes within these elements but without something to compare it to the crawler can't tell.
 
## Roadmap 
 
### Short term
 - Show the number of ignored elements on results page
 - Break down ComputedStyleTest.ts into separate concerns
 - Add elements to ignore to crawler configuration
 - Capture Selenium errors and translate them to more user friendly errors
    + Selenium error 'element can't be found' should list the element selector and the current page
 - Find a cross browser replacement for document.querySelector() without effecting the page so results can be gathered from IE8

### Medium term
 - Allow the gathering of a/b computed styles and the comparision to happen at separate times
 - Allow Selenium commands and/or JavaScript functions to be run on the page before gathering computed styles. This would allow for JavaScript features to be tested. 
 
### Long term
 - Save data to database instead of JSON file
 - Make the consumer site faster by lazy loading data from database
