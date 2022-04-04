export interface ClrData {
    Client: string;
    iMeet_Workspace_Title: string;
    Implementation_Type: string;
    CLR_Country: string;
    Revenue_Total_Volume_USD: number;
    Revenue_Total_Volume: string;
    Region__Opportunity_: string;
    Country: string;
    Revenue_ID?: number;
    Task__Go_Live_Date: string;
    iMeet_Milestone___Project_Status: string;
    iMeet_Milestone__Country_Status: string;
    iMeet_Project_Level: string;
    iMeet_Milestone__Project_Start_Date?: string;
    iMeet_Milestone___Initial_Go_Live_Date?: string;
    Milestone__Last_Go_Live_Date: string;
    Completed_Date?: string;
    Workspace__Project_Owner: string;
    Global_Project_Manager: string;
    Project_Consultant: string;
    Regional_Project_Manager: string;
    Milestone_Title: string;
    Record_ID_Key: string;
    Task__Go_Live_Date_Record_ID_Key: string;
    Workspace__ELT_Overall_Status: string;
    Workspace__ELT_Overall_Comments: string;
    Customer_Row_ID?: number;
    Opportunity_ID?: number;
    Account: string;
    Opportunity_Type: string;
    Revenue_Status: string;
    Market_Leader: string;
    Revenue___Total_Transactions?: number;
    Go_Live_Year: string;
    GoLiveMonth : string;
    DataSourceType : string;
    Backlog_Started: string;
    Quarter: string;
}
export interface ClrResponse {
    message: string;
    code: number;
    Data: ClrData[];
}