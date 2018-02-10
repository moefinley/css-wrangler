import * as path from "path";

class ConfigClass {
    public getOriginal:boolean = false;
    public beforeUrl:string = "";
    public afterUrl:string = "";
    public beforeQueryString:string = "";
    public afterQueryString:string = "";
    public diffOutputPath;
    public originalOutputPath;
    public comparandOutputPath;
    public set = (getOriginal: boolean,
                  beforeUrl: string,
                  afterUrl: string,
                  beforeQueryString: string,
                  afterQueryString: string,
                  outputPath: string
    )=>{
        this.getOriginal= getOriginal;
        this.beforeUrl= beforeUrl;
        this.afterUrl= afterUrl;
        this.beforeQueryString= beforeQueryString;
        this.afterQueryString= afterQueryString;
        let parsedOutputPath = path.parse(outputPath);
        this.diffOutputPath = path.normalize(outputPath);
        this.originalOutputPath = path.join(parsedOutputPath.dir, parsedOutputPath.name + "-original" + parsedOutputPath.ext);
        this.comparandOutputPath = path.join(parsedOutputPath.dir, parsedOutputPath.name + "-comparand" + parsedOutputPath.ext);
        
    }
}
export var Config = new ConfigClass();
