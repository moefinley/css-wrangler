import {IPageExtConfig} from "./IPageExtConfig";

export interface ICrawlerExtConfig {
    beforeUrl: string;
    afterUrl: string;
    beforeQueryString: string;
    afterQueryString: string;
    pages: IPageExtConfig[];
    outputPath: string;
}