import {Page} from "./page";

export let pages: Page[] = [];

/**
 *
 * @param {string} pageId
 * @returns {Page}
 */
export function getPage(pageId:string):Page{
    return pages.find(page => pageId === page.id );
}

/**
 *
 * @param {Page} page
 */
export function addPage(page:Page){
    //TODO: Check if the page ID clashes
    pages.push(page);
}
