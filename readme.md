# Basic implementation of Frozen DOM/Computed Style testing
With this application you provide:
- Two different host names (normally the site hosted on your local dev machine and the live version of the site)
- A number of pages (i.e. /home/ or /article/)
- A number of selectors for elements on those pages (i.e. #header or .article-heading)

This application will then produce a JSON file containing details for any style differences between the two pages. The JSON file can be read by Results.html which provides a quick overview and a way to drill into the details of the differences.

This is a very rough implementation and still requires work to improve the usability. Also it has yet to be heavly tested and might be unstable in certain situations (that I've yet to discover).
 
## Roadmap 
 
### Short term
 - Move the load file form to a dialog box
 - Remove Protractor and replace with a standard Selenium
 - Find a cross browser replacement for document.querySelector() without effecting the page so results can be gathered from IE8
 - Move page and element configuration to JSON file
 - Convert Node application to Typescript (then share 'file-operations' module)
 - Create shorter XPaths by looking for a parent ID
 - Save the name of the config file used to produce the diffs
 
### Long term
 - Save data to database instead of file
 - Make the consumer site faster by lazy loading data from database
