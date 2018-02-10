"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
class ConfigClass {
    constructor() {
        this.getOriginal = false;
        this.beforeUrl = "";
        this.afterUrl = "";
        this.beforeQueryString = "";
        this.afterQueryString = "";
        this.set = (getOriginal, beforeUrl, afterUrl, beforeQueryString, afterQueryString, outputPath) => {
            this.getOriginal = getOriginal;
            this.beforeUrl = beforeUrl;
            this.afterUrl = afterUrl;
            this.beforeQueryString = beforeQueryString;
            this.afterQueryString = afterQueryString;
            let parsedOutputPath = path.parse(outputPath);
            this.diffOutputPath = path.normalize(outputPath);
            this.originalOutputPath = path.join(parsedOutputPath.dir, parsedOutputPath.name + "-original" + parsedOutputPath.ext);
            this.comparandOutputPath = path.join(parsedOutputPath.dir, parsedOutputPath.name + "-comparand" + parsedOutputPath.ext);
        };
    }
}
exports.Config = new ConfigClass();
//# sourceMappingURL=Config.js.map