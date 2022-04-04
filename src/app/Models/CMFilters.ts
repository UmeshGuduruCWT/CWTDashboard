export interface CM_ProjectStatus {
    iMeet_Milestone___Project_Status: string;
    isSelected: boolean;
}
export interface CM_ProjectLevel {
    iMeet_Project_Level: string;
    isSelected: boolean;
}
export interface CM_Region {
    Region__Opportunity_: string;
    isSelected: boolean;
}
export interface CM_Year {
    Go_Live_Year: string;
    isSelected: boolean;
}
export interface CM_ProjectSum {
    Project_Sum: string;
    isSelected: boolean;
}
export interface GlobalPL {
    Global_PL_Leader: string;
    isSelected: boolean;
}
export interface RegionalPL {
    Regional_PL_Leader: string;
    isSelected: boolean;
}
export interface LocalPL {
    Local_PL_Leader: string;
    isSelected: boolean;
}
export interface GlobalPM {
    Global_Project_Manager: string;
    isSelected: boolean;
}
export interface RegionalPM {
    Regional_Project_Manager: string;
    isSelected: boolean;
}
export interface CM_Quarter{
    Quarter : string;
    isSelected: boolean;
}
export interface CMFilters {
    message: string;
    code: number;
    ProjectStatus: CM_ProjectStatus[];
    ProjectLevel: CM_ProjectLevel[];
    Region: CM_Region[];
    Years: CM_Year[];
    ProjectSum: CM_ProjectSum[];
    GlobalPL: GlobalPL[];
    RegionalPL: RegionalPL[];
    LocalPL: LocalPL[];
    GlobalPM: GlobalPM[];
    RegionalPM: RegionalPM[];
    Quarter : CM_Quarter[];
}