export interface ProjectStatus {
    Milestone__Project_Status: string;
    isSelected: boolean;
}
export interface CriticalOverDue {
    Critical_Overdue?: number;
    isSelected: boolean;
}
export interface GroupName {
    Group_Name: string;
    isSelected: boolean;
}
export interface ProjectLevel {
    Workspace__Project_Level: string;
    isSelected: boolean;
}
export interface Region {
    Milestone__Region: string;
    isSelected: boolean;
}
export interface Country {
    Milestone__Country: string;
    isSelected: boolean;
}
export interface CtoFilters {
    message: string;
    code: number;
    ProjectStatus: ProjectStatus[];
    CriticalOverDue: CriticalOverDue[];
    GroupName: GroupName[];
    ProjectLevel: ProjectLevel[];
    Region: Region[];
    Country: Country[];
}