export function logInfo(logMessage:string):void{
    console.log(logMessage);
}

let verboseLog = [];
export function logVerboseInfo(logMessage:string):void{
    verboseLog.push(logMessage);
}

export function getVerboseLog():string[]{
    return verboseLog;
}

let errorLog = [];
export function logError(logMessage:string):void{
    errorLog.push(logMessage);
}

export function getErrorLog():string[] {
    return errorLog;
}