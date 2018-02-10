import * as path from "path";
import * as nopt from "nopt";

let noptConfigKnownOpts = {
    'config' : path,
    'getOriginal' : Boolean,
    'original' : path,
    'showResults': Boolean,
    'verbose': Boolean
};
let parsed = <any>nopt(noptConfigKnownOpts, {}, process.argv, 2);

export var verbose:boolean = parsed.verbose;
export var showResults:boolean = parsed.showResults;
export var config:string = parsed.config;
export var original:string = parsed.original;
export var getOriginal:boolean = parsed.getOriginal;