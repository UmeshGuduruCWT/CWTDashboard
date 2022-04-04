export interface ProjectStatus {
    Milestone__Project_Status: string;
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

export interface Assignee {
    Milestone__Assignee__Full_Name: string;
    isSelected: boolean;
}

export interface AssigneeReportTO {
    Milestone__Assignee__Reports_to__Full_Name: string;
    isSelected: boolean;
}
export interface GroupName{
    Group_Name : string;
    isSelected: boolean;
}
export interface IMPSFilters {
    message: string;
    code: number;
    ProjectStatus: ProjectStatus[];
    ProjectLevel: ProjectLevel[];
    Region: Region[];
    Assignee: Assignee[];
    Assignee_ReportTO: AssigneeReportTO[];
    GroupName : GroupName[];
}