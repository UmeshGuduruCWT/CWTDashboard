export interface HierarcyResponce {
    message: string;
    code: number;
    Data: H_Data[];
}
export interface H_Data {
    WorkspaceTitle : string,
    MilestoneTitle : string,
    RevenueId : number,
    RevenueVolumeUSD : number,
    Country : string,
    Region : string,
    Vp : string,
    SeniorLeader : string,
    Leader : string,
    AssigneFullName : string,
    OwnershipRevenue : string,
    TaskGoliveDate : string,
    ProjectStatus : string,
    CountryStatus : string,
    ProjectLevel : string,
    ProjectStartDate : string,
    InitialGoliveDate : string,
    LastGoliveDate : string,
    CompletedDate : string,
    ProjectOwner : string,
    GlobalProjectManager : string,
    ProjectConsultant : string,
    RegionalProjectManager : string,
    GlobalCISOBTLead : string,
    GlobalCISHRFeed : string,
    GlobalCISPortraitLead : string,
    GlobalCISRoomIT : string,
    GlobalPLLeader : string,
    RecordIdKey : string,
    TaskGoLiveDateRecordIDKey : string,
    ELTOverallComments : string,
    ELTOverallStatus : string,
    GroupName : string,
    ProjectNotes : string,
    ReasonCode : string,
    CustomerRowId : string,
    OpportunityId : string,
    Account : string,
    SalesStageName : string,
    OpportunityType : string,
    RevenueStatus : string,
    RevenueOpportunityType : string,
    OpportunityOwner : string,
    MarketLeader : string,
    RevenueTotalTransactions : string,
}