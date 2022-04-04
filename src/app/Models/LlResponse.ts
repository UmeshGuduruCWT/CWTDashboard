export interface LLData {
    iMeet_Workspace_Title : string;
    Record_ID? : any;
    Date_feedback_raised : Date;
    Date_feedback_raised_c : string;
    Country_Area_of_Responsibility : string,
    Region : string,
    What_was_the_event_issue_concern : string,
    Is_there_any_specific_recognition_to_a_person_group_process_rela : string,
    Go_Live_Date? : Date;
    Go_Live_Date_c : string;
    Reason_Type  : string;
    Created_by_Field : string;
    Leader : string;
    Reason_Code__Added_by_Leader_ : string;
    What_do_you_recommend___to_avoid_this_occurring_again_in_future : string;
    Status__By_Leader_ : string;
    Action_Taken__By_Leader_ : string;
}
export interface LessonsLearntResponse {
    message: string;
    code: number;
    Data: LLData[];
}