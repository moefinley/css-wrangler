"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const opn = require("opn");
const path = require("path");
const serve = require("serve");
const ConfigFileParser_1 = require("./config/ConfigFileParser");
const Settings = require("./settings/settings");
const computedStyleTest_1 = require("./computedStyleTest");
function run() {
    if (Settings.showResults) {
        console.log('opening url');
        serve(path.resolve(__dirname, '../../results/'), {
            port: 1337,
            ignore: ['node_modules']
        });
        opn('http://localhost:1337/results.html').then(() => {
            console.log('Serving results page. Press return to exit....');
            process.stdin.resume();
            process.stdin.on('data', process.exit);
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