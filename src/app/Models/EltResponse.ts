export interface EltData {
    Client : string;
    CurrentMonth? : number;
    CurrentMonth_s : string;
    PriorMonthElt : any;
    PriorMonthElt_s : string;
    Delta? : number;
    Delta_s : string;
    DeltaColor : string;
    Status : string;
    Month1? : number;
    Month1_s : string;
    Month2? : number;
    Month2_s : string;
    Month1_N? : number;
    Month2_N? : number;
    RemainingTBC? : number;
    RemainingMonths : string;
    TotalMonths : string;
    PreviousYear? : number;
    TotalAcountVolume? : number;
    PreviousYear_s : string;
    TotalAcountVolume_s : string;
    EltStatus : string;
    EltStatusColor : string;
    Comments : string;
    RegionComment : string;
    RevenueComment : number;
    APAC : number;
    EMEA : number;
    LATAM : number;
    NORAM : number;
    APAC_volume : string;
    EMEA_volume : string;
    LATAM_volume : string;
    NORAM_volume : string;
    Year : string;
    Month : string;

    ///
    Total : number;
    NBAPriorMonth : number;
    TotalAccountVolume : number;
    InsertedOn : any;
}
export interface EltResponse {
    message : string;
    code : number;
    Data : EltData[];
    YearMonth : YearMonth[];
    TotalAmountMonth1 : number;
    TotalAmountMonth2 : number;
    TotalAmountRemainingMonths : number;
    Workspace : string;
    GrandTotal : number;
    ColumnOne : string;
    ColumnTwo : string;
    ColumnThree : string;
    ColumnYearName : string;
}
export interface YearMonth{
    Month : string;
    Year : string;
    YearMonth : string;
    Workspace : string;
    Comments : string;
    isSelected : boolean;
    Client : string;
    Revenue : number;
    Revenue_volume : string;
    ProjectStatus : string;
    CLRGoLiveMonth : string;
    CLRProjectStatus : string;
    Country : string;
    RevenueID : number;
    ChangesMadeforAccount : string;
}