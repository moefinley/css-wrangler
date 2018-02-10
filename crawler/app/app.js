"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const opn = require("opn");
const path = require("path");
const ConfigFileParser_1 = require("./config/ConfigFileParser");
const Settings = require("./settings/settings");
const computedStyleTest_1 = require("./computedStyleTest");
function run() {
    if (Settings.showResults) {
        console.log('opening url');
        opn(path.resolve(__dirname, '../../results/results.html')).then(() => {
            process.exit();
        });
    }
    else {
        ConfigFileParser_1.readConfigFile();
        computedStyleTest_1.init();
    }
    process.on('exit', (code) => {
        computedStyleTest_1.beforeExit();
    });
}
exports.run = run;
//# sourceMappingURL=app.js.map