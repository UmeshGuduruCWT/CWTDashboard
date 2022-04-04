export interface Assignees {
    AssigneCycleTime: number;
    AssigneInnovation: number;
    AssigneNPS: number;
    Assigne: string;
    AssigneVolume?: number;
    AssigneVolume_string?: string;
    AssigneProjects: number;
}
export interface Leaders {
    Leader: string;
    LeaderCycleTime: number;
    LeaderInnovation: number;
    LeaderNPS: number;
    Leadericon : boolean;
    LeaderVolume?: number;
    LeaderVolume_string : string;
    LeaderProjects: number;
    Assignees: Assignees[];
}
export interface SeniorLeader {
    SeniorLeader: string;
    Volume: number;
    Volume_string: string;
    Projects: number;
    CycleTime: number;
    Innovation: number;
    NPS: number;
    SeniorIcon : boolean;
    Leaders: Leaders[];
}
export interface PerformanceData {
    message: string;
    code: number;
    Data: SeniorLeader[];
}