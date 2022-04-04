export interface HomeData{
    message : string;
    code : number;
    TotalVolume : number;
    ActiveVolume : number;
    ClosedVolume : number;
    P_NDC_H_Volume : number;
    Projects : number;
    PipelineVolume : number;
    CurrentMonth : number;
    NextMonth : number;
    CurrentMonthVolume: number;
    CurrentMonthRecords: number;
    NextMonthVolume: number;
    NextMonthRecords: number;
    PreMonthVolume: number;
    PreMonthRecords: number;
    RoyMonthVolume: number;
    RoyMonthRecords: number;
    ExpectedCurrentMonthVolume: number;
    ExpectedCurrentMonthRecords: number;
    FutureYearsVolume: number;
    FutureYearsRecords: number;
    HoldVolume: number;
    HoldRecords: number;
    PipelineRecords: number;
    HighPotentialVolume: number;
    HighPotentialRecords: number;
    PotentialVolume: number;
    PotentialRecords: number;
    data? : any;
    Countries : Countries[];
}
export interface Countries{
    Country : string;
    isSelected : boolean;
}