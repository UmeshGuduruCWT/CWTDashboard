export interface SGYear {
    Year: string;
    isSelected: boolean;
}
export interface SGTaskStatus {
    Task_Status: string;
    isSelected: boolean;
}
export interface SGMonth {
    Month: string;
    isSelected: boolean;
}
export interface SGProjectStatus {
    Project_Status : string;
    isSelected: boolean;
}
export interface SGFilters {
    message: string;
    code: number;
    Year: SGYear[];
    TaskStatus: SGTaskStatus[];
    Months: SGMonth[];
    ProjectStatus : SGProjectStatus[];
}