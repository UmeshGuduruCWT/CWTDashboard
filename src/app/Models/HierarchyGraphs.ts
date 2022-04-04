export interface HierarchyGraphs {
    message: string;
    code: number;
    LevelWiseData : LevelWiseData[];
    RegionWiseData : RegionWiseData[];
    StatusWiseData : StatusWiseData[];
    MonthWiseData : MonthWiseData[];
}

export interface LevelWiseData{
    iMeet_Project_Level  : string;
    RevenueVolume : number;
    ProjectsCount : number;
}
export interface RegionWiseData{
    Region__Opportunity_ : string;
    RevenueVolume : number;
    ProjectsCount : number;
}
export interface StatusWiseData{
    ProjectStatus : string;
    RevenueVolume : number;
    ProjectsCount : number;
}
export interface MonthWiseData{
    Go_Live_Month : string;
    RevenueVolume : number;
    ProjectsCount : number;
}