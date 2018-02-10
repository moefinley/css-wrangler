/* External config file interfaces */
export interface IPageExtConfig {
    id: string;
    name: string;
    path: string;
    elementsToTest: string[];
    elementsToIgnore?: string[];
}