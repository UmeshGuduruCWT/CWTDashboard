export interface Hierarchy_Data {
    HierarchyID: number;
    User_ID: string;
    Name: string;
    LeaderTwo: string;
    LeaderOne: string;
    Sr_Leader: string;
    VP: string;
    Email_Address: string;
    Region: string;
    Location: string;
    Role: string;
    Title: string;
    UserStatus: string;
}
export interface HierarchyData {
    message: string;
    code: number;
    Data: Hierarchy_Data[];
}