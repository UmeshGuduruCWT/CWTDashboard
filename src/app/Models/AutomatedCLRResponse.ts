export interface CLRData {
    CLRID: number;
    RevenueID: number;
    Region: string;
    Country: string;
    OwnerShip: string;
    GoLiveDate_c: string;
    ProjectStatus: string;
    M_Project_Status : string;
    CountryStatus: string;
    ProjectLevel: string;
    CompletedDate_c : string;
    ProjectOwner: string;
    AssigneeFullName: string;
    MilestoneTitle: string;
    Milestone__Record_ID_Key: string;
    Task__Task_Record_ID_Key: string;
    Group_Name: string;
    Milestone__Project_Notes: string;
    Milestone__Reason_Code: string;
    Milestone__Closed_Loop_Owner: string;
    Workspace_Title: string;
    Workspace__ELT_Overall_Status: string;
    Workspace__ELT_Overall_Comments: string;
    Customer_Row_ID: number;
    Opportunity_ID: number;
    Account_Name: string;
    Sales_Stage_Name: string;
    Opportunity_Type: string;
    Revenue_Opportunity_Type: string;
    Revenue_Status: string;
    Opportunity_Owner: string;
    Opportunity_Category: string;
    Revenue_Total_Transactions: number;
    CountryCode: string;
    RevenueVolumeUSD: number;
    MarketLeader: string;
    GlobalProjectManager: string;
    ProjectConsultant: string;
    RegionalProjectManager?: any;
    GlobalCISOBTLead: string;
    GlobalCISHRFeedSpecialist: string;
    GlobalCISPortraitLead: string;
    GoLiveMonth: string;
    GoLiveYear: string;
    BacklogStarted: string;
    Quarter: string;
    CycleTime: number;
    ExternalKickoffDuedate: Date;
    ExternalKickoffDuedate_c: string;
    CompletedDate?: Date;
    GoLiveDate: Date;
}
export interface AutomatedCLRResponse {
    message: string;
    code: number;
    Data: CLRData[];
}
export interface ManualCLRDataResponse {
    message: string;
    code: number;
    Data: DataCLR[];
}
export class DataCLR {
    CLRID : number;
    CheckComments : string;
    ManualID : number;
    Revenue_ID : number;
    RevenueID: string;
    Client: string;
    DTID : number;
    ComplexityScore : number;
    iMeet_Workspace_Title: string;
    Date_added_to_the_CLR : Date;
    YearMonth : string;
    Implementation_Type: string;
    CLR_Country: string;
    Pipeline_status: string;
    Pipeline_comments : string;
    Service_configuration : string;
    OBT_Reseller___Direct : string;
    CreatedDate : Date;
    CreatedDate_c : string;
    TaskStatus : string;
    Servicing_location : string;
    Assignment_date : Date;
    New_Business_volume__US__ : number;
    RevenueVolumeUSD: number;
    Region: any;
    Country: string;
    CountryCode : string;
    OwnerShip: string;
    GoLiveDate: Date;
    ProjectStatus: any;
    Milestone__Reason_Code: string;
    PerCompleted : string;
    CountryStatus: string;
    ProjectLevel: string;
    Project_Level : string;
    CompletedDate?: Date;
    MilestoneDueDate : Date;
    MilestoneDueDate_c : string;
    ProjectOwner: string;
    GlobalProjectManager: string;
    ProjectConsultant: string;
    RegionalProjectManager: any;
    AssigneeFullName: any;
    GlobalCISOBTLead: string;
    RegionalCISOBTLead : string;
    LocalDigitalOBTLead : string;
    LocalDigitalAdHocSupport : string;
    GlobalCISPortraitLead: string;
    RegionalCISPortraitLead : string;
    GlobalCISHRFeedSpecialist: string;
    ActivityType : string;
    GDS : string;
    eSowGDS : string;
    ServiceConfiguration : string;
    MilestoneTitle: string;
    Milestone__Record_ID_Key: string;
    Group_Name: string;
    Milestone__Project_Notes: string;
    Milestone__Closed_Loop_Owner: string;
    Workspace__ELT_Overall_Status: string;
    Workspace__ELT_Overall_Comments: string;
    Customer_Row_ID : number;
    Opportunity_ID: number;
    Account_Name: string;
    Sales_Stage_Name: string;
    Opportunity_Type: string;
    Revenue_Status: string;
    Revenue_Opportunity_Type: string;
    Opportunity_Owner: string;
    Opportunity_Category: string;
    MarketLeader: string;
    Revenue_Total_Transactions: number;
    Line_Win_Probability : number;
    Next_Step : string;
    Implementation_Fee__PSD_: number;
    EMEA_Country_to_charge : string;
    EMEA_Client : string;
    EMEA_OBT_standard_fee : number;
    EMEA_Included_for_accrual : string;
    EMEA_Accrual_date : Date;
    EMEA_Scope_description : string;
    EMEA_Billing_notes: any;
    Manual_Entry__Wave_2__Wave_3__etc_: any;
    Project_Effort : number;
    Priority: any;
    Resource_Status : string;
    Global_Project_Manager_replacement: any;
    Regional_Project_Manager_replacement : string;
    Milestone__Assignee__Full_Name_replacement: any;
    Global_CIS_OBT_Lead_replacement: any;
    Global_CIS_HR_Feed_Specialist_replacement: any;
    Global_CIS_Portrait_Lead_replacement: any;
    Global_CIS_RoomIT_Integration_Lead_replacement : string;
    Date_added_to_the_CLR_c : string;
    TestingDate : Date;
    Assignment_date_c : string;
    UpdateOn : Date;
    UpdateOn_c : string;
    OppVolume : number;
    OppVolume_c : string;
    New_Business_volume__US___c : string;
    RevenueVolumeUSD_c : string;
    GoLiveDate_c: Date;
    CompletedDate_c : string;
    EMEA_Accrual_date_c : string;
    Implementation_Fee__PSD_c :string;
    EMEA_OBT_standard_fee_c : string;
    CycleTime : number;
    ExternalKickoffDuedate : Date;
    ExternalKickoffDuedate_c : string;
    GoLiveYear : string;
    GoLiveMonth : string;
    Quarter : string;
    ProjectStart_ForCycleTime : any;
    ProjectStart_ForCycleTime_c : string;
    RecordStatus : string;
    DataSourceType : string;
    DataDescription : string;
    CycleTimeCategories : string;
    AwardedDate : Date;
    AwardedDate_c : string;
    ClosedDate : Date;
    ClosedDate_c : string;
    MilestoneType : string;
    AccountOwner : string;
    AccountCategory : string;
    SOWStatus : string;
    ImplementationReady : string;
}