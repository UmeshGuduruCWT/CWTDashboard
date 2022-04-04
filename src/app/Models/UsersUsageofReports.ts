export interface UsersReportType {
    TypeofUse: string;
    Count: number;
    LastUsedOn: Date;
    LastUsed : string;
    row : number;
    show : boolean;
    color : string;
}
export interface UserAudits {
    RevenueID: string;
    Field: string;
    row : number;
    OldValue : string;
    NewValue : string;
    PlatForm : string;
    show : boolean;
    UpdatedOn: Date;
    ReportUpdatedOn : string;
}
export interface UsersReport {
    ReportName: string;
    Count: number;
    Types: UsersReportType[];
    Audits : UserAudits[];
    LastUsedOn: Date;
    color : string;
    row : number;
    LastUsed : string;
}
export interface UsageData {
    UID: string;
    UserName: string;
    Count: number;
    Progress : number;
    Reports: UsersReport[];
    LastUsedOn: Date;
    LastLogin: string;
    show : boolean;
}
export interface UsersUsageofReports {
    message: string;
    code: number;
    Data: UsageData[];
}