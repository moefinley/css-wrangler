import {pageMapper} from "./mapping/page";
import {diffElementMapper} from "./mapping/diffElement";
export let mappingOptions = {
    'pages': pageMapper,
    'elementsToTest': diffElementMapper
};