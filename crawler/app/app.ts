import * as opn from "opn";
import * as path from "path";
import * as serve from "serve";
import {readConfigFile} from "./config/ConfigFileParser";
import * as Settings from "./settings/settings";
import {beforeExit, init} from "./computedStyleTest";

export function run(){
    if(Settings.showResults) {
        console.log('opening url');
        serve(path.resolve(__dirname, '../../results/'), {
            port: 1337,
            ignore: ['node_modules']
        });
        opn('http://localhost:1337/results.html').then(()=>{
            console.log('Serving results page. Press return to exit....');

            process.stdin.resume();
            process.stdin.on('data', process.exit);
        });
    } else {
        readConfigFile();
        init();
    }
    process.on('exit', (code) => {
        beforeExit();
    });
}