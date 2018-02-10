import * as opn from "opn";
import * as path from "path";
import {readConfigFile} from "./config/ConfigFileParser";
import * as Settings from "./settings/settings";
import {beforeExit, init} from "./computedStyleTest";

export function run(){
    if(Settings.showResults) {
        console.log('opening url');
        opn(path.resolve(__dirname, '../../results/results.html')).then(()=>{
            process.exit();
        });
    } else {
        readConfigFile();
        init();
    }
    process.on('exit', (code) => {
        beforeExit();
    });
}