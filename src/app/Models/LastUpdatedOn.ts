export interface LastUpdateOn {
    message: string;
    code: number;
    Data: ReportsUpdatedOn[];
}
export interface ReportsUpdatedOn {
    LLData : any;
    SGData: any;
    IMPSData: any;
    CTOData: any;
    AutomatedCLR : any;
    ELT : any;
    NPS : any;
}