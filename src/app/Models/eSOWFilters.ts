export interface ProspectType {
    Prospect_Type: string;
    isSelected: boolean;
}

export interface SalesLeaderTypeAndTypeOfBid {
    Sales_Leader_type_and_Type_of_bid: string;
    isSelected: boolean;
}

export interface eSOWFilters {
    message: string;
    code: number;
    ProspectType: ProspectType[];
    SalesLeaderTypeAndTypeOfBid: SalesLeaderTypeAndTypeOfBid[];
}