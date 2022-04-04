export interface CTOResponce {
    message: string;
    code: number;
    Data: CTOData[];
}
export interface CTOData {
    Workspace_Title : string;
    Milestone_Title_Country___Est_Go_Live_Date : string;
    Task_Title : string;
    //Last_Comment : string;
    Milestone__Project_Status : string;
    ProjectsCount : number;
    Critical_Overdue : number;
    Estimated_Go_Live : string,
    Estimated_Go_Live_c : string,
    Group_Name : string,
    Milestone__Region : string,
    Milestone__Country : string,
    Milestone_Title : string,
    Milestone__Assignee__Full_Name : string,
    Milestone_Due_Date : string,
    Milestone_Due_Date_c : string,
    Milestone__Country_Status : string,
    Task_List_Title : string,
    Task__Assignee__Full_Name : string,
    Task_Status : string,
    Task_Overdue : string,
    Task_Start_Date : string,
    Task_Start_Date_c : string,
    Task_Due_Date : string,
    Task_Due_Date_c : string,
    Workspace__Project_Level : string,
    //Milestone__Project_Start_Date : string,
}