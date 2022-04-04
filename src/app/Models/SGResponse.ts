export interface SGData {
    Client: string;
    Task1: number;
    Task2: number;
    Task3: number;
    Task4: number;
    Task5: number;
    Task6: number;
    Task7: number;
    Task8: number;
    Task9: number;
    Task10: number;
    Task11: number;
    Task12: number;
    Task13: number;
    Task14: number;
    Task15: number;
    Task16: number;
    Task17: number;
    Task18: number;
    Task19: number;
    Task20: number;
    GrandTotal: number;

    Task_Title : string,
    Task_Start_Date : Date,
    Task_Start_Date_c : string,
    Task_Due_Date : Date,
    Task_Due_Date_c : string,
    Workspace_Title : string,
    Task__Assignee__Full_Name : string,
    Milestone__Assignee__Full_Name : string,
    Milestone__Assignee__Reports_to__Full_Name : string,
    Task_Status : string,
    Milestone__Assignee__Country : string,
    Milestone__Project_Status : string,
    Month : string,
    Year : string,
}
export interface SGResponse {
    message: string;
    code: number;
    Data: SGData[];
}