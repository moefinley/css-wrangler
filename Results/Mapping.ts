import {pageMapper} from "./mapping/page";
import {diffElementMapper} from "./mapping/diff-element";
export let mappingOptions = {
    'pages': pageMapper,
    'elementsToTest': diffElementMapper
};