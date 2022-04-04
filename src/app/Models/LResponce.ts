export interface LResponce {
    message: string;
    code: number;
    Data: L_Data[];
    VolumeCountCycleTime : L_VolumeCountCycleTime[];
}
export interface L_VolumeCountCycleTime{
    Go_Live_Month: string,
    Revenue_Total_Volume_USD?: number,
    Revenue_Total_Volume : string,
    ProjectsCount: number,
    Average: number,
    AvgCycleTime : string,
}
export interface L_Data {
    iMeet_Milestone___Project_Status: string;
    isSelected : boolean;
    Client: string;
    iMeet_Project_Level: string;
    Revenue_Total_Volume_USD?: number;
    Region__Opportunity_: string;
    Implementation_Type: string;
    Revenue_Total_Volume : string;
    GJanuary: number;
    LJanuary: number;
    RJanuary: number;
    GFebruary: number;
    LFebruary: number;
    RFebruary: number;
    GMarch: number;
    LMarch: number;
    RMarch: number;
    GApril: number;
    LApril: number;
    RApril: number;
    GMay: number;
    LMay: number;
    RMay: number;
    GJune: number;
    LJune: number;
    RJune: number;
    GJuly: number;
    LJuly: number;
    RJuly: number;
    GAugust: number;
    LAugust: number;
    RAugust: number;
    GSeptember: number;
    LSeptember: number;
    RSeptember: number;
    GOctober: number;
    LOctober: number;
    ROctober: number;
    GNovember: number;
    LNovember: number;
    RNovember: number;
    GDecember: number;
    LDecember: number;
    RDecember: number;
    APAC: number;
    EMEA: number;
    LATAM: number;
    NORAM: number;
    Blanks: number;
    CWJanuary: number;
    LWJanuary: number;
    CWFebruary: number;
    LWFebruary: number;
    CWMarch: number;
    LWMarch: number;
    CWApril: number;
    LWApril: number;
    CWMay: number;
    LWMay: number;
    CWJune: number;
    LWJune: number;
    CWJuly: number;
    LWJuly: number;
    CWAugust: number;
    LWAugust: number;
    CWSeptember: number;
    LWSeptember: number;
    CWOctober: number;
    LWOctober: number;
    CWNovember: number;
    LWNovember: number;
    CWDecember: number;
    LWDecember: number;
    JanComments: string;
    FebComments: string;
    MarComments: string;
    AprComments: string;
    MayComments: string;
    JunComments: string;
    JulComments: string;
    AugComments: string;
    SepComments: string;
    OctComments: string;
    NovComments: string;
    DecComments: string;
    DeltaID: number;
    January : number,
    February : number,
    March : number,
    April : number,
    May : number,
    June : number,
    July : number,
    August : number,
    September : number,
    October : number,
    November : number,
    December : number,
    Go_Live_Month: string;
    ProjectsCount: number;
    Average: number;
    AvgCycleTime : string;
    RevenueVolume : number;

    January_RV: number,
    February_RV: number,
    March_RV: number,
    April_RV: number,
    May_RV: number,
    June_RV: number,
    July_RV: number,
    August_RV: number,
    September_RV: number,
    October_RV: number,
    November_RV: number,
    December_RV: number,
    January_PC: number,
    February_PC: number,
    March_PC: number,
    April_PC: number,
    May_PC: number,
    June_PC: number,
    July_PC: number,
    August_PC: number,
    September_PC: number,
    October_PC: number,
    November_PC: number,
    December_PC: number,
    January_A: number,
    February_A: number,
    March_A: number,
    April_A: number,
    May_A: number,
    June_A: number,
    July_A: number,
    August_A: number,
    September_A: number,
    October_A: number,
    November_A: number,
    December_A: number,
}