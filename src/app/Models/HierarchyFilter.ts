export interface Region_H {
    Region: string;
    isSelected: boolean;
}
export interface VP_H {
    VP: string;
    isSelected: boolean;
}
export interface SrLeader_H {
    Sr_Leader: string;
    isSelected: boolean;
}
export interface Leader_H {
    LeaderOne: string;
    isSelected: boolean;
}
export interface Name_H {
    Name : string;
    isSelected: boolean;
}
export interface LeaderTwo_H {
    LeaderTwo: string;
    isSelected: boolean;
}
export interface RevenueId_H {
    item_id : string;
    item_text : string;
    Region : string;
    Workspace_Title : string;
    RevenueID: string;
    Opportunity_ID : string,
    isSelected: boolean;
    CountryCode : string;
}
export interface DropDownList{
    item_id : string;
    item_text : string;
}
export interface HierarchyFilter {
    Region: Region_H[];
    VP: VP_H[];
    Sr_Leader: SrLeader_H[];
    Leader: Leader_H[];
    Name: Name_H[];
    message: string;
    code: number;
    LeaderTwo: LeaderTwo_H[];
    RevenueId : RevenueId_H[];
}