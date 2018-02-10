"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const nopt = require("nopt");
let noptConfigKnownOpts = {
    'config': path,
    'getOriginal': Boolean,
    'original': path,
    'showResults': Boolean,
    'verbose': Boolean
};
let parsed = nopt(noptConfigKnownOpts, {}, process.argv, 2);
exports.verbose = parsed.verbose;
exports.showResults = parsed.showResults;
exports.config = parsed.config;
exports.original = parsed.original;
exports.getOriginal = parsed.getOriginal;
//# sourceMappingURL=settings.js.map