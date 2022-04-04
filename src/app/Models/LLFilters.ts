export interface Region {
    Region: string;
    isSelected: boolean;
}
export interface Status {
    Status: string;
    isSelected: boolean;
}
export interface LLFilters {
    message: string;
    code: number;
    Region: Region[];
    Status: Status[];
}