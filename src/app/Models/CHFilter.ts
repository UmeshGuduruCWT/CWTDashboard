export interface Region {
    Region: string;
    isSelected: boolean;
}
export interface Level {
    Level: string;
    isSelected: boolean;
}
export interface Leader {
    Leader: string;
    isSelected: boolean;
}
export interface WorkShedule {
    WorkShedule: string;
    isSelected: boolean;
}
export interface WorkingDay {
    WorkingDays: number;
    isSelected: boolean;
}
export interface CHFilter {
    message: string;
    code: number;
    Region: Region[];
    Level: Level[];
    Leader: Leader[];
    WorkShedule: WorkShedule[];
    WorkingDays: WorkingDay[];
}