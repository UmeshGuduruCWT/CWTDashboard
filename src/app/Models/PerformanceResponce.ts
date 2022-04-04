export interface PerformanceResponce{
    message: string;
    code: number;
    GlobalManager: GlobalData[];
    RegionalManager : RegionalData[];
    LocalManager : LocalData[];
    Data : P_ManagerProjectDetails[];
}
export interface GlobalData{
    Manager : string;
    Leader : string;
    ClientCount : number;
    ProjectEffort : number;
    ProjectLevel : string;
    Role : string;
    Region : string;
    ProjectStatus : string;
    ProjectEffort_c : string;
    RevenueVolume : number;
    RevenueVolumeUSD : string;
}
export interface RegionalData{
    Manager_RM : string;
    Leader_RM : string;
    ClientCount_RM : number;
    RevenueVolume_RM : number;
    RevenueVolumeUSD : string;
}
export interface LocalData{
    Manager_LM : string;
    Leader_LM : string;
    ClientCount_LM : number;
    RevenueVolume_LM : number;
    RevenueVolumeUSD : string;
}
export interface P_ManagerProjectDetails{
    Client : string;
    RevenueVolumeUSD : number;
    Region : string;
    RevenueVolume : string;
    GlobalProjectManager : string;
    RegionalProjectManager : string;
    LocalProjectManager : string;
    AssigneeFullName : string;
    GoLiveDate : Date;
    Golive : string;
    ProjectStatus : string;
    ProjectLevel : string;
    RevenueID : string;
    ProjectEffort : number;
    Line_Win_Probability : string;
    Opportunity_Owner : string;
    Country : string;
    ImplementationType : string;
    OBTResellerDirect : string;
    Service_Configuration : string;
    GlobalCISOBTLead : string;
    RegionalCISOBTLead : string;
    LocalDigitalOBTLead : string;
    GlobalCISPortraitLead : string;
    RegionalCISPortraitLead : string;
    GlobalCISHRFeedSpecialist : string;

    Pipeline_comments : string;
    DataDescription : string;
    Next_Step : string;
}