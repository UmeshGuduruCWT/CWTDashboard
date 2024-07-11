export interface Response {
    message: string;
    code: number;
    ErrorsAllocatedData: ErrorsAllocatedData[];
    GPNContactData : GPNContactData[];
}
export class ErrorsAllocatedData {
    ErrorAllocatedID : any;
    Con : string;
    Owner : string;
    NewOwner : string;
    AverageCount : number;
    Type : string;
    Comments : string;
    InsertedBy : string;
    InsertedOn : Date;
    Inserted_On : string;
    Updated_On : string;
    UpdatedOn : Date;
    UpdatedBy : string;
}
export class GPNContactData {
    GPNId : any;
    Region : any;
    Type : any;
    Country : any;
    Groups : any;
    Glory_DL_DLCBR : any;
    DataSubmitFrequency : any;
    SendErrorReportFrequency : any;
    MainContactGroupEmailAddress : any;
    GroupName : any;
    InsertedBy : string;
    InsertedOn : Date;
    Inserted_On : string;
    Updated_On : string;
    UpdatedOn : Date;
    UpdatedBy : string;
}