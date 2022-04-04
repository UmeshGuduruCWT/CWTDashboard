export interface CHData {
    HID: number;
    Region: string;
    Level: string;
    PLevel : string;
    Leader: string;
    WorkShedule: string;
    Monday: number;
    Tuesday: number;
    Wednesday: number;
    Thursday: number;
    Friday: number;
    WorkingDays: number;
    Manager: string;
    ProjectLevel: string;
    InsertedBy: string;
    InsertedDate: Date;
    TargetedUtilization : number;
}
export interface CapacityHierarchy {
    message: string;
    code: number;
    Data: CHData[];
}