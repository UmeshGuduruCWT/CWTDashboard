export interface eSOWData {
    Category: string;
    SSATotal: number;
    SSAWon: number;
    SSALost: number;
    SSAInPRogress: number;
    DSDLATotal: number;
    DSDLAWon: number;
    DSDLALost: number;
    DSDLAInPRogress: number;
    SSVTotal: number;
    SSVWon: number;
    SSVLost: number;
    SSVInPRogress: number;
    DSDLVTotal: number;
    DSDLVWon: number;
    DSDLVLost: number;
    DSDLVInPRogress: number;

    DSDLAVerbal: number;
    SSAVerbal: number;
    DSDLVVerbal: number;
    SSVVerbal: number;
    DSDLAccounts: number;
    DSDLSpend: number;
    DSDLAvgDaysSinceStart: string;
    SSAccounts: number;
    SSSpend: number;
    SSAvgDaysSinceStart: string;

    Dsd_Lead: string;
    WonAccounts: number;
    LostAccounts: number;
    TotalAccounts: number;
    WonVolumes: number;
    WVolumes: string;
    LostVolumes: number;
    LVolumes: string;
    TotalVolumes: number;
    TVolumes: string;
    WinPerAccounts : string;
    WinPerVolume : string;

    DDTotal: number;
    DDWon: number;
    DDLost: number;
    DDInPRogress: number;
    DDNBTotal: number;
    DDNBWon: number;
    DDNBLost: number;
    DDNBInPRogress: number;
}
export interface eSOWResponse {
    message: string;
    code: number;
    Data: eSOWData[];
}