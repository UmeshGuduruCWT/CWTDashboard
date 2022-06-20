import { Component, OnInit, ViewChild, ViewEncapsulation, Inject, Optional, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { DashboardServiceService } from '../../dashboard-service.service';
import { ExcelService } from '../../excel.service';
import { CLRData, DataCLR } from 'src/app/Models/AutomatedCLRResponse';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { map, startWith, takeUntil } from 'rxjs/operators';
// import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableFilter } from "mat-table-filter";
import { RevenueId_H, DropDownList } from 'src/app/Models/HierarchyFilter';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { LivedashboardComponent } from '../livedashboard/livedashboard.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Subscription, Observable, ReplaySubject, Subject } from 'rxjs';
import { timer } from 'rxjs';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FilterDigitalTeam, FilterGlobalProjectManager, FilterOpportunityType, FilterProjectLevel, FilterRegionWiseCountry } from 'src/app/Models/AutomatedCLRFilters';
import { Data } from 'src/app/Models/Responce';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
// @Injectable()
export interface CLRDialogData {
  Dailog_Client : string;
  Dailog_RevenueID : string;
  Dailog_Comment : string;
}
export interface DigitalTeamData {
  DTID : string;
  CLRID : string;
  RevenueID : string; 
  GlobalCISOBTLead : string;
  RegionalCISOBTLead : string;
  LocalDigitalOBTLead : string;
  GlobalCISPortraitLead : string;
  RegionalCISPortraitLead : string;
  GlobalCISHRFeedSpecialist : string;
  ProjectStatus : string;
  GDS : string;
  ActivityType : string;
  ComplexityScore : string;
  DigitalTeam : FilterDigitalTeam[];
}
export interface ParsingData {
  ButtonType : string;
  ManualID : number,
  Client : string,
  CLRID : string,
  //iMeet_Workspace_Title : string,
  //Date_added_to_the_CLR : Date,
  Implementation_Type : string,
  //CLR_Country : string,
  Pipeline_status : string,
  Pipeline_comments : string,
  // Service_configuration : string,
  // OBT_Reseller___Direct : string;
  Assignment_date : Date,
  RevenueID : number,
  Project_Effort : number,
  GoLiveDate :Date,
  ProjectStatus : string,
  ProjectLevel : string,
  GlobalProjectManager : string,
  RegionalProjectManager : string,
  AssigneeFullName : string,
  RecordStatus : string,
  SelectionType : string,
  DigitalTeam : FilterDigitalTeam[],
}
export class MyFilter {
  Client: string;
  RevenueID: string;
  iMeet_Workspace_Title: string;
  CreatedDate_c: string;
  Implementation_Type : string[];
  Pipeline_status : string[];
  Pipeline_comments : string;
  Service_configuration : string;
  Service_location : string;
  GlobalCISDQSLead : string;
  OBT_Reseller___Direct : string[];
  Assignment_date_c : string;
  UpdateOn_c : string;
  OppVolume : string;
  RevenueVolumeUSD : string;
  Region : string[];
  Country : string;
  OwnerShip : string[];
  GoLiveDate_c? : Date;
  GoLiveDate_cE? : Date;
  ProjectStart_ForCycleTime_c : string;
  CycleTime : string;
  ProjectStatus : string[];
  Milestone__Reason_Code : string;
  PerCompleted : string;
  CountryStatus : string[];
  ProjectLevel : string[];
  CompletedDate_c : string;
  GlobalProjectManager : string;
  RegionalProjectManager : string;
  AssigneeFullName : string;
  GlobalCISOBTLead : string;
  RegionalCISOBTLead : string;
  LocalDigitalOBTLead : string;
  LocalDigitalAdHocSupport : string;
  GlobalCISPortraitLead : string;
  RegionalCISPortraitLead : string;
  ActivityType : string[];
  GDS : string[];
  GlobalCISHRFeedSpecialist : string;
  MilestoneTitle : string;
  Group_Name : string[];
  Milestone__Project_Notes : string;
  Milestone__Closed_Loop_Owner : string;
  Workspace__ELT_Overall_Status : string[];
  Workspace__ELT_Overall_Comments : string;
  Customer_Row_ID : string;
  Opportunity_ID : string;
  AccountOwner : string;
  Sales_Stage_Name : string[];
  Opportunity_Type : string[];
  Revenue_Status : string[];
  Revenue_Opportunity_Type : string[];
  Opportunity_Owner : string;
  Opportunity_Category : string[];
  Revenue_Total_Transactions : string;
  Line_Win_Probability : string[];
  Implementation_Fee__PSD_ : string;
  DataDescription : string;
  Project_Effort : string;
  ComplexityScore : string;
  RecordStatus : string[];
  DataSourceType : string[];
  Date_added_to_the_CLR_c : string;
  CheckComments : string;
  AccountCategory : string;
  SOWStatus : string;
  ImplementationReady : string;
}
export class AdhocData {
  Action : string;
  AHID : string;
  RevenueID : string;
  Client : string;
  StartDate : Date;
  GoLiveDate : Date;
  Country : string;
  Region : string;
  Comments : string;
  ProjectStatus : string
  GlobalCISOBTLead : string;
  RegionalCISOBTLead : string;
  LocalDigitalOBTLead : string;
  GlobalCISPortraitLead : string;
  RegionalCISPortraitLead : string;
  GlobalCISHRFeedSpecialist : string;
  GDS : string;
  ComplexityScore : string;
  ActivityType : string;
  Status : string;
}
@Component({
  selector: 'app-automated-clr',
  templateUrl: './automated-clr.component.html',
  styleUrls: ['./automated-clr.component.css']
})
export class AutomatedCLRComponent implements OnInit {
  AdhocData : any;
  isLoading = true;
  constructor(private router : Router,private route : ActivatedRoute,private cdr: ChangeDetectorRef,private service : DashboardServiceService,public dialog: MatDialog,public datepipe : DatePipe,private dashboard : LivedashboardComponent,private excelService:ExcelService) {
    // set screenWidth on page load
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    window.onresize = () => {
      // set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    };
  }
  imageUrl : string = "assets/images/cwt.png";
  CLRData : CLRData[];
  DataCLR : DataCLR[];
  dataSource;
  Dailog_Comment : string;
  Dailog_RevenueID : string;
  Dailog_Client : string;
  screenWidth : number;
  screenHeight  : number;
  Region_F;SelectedRegion;
  //OwnerShip_F;ProjectStatus_F;ProjectLevel_F;Opportunity_Type_F;Revenue_Status_F;Revenue_Opportunity_Type_F;Opportunity_Category_F;RecordStatus_F;DataSourceType_F;
  displayedColumns : string[] = ['Client','RevenueID','Country','iMeet_Workspace_Title','Implementation_Type','Pipeline_status','Pipeline_comments','Service_location','Service_configuration','OBT_Reseller___Direct','Assignment_date_c','UpdateOn_c','OppVolume','RevenueVolumeUSD','Region','OwnerShip','ProjectStart_ForCycleTime_c','GoLiveDate_c','CycleTime','ProjectStatus','Milestone__Reason_Code','PerCompleted','CountryStatus','ProjectLevel','CompletedDate_c','GlobalProjectManager','RegionalProjectManager','AssigneeFullName','GlobalCISDQSLead','GlobalCISOBTLead','RegionalCISOBTLead','LocalDigitalOBTLead','GlobalCISPortraitLead','RegionalCISPortraitLead','LocalDigitalAdHocSupport','GlobalCISHRFeedSpecialist','GDS','ActivityType','ComplexityScore','MilestoneTitle','Group_Name','Milestone__Project_Notes','Milestone__Closed_Loop_Owner','Workspace__ELT_Overall_Status','Workspace__ELT_Overall_Comments','Customer_Row_ID','Opportunity_ID','AccountOwner','Opportunity_Type','Revenue_Status','Revenue_Opportunity_Type','Opportunity_Owner','Opportunity_Category','Revenue_Total_Transactions','Line_Win_Probability','Implementation_Fee__PSD_','DataDescription','Date_added_to_the_CLR_c','CreatedDate_c','Project_Effort','Sales_Stage_Name','AccountCategory','SOWStatus','ImplementationReady','RecordStatus','DataSourceType','CheckComments','actions'];
  displayedColumns_h : string[] = ['Client_h','RevenueID_h','Country_h','iMeet_Workspace_Title_h','Implementation_Type_h','Pipeline_status_h','Pipeline_comments_h','Service_location_h','Service_configuration_h','OBT_Reseller___Direct_h','Assignment_date_c_h','UpdateOn_c_h','OppVolume_c_h','RevenueVolumeUSD_c_h','Region_h','OwnerShip_h','ProjectStartDate_c_h','GoLiveDate_c_h','CycleTime_h','ProjectStatus_h','Milestone__Reason_Code_h','PerCompleted_h','CountryStatus_h','ProjectLevel_h','CompletedDate_c_h','GlobalProjectManager_h','RegionalProjectManager_h','AssigneeFullName_h','GlobalCISDQSLead_h','GlobalCISOBTLead_h','RegionalCISOBTLead_h','LocalDigitalOBTLead_h','GlobalCISPortraitLead_h','RegionalCISPortraitLead_h','LocalDigitalAdHocSupport_h','GlobalCISHRFeedSpecialist_h','GDS_h','ActivityType_h','ComplexityScore_h','MilestoneTitle_h','Group_Name_h','Milestone__Project_Notes_h','Milestone__Closed_Loop_Owner_h','Workspace__ELT_Overall_Status_h','Workspace__ELT_Overall_Comments_h','Customer_Row_ID_h','Opportunity_ID_h','AccountOwner_h','Opportunity_Type_h','Revenue_Status_h','Revenue_Opportunity_Type_h','Opportunity_Owner_h','Opportunity_Category_h','Revenue_Total_Transactions_h','Line_Win_Probability_h','Implementation_Fee__PSD_c_h','DataDescription_h','Date_added_to_the_CLR_c_h','CreatedDate_c_h','Project_Effort_h','Sales_Stage_Name_h','AccountCategory_h','SOWStatus_h','ImplementationReady_h','RecordStatus_h','DataSourceType_h','CheckComments_h','actions_h'];
  // displayedColumns : string[] = ['Client','RevenueID','iMeet_Workspace_Title','CreatedDate_c','Implementation_Type','actions'];
  // displayedColumns_h : string[] = ['Client_h','RevenueID_h','iMeet_Workspace_Title_h','CreatedDate_c_h','Implementation_Type_h','actions_h']

  columnsToDisplay: string[] = this.displayedColumns.slice();
  columnsToDisplay_h: string[] = this.displayedColumns_h.slice();
  displayReplicateButton : string;
  //displayedColumns : string[] = ['RevenueID','Client','iMeet_Workspace_Title','Date_added_to_the_CLR_c','Implementation_Type','CLR_Country','Pipeline_status','Pipeline_comments','Service_location','Service_configuration','OBT_Reseller___Direct','Servicing_location','Assignment_date_c','New_Business_volume__US___c','RevenueVolumeUSD_c','Region','Country','OwnerShip','GoLiveDate_c','ProjectStatus','Milestone__Reason_Code','CountryStatus','ProjectLevel','CompletedDate_c','ProjectOwner','GlobalProjectManager','ProjectConsultant','RegionalProjectManager','AssigneeFullName','GlobalCISDQSLead','GlobalCISOBTLead','GlobalCISPortraitLead','GlobalCISHRFeedSpecialist','MilestoneTitle','Milestone__Record_ID_Key','Group_Name','Milestone__Project_Notes','Milestone__Closed_Loop_Owner','Workspace__ELT_Overall_Status','Workspace__ELT_Overall_Comments','Customer_Row_ID','Opportunity_ID','Account_Name','Sales_Stage_Name','Opportunity_Type','Revenue_Status','Revenue_Opportunity_Type','Opportunity_Owner','Opportunity_Category','MarketLeader','Revenue_Total_Transactions','Implementation_Fee__PSD_c','EMEA_Country_to_charge','EMEA_Client','EMEA_OBT_standard_fee_c','EMEA_Included_for_accrual','EMEA_Accrual_date_c','EMEA_Scope_description','EMEA_Billing_notes','Manual_Entry__Wave_2__Wave_3__etc_','Project_Effort','Priority','Resource_Status','Global_Project_Manager_replacement','Regional_Project_Manager_replacement','Milestone__Assignee__Full_Name_replacement','Global_CIS_OBT_Lead_replacement','Global_CIS_HR_Feed_Specialist_replacement','Global_CIS_Portrait_Lead_replacement','Global_CIS_RoomIT_Integration_Lead_replacement','actions'];
  // filterEntity: DataCLR;
  SavedFilters
  // filterType: MatTableFilter;
  SelectionType : string;
  LoginUID : string;
  FilteredVolume;
  FilteredCount;

  masterImplementationType : boolean;masterPipelineStatus : boolean;masterOBTType : boolean;
  masterGDS : boolean;masterActivityType : boolean;masterRegion : boolean;masterOwnership : boolean;masterCountryStatus : boolean;
  masterProjectStatus : boolean;masterProjectLevel : boolean;masterGroupName : boolean;masterWorkspaceEltOverallStatus : boolean;
  masterSalesStageName : boolean;masterOpportunityType : boolean;masterRevenueStatus : boolean;masterRevenueOpportunityType : boolean;
  masterOpportunityCategory : boolean;masterLineWin : boolean;masterRecordStatus : boolean;masterDatasourceType : boolean;
  filteredValues : MyFilter = { Client: '', RevenueID: '', iMeet_Workspace_Title: '', CreatedDate_c: '',
    Implementation_Type : [],Pipeline_status : [],Pipeline_comments : '',Service_configuration : '',Service_location : '',
    GlobalCISDQSLead : '',OBT_Reseller___Direct : [],Assignment_date_c : '',UpdateOn_c : '',OppVolume : '',
    RevenueVolumeUSD : '',Region : [],Country : '', OwnerShip : [], GoLiveDate_c : null,GoLiveDate_cE : null,
    ProjectStart_ForCycleTime_c : '',CycleTime : '',
    ProjectStatus : [],Milestone__Reason_Code : '', PerCompleted : '',CountryStatus : [],
    ProjectLevel : [],CompletedDate_c : '',GlobalProjectManager : '',
    RegionalProjectManager : '',AssigneeFullName : '',GlobalCISOBTLead : '',
    RegionalCISOBTLead : '',LocalDigitalOBTLead : '',LocalDigitalAdHocSupport : '',GlobalCISPortraitLead : '',
    RegionalCISPortraitLead : '',ActivityType : [],GDS : [],
    GlobalCISHRFeedSpecialist : '',MilestoneTitle : '',
    Group_Name : [],Milestone__Project_Notes : '',Milestone__Closed_Loop_Owner : '',Workspace__ELT_Overall_Status : [],
    Workspace__ELT_Overall_Comments : '',Customer_Row_ID : '',
    Opportunity_ID : '',AccountOwner : '',Sales_Stage_Name : [],Opportunity_Type : [],
    Revenue_Status : [],Revenue_Opportunity_Type : [],Opportunity_Owner : '',Opportunity_Category : [],
    Revenue_Total_Transactions : '',Line_Win_Probability : [],Implementation_Fee__PSD_ : '',DataDescription : '',
    Project_Effort : '',ComplexityScore : '',RecordStatus : [],DataSourceType : [],
    Date_added_to_the_CLR_c : '',CheckComments : '',AccountCategory : '',SOWStatus : '',
    ImplementationReady : '',
  };

  Implementation_TypeList: any = [];
  // ProjectLevelList: string[] = ["Local", "Global","Regional","---"];
  Pipeline_statusList : any = [];
  RegionList : any = [];
  ActivityTypeList : any = [];
  GDSList : any = [];
  OwnerShipList : any = [];
  ProjectStatusList : any = [];
  CountryStatusList : any = [];
  ProjectLevelList : any = [];
  OBTResellerList : any = [];
  Group_NameList : any = [];
  Workspace__ELT_Overall_StatusList : any = [];
  Sales_Stage_NameList : any = [];
  Opportunity_TypeList : any = [];
  Revenue_StatusList : any = [];
  Revenue_Opportunity_TypeList : any = [];
  Opportunity_CategoryList : any = [];
  Line_Win_ProbabilityList : any = [];
  RecordStatusList: any = [];
  DataSourceTypeList: any = [];
  DigitalTeamList: FilterDigitalTeam[];
  ClientFilter = new FormControl();
  RevenueIDFilter = new FormControl();
  iMeet_Workspace_TitleFilter = new FormControl();
  CreatedDate_cFilter = new FormControl();
  Implementation_TypeFilter = new FormControl();
  Pipeline_statusFilter = new FormControl();
  Pipeline_commentsFilter = new FormControl();
  Service_configurationFilter = new FormControl();
  Service_locationFilter = new FormControl();
  GlobalCISDQSLeadFilter = new FormControl();
  OBT_Reseller___DirectFilter = new FormControl();
  Assignment_date_cFilter = new FormControl();
  OppVolume_cFilter = new FormControl();
  UpdateOn_cFilter = new FormControl();
  RevenueVolumeUSDFilter = new FormControl();
  RegionFilter = new FormControl();
  CountryFilter = new FormControl();
  OwnerShipFilter = new FormControl();
  // GoLiveDate_cFilter = new FormControl();
  GoLiveDate_cSFilter = new FormControl();
  GoLiveDate_cEFilter = new FormControl();
  ProjectStartDate_cFilter = new FormControl();
  CycleTimeFilter = new FormControl();
  ProjectStatusFilter = new FormControl();
  Milestone__Reason_CodeFilter = new FormControl();
  PerCompletedFilter = new FormControl();
  CountryStatusFilter = new FormControl();
  ProjectLevelFilter = new FormControl();
  CompletedDate_cFilter = new FormControl();
  GlobalProjectManagerFilter = new FormControl();
  RegionalProjectManagerFilter = new FormControl();
  AssigneeFullNameFilter = new FormControl();
  GlobalCISOBTLeadFilter = new FormControl();
  RegionalCISOBTLeadFilter = new FormControl();
  LocalDigitalOBTLeadFilter = new FormControl();
  LocalDigitalAdHocSupportFilter = new FormControl();
  GlobalCISPortraitLeadFilter = new FormControl();
  RegionalCISPortraitLeadFilter = new FormControl();
  ActivityTypeFilter = new FormControl();
  GDSFilter = new FormControl();
  GlobalCISHRFeedSpecialistFilter = new FormControl();
  MilestoneTitleFilter = new FormControl();
  Group_NameFilter = new FormControl();
  Milestone__Project_NotesFilter = new FormControl();
  Milestone__Closed_Loop_OwnerFilter = new FormControl();
  Workspace__ELT_Overall_StatusFilter = new FormControl();
  Workspace__ELT_Overall_CommentsFilter = new FormControl();
  Customer_Row_IDFilter = new FormControl();
  Opportunity_IDFilter = new FormControl();
  AccountOwnerFilter = new FormControl();
  Sales_Stage_NameFilter = new FormControl();
  Opportunity_TypeFilter = new FormControl();
  Revenue_StatusFilter = new FormControl();
  Revenue_Opportunity_TypeFilter = new FormControl();
  Opportunity_OwnerFilter = new FormControl();
  Opportunity_CategoryFilter = new FormControl();
  Revenue_Total_TransactionsFilter = new FormControl();
  Line_Win_ProbabilityFilter = new FormControl();
  Implementation_Fee__PSD_Filter = new FormControl();
  DataDescriptionFilter = new FormControl();
  Project_EffortFilter = new FormControl();
  AccountCategoryFilter = new FormControl();
  SOWStatusFilter = new FormControl();
  ImplementationReadyFilter = new FormControl();
  ComplexityScoreFilter = new FormControl();
  RecordStatusFilter = new FormControl();
  DataSourceTypeFilter = new FormControl();
  Date_added_to_the_CLR_cFilter = new FormControl();
  CheckCommentsFilter = new FormControl();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngAfterViewInit() {
    // this.dataSource.filterPredicate = this.customFilterPredicate();
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }
  // ShowCLREditOption : boolean = false;
  NgIfAdhocDisplay : boolean = false;
  NgIfAutomatedCLR : boolean = true;
  AddAdhoc(){
    this.NgIfAdhocDisplay = true;
    this.NgIfAutomatedCLR = false;
    let data : AdhocData = {
      Action : 'Save',
      AHID : '',
      RevenueID : null,
      Client : null,
      StartDate : null,
      GoLiveDate : null,
      Country : null,
      Region : null,
      Comments : null,
      ProjectStatus : null,
      GlobalCISOBTLead : null,
      RegionalCISOBTLead : null,
      LocalDigitalOBTLead : null,
      GlobalCISPortraitLead : null,
      RegionalCISPortraitLead : null,
      GlobalCISHRFeedSpecialist : null,
      GDS : null,
      ComplexityScore : null,
      ActivityType : null,
      Status : null,
    }
    this.AdhocData = data;
  }
  AuditLog(){
    const dialogRef = this.dialog.open(AuditLogdailog, {
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  RecievedOutput(value :any){
    if(value[0].SelectionType == "Cancel"){
    }else if(value[0].SelectionType == "Updated"){
      for(let i = 0;i<this.dataSource.data.length;i++){
        if(this.dataSource.data[i].Revenue_ID == value[0].RevenueID){
          if(value[0].Client == null || value[0].Client == undefined){
          }else{
            this.dataSource.data[i].Client = value[0].Client;
          }
          if(value[0].StartDate == null || value[0].StartDate == undefined){
          }else{
            this.dataSource.data[i].ProjectStart_ForCycleTime_c = this.datepipe.transform(value[0].StartDate, "yyyy-MM-dd");
          }
          if(value[0].GoLiveDate == null || value[0].GoLiveDate == undefined){
          }else{
            this.dataSource.data[i].GoLiveDate_c = this.datepipe.transform(value[0].GoLiveDate, "yyyy-MM-dd");
          }
          if(value[0].Country == null || value[0].Country == undefined){
          }else{
            this.dataSource.data[i].Country = value[0].Country;
          }
          if(value[0].Region == null || value[0].Region == undefined){
          }else{
            this.dataSource.data[i].Region = value[0].Region;
          }
          if(value[0].Comments == null || value[0].Comments == undefined){
          }else{
            this.dataSource.data[i].Workspace__ELT_Overall_Comments = value[0].Comments;
          }
          if(value[0].ProjectStatus == null || value[0].ProjectStatus == undefined){
          }else{
            this.dataSource.data[i].ProjectStatus = value[0].ProjectStatus;
          }
          if(value[0].GlobalCISOBTLead == null || value[0].GlobalCISOBTLead == undefined){
          }else{
            this.dataSource.data[i].GlobalCISOBTLead = value[0].GlobalCISOBTLead;
          }
          if(value[0].RegionalCISOBTLead == null || value[0].RegionalCISOBTLead == undefined){
          }else{
            this.dataSource.data[i].RegionalCISOBTLead = value[0].RegionalCISOBTLead;
          }
          if(value[0].LocalDigitalOBTLead == null || value[0].LocalDigitalOBTLead == undefined){
          }else{
            this.dataSource.data[i].LocalDigitalOBTLead = value[0].LocalDigitalOBTLead;
          }
          if(value[0].GlobalCISPortraitLead == null || value[0].GlobalCISPortraitLead == undefined){
          }else{
            this.dataSource.data[i].GlobalCISPortraitLead = value[0].GlobalCISPortraitLead;
          }
          if(value[0].RegionalCISPortraitLead == null || value[0].RegionalCISPortraitLead == undefined){
          }else{
            this.dataSource.data[i].RegionalCISPortraitLead = value[0].RegionalCISPortraitLead;
          }
          if(value[0].GlobalCISHRFeedSpecialist == null || value[0].GlobalCISHRFeedSpecialist == undefined){
          }else{
            this.dataSource.data[i].GlobalCISHRFeedSpecialist = value[0].GlobalCISHRFeedSpecialist;
          }
          if(value[0].ActivityType == null || value[0].ActivityType == undefined){
          }else{
            this.dataSource.data[i].ActivityType = value[0].ActivityType;
          }
          if(value[0].GDS == null || value[0].GDS == undefined){
          }else{
            this.dataSource.data[i].GDS = value[0].GDS;
          }
          if(value[0].ComplexityScore == null || value[0].ComplexityScore == undefined){
          }else{
            this.dataSource.data[i].ComplexityScore = value[0].ComplexityScore;
          }
          if(value[0].Record_Status == null || value[0].Record_Status == undefined){
          }else{
            this.dataSource.data[i].RecordStatus = value[0].Record_Status;
          }
        }
      }
      this.GenerateTracker();
    }else{
      this.GetAutomatedCLRFilters();
      this.GetData();
      this.GenerateTracker();
    }
    this.NgIfAdhocDisplay = false;
    this.NgIfAutomatedCLR = true;
  }
  date = new Date();
  ngOnInit(): void {
    this.dashboard.ShowSpinnerHandler(true);
    this.service.UserReportAccess(localStorage.getItem("UID")).subscribe(data=>{
      if(data.code == 200){
        if(data.Data[0].CLREdits == true){
          this.displayReplicateButton = "true";
        }else{
          this.columnsToDisplay.pop();
          this.columnsToDisplay_h.pop();
          this.displayReplicateButton = "false";
        }
      }
      this.dashboard.ShowSpinnerHandler(false);
    })
    this.GetAutomatedCLRFilters();
    this.GetData();
  }
  GetAutomatedCLRFilters(){
    this.service.AutomatedCLRFilters().subscribe(data =>{
      this.Implementation_TypeList = [];
      data.FilterImplementationType.forEach(item =>{
        this.Implementation_TypeList.push(item.ImplementationType);
      })
      this.Pipeline_statusList = [];
      data.FilterPipeline_status.forEach(item =>{
        this.Pipeline_statusList.push(item.Pipeline_status);
      })
      this.RegionList = [];
      data.FilterRegion.forEach(item =>{
        this.RegionList.push(item.Region);
      })
      this.ActivityTypeList = [];
      data.FilterActivityType.forEach(item =>{
        this.ActivityTypeList.push(item.ActivityType);
      })
      this.GDSList = [];
      data.FilterGDS.forEach(item =>{
        this.GDSList.push(item.GDS);
      })
      this.OwnerShipList = [];
      data.FilterOwnerShip.forEach(item =>{
        this.OwnerShipList.push(item.OwnerShip);
      })
      this.ProjectStatusList = [];
      data.FilterProjectStatus.forEach(item =>{
        this.ProjectStatusList.push(item.ProjectStatus);
      })
      this.CountryStatusList = [];
      data.FilterCountryStatus.forEach(item =>{
        this.CountryStatusList.push(item.CountryStatus);
      })
      this.ProjectLevelList = [];
      data.FilterProjectLevel.forEach(item =>{
        this.ProjectLevelList.push(item.ProjectLevel);
      })
      this.Group_NameList = [];
      data.FilterGroup_Name.forEach(item =>{
        this.Group_NameList.push(item.Group_Name);
      })
      this.Workspace__ELT_Overall_StatusList = [];
      data.FilterWorkspace__ELT_Overall_Status.forEach(item =>{
        this.Workspace__ELT_Overall_StatusList.push(item.Workspace__ELT_Overall_Status);
      })
      this.Sales_Stage_NameList = [];
      data.FilterSales_Stage_Name.forEach(item =>{
        this.Sales_Stage_NameList.push(item.Sales_Stage_Name);
      })
      this.OBTResellerList = [];
      data.FilterOBTReseller.forEach(item =>{
        this.OBTResellerList.push(item.OBTReseller);
      })
      this.Opportunity_TypeList = [];
      data.FilterOpportunity_Type.forEach(item =>{
        this.Opportunity_TypeList.push(item.Opportunity_Type);
      })
      this.Revenue_StatusList = [];
      data.FilterRevenue_Status.forEach(item =>{
        this.Revenue_StatusList.push(item.Revenue_Status);
      })
      this.Revenue_Opportunity_TypeList = [];
      data.FilterRevenue_Opportunity_Type.forEach(item =>{
        this.Revenue_Opportunity_TypeList.push(item.Revenue_Opportunity_Type);
      })
      this.Opportunity_CategoryList = [];
      data.FilterOpportunity_Category.forEach(item =>{
        this.Opportunity_CategoryList.push(item.Opportunity_Category);
      })
      this.Line_Win_ProbabilityList = [];
      data.FilterLine_Win_Probability.forEach(item =>{
        this.Line_Win_ProbabilityList.push(item.Line_Win_Probability);
      })
      this.RecordStatusList = [];
      data.FilterStatus.forEach(item =>{
        this.RecordStatusList.push(item.Status);
      })
      this.DataSourceTypeList = [];
      data.FilterDataSourceType.forEach(item =>{
        this.DataSourceTypeList.push(item.DataSourceType);
      })
      this.DigitalTeamList = [];
      this.DigitalTeamList = data.FilterDigitalTeam;
      this.DigitalTeamList.push({ Manager : "---",isSelected : true});
      this.DigitalTeamList.push({ Manager : "Not Required",isSelected : true});
      // data.FilterDigitalTeam.forEach(item =>{
      //   this.DigitalTeamList.push(item.Manager);
      // })
    })
  }
  HideColumnsButtonName : string = "D";
  HideColumns(){
    if(this.displayReplicateButton == "true"){
      if(this.HideColumnsButtonName == "P"){
        this.columnsToDisplay = ['Client','RevenueID','Country','iMeet_Workspace_Title','Implementation_Type','Pipeline_status','Pipeline_comments','Service_location','Service_configuration','OBT_Reseller___Direct','Assignment_date_c','UpdateOn_c','OppVolume','RevenueVolumeUSD','Region','OwnerShip','ProjectStart_ForCycleTime_c','GoLiveDate_c','CycleTime','ProjectStatus','Milestone__Reason_Code','PerCompleted','CountryStatus','ProjectLevel','CompletedDate_c','GlobalProjectManager','RegionalProjectManager','AssigneeFullName','GlobalCISDQSLead','GlobalCISOBTLead','RegionalCISOBTLead','LocalDigitalOBTLead','GlobalCISPortraitLead','RegionalCISPortraitLead','LocalDigitalOBTLead','GlobalCISHRFeedSpecialist','GDS','ActivityType','ComplexityScore','MilestoneTitle','Group_Name','Milestone__Project_Notes','Milestone__Closed_Loop_Owner','Workspace__ELT_Overall_Status','Workspace__ELT_Overall_Comments','Customer_Row_ID','Opportunity_ID','AccountOwner','Opportunity_Type','Revenue_Status','Revenue_Opportunity_Type','Opportunity_Owner','Opportunity_Category','Revenue_Total_Transactions','Line_Win_Probability','Implementation_Fee__PSD_','DataDescription','Date_added_to_the_CLR_c','CreatedDate_c','Project_Effort','Sales_Stage_Name','AccountCategory','SOWStatus','ImplementationReady','RecordStatus','DataSourceType','CheckComments','actions'];
        this.columnsToDisplay_h = ['Client_h','RevenueID_h','Country_h','iMeet_Workspace_Title_h','Implementation_Type_h','Pipeline_status_h','Pipeline_comments_h','Service_location_h','Service_configuration_h','OBT_Reseller___Direct_h','Assignment_date_c_h','UpdateOn_c_h','OppVolume_c_h','RevenueVolumeUSD_c_h','Region_h','OwnerShip_h','ProjectStartDate_c_h','GoLiveDate_c_h','CycleTime_h','ProjectStatus_h','Milestone__Reason_Code_h','PerCompleted_h','CountryStatus_h','ProjectLevel_h','CompletedDate_c_h','GlobalProjectManager_h','RegionalProjectManager_h','AssigneeFullName_h','GlobalCISDQSLead_h','GlobalCISOBTLead_h','RegionalCISOBTLead_h','LocalDigitalOBTLead_h','GlobalCISPortraitLead_h','RegionalCISPortraitLead_h','LocalDigitalOBTLead_h','GlobalCISHRFeedSpecialist_h','GDS_h','ActivityType_h','ComplexityScore_h','MilestoneTitle_h','Group_Name_h','Milestone__Project_Notes_h','Milestone__Closed_Loop_Owner_h','Workspace__ELT_Overall_Status_h','Workspace__ELT_Overall_Comments_h','Customer_Row_ID_h','Opportunity_ID_h','AccountOwner_h','Opportunity_Type_h','Revenue_Status_h','Revenue_Opportunity_Type_h','Opportunity_Owner_h','Opportunity_Category_h','Revenue_Total_Transactions_h','Line_Win_Probability_h','Implementation_Fee__PSD_c_h','DataDescription_h','Date_added_to_the_CLR_c_h','CreatedDate_c_h','Project_Effort_h','Sales_Stage_Name_h','AccountCategory_h','SOWStatus_h','ImplementationReady_h','RecordStatus_h','DataSourceType_h','CheckComments_h','actions_h'];
      }else{
        this.columnsToDisplay = ['Client','RevenueID','Country','iMeet_Workspace_Title','Region','ProjectStatus','GlobalCISOBTLead','RegionalCISOBTLead','LocalDigitalOBTLead','GlobalCISPortraitLead','RegionalCISPortraitLead','LocalDigitalOBTLead','GlobalCISHRFeedSpecialist','GDS','ActivityType','ComplexityScore','RecordStatus','DataSourceType','actions'];
        this.columnsToDisplay_h = ['Client_h','RevenueID_h','Country_h','iMeet_Workspace_Title_h','Region_h','ProjectStatus_h','GlobalCISOBTLead_h','RegionalCISOBTLead_h','LocalDigitalOBTLead_h','GlobalCISPortraitLead_h','RegionalCISPortraitLead_h','LocalDigitalOBTLead_h','GlobalCISHRFeedSpecialist_h','GDS_h','ActivityType_h','ComplexityScore_h','RecordStatus_h','DataSourceType_h','actions_h'];
      }
    }else{
      if(this.HideColumnsButtonName == "P"){
        this.columnsToDisplay = ['Client','RevenueID','Country','iMeet_Workspace_Title','Implementation_Type','Pipeline_status','Pipeline_comments','Service_location','Service_configuration','OBT_Reseller___Direct','Assignment_date_c','UpdateOn_c','OppVolume','RevenueVolumeUSD','Region','OwnerShip','ProjectStart_ForCycleTime_c','GoLiveDate_c','CycleTime','ProjectStatus','Milestone__Reason_Code','PerCompleted','CountryStatus','ProjectLevel','CompletedDate_c','GlobalProjectManager','RegionalProjectManager','AssigneeFullName','GlobalCISDQSLead','GlobalCISOBTLead','RegionalCISOBTLead','LocalDigitalOBTLead','GlobalCISPortraitLead','RegionalCISPortraitLead','LocalDigitalOBTLead','GlobalCISHRFeedSpecialist','GDS','ActivityType','ComplexityScore','MilestoneTitle','Group_Name','Milestone__Project_Notes','Milestone__Closed_Loop_Owner','Workspace__ELT_Overall_Status','Workspace__ELT_Overall_Comments','Customer_Row_ID','Opportunity_ID','AccountOwner','Opportunity_Type','Revenue_Status','Revenue_Opportunity_Type','Opportunity_Owner','Opportunity_Category','Revenue_Total_Transactions','Line_Win_Probability','Implementation_Fee__PSD_','DataDescription','Date_added_to_the_CLR_c','CreatedDate_c','Project_Effort','Sales_Stage_Name','AccountCategory','SOWStatus','ImplementationReady','RecordStatus','DataSourceType','CheckComments'];
        this.columnsToDisplay_h = ['Client_h','RevenueID_h','Country_h','iMeet_Workspace_Title_h','Implementation_Type_h','Pipeline_status_h','Pipeline_comments_h','Service_location_h','Service_configuration_h','OBT_Reseller___Direct_h','Assignment_date_c_h','UpdateOn_c_h','OppVolume_c_h','RevenueVolumeUSD_c_h','Region_h','OwnerShip_h','ProjectStartDate_c_h','GoLiveDate_c_h','CycleTime_h','ProjectStatus_h','Milestone__Reason_Code_h','PerCompleted_h','CountryStatus_h','ProjectLevel_h','CompletedDate_c_h','GlobalProjectManager_h','RegionalProjectManager_h','AssigneeFullName_h','GlobalCISDQSLead_h','GlobalCISOBTLead_h','RegionalCISOBTLead_h','LocalDigitalOBTLead_h','GlobalCISPortraitLead_h','RegionalCISPortraitLead_h','LocalDigitalOBTLead_h','GlobalCISHRFeedSpecialist_h','GDS_h','ActivityType_h','ComplexityScore_h','MilestoneTitle_h','Group_Name_h','Milestone__Project_Notes_h','Milestone__Closed_Loop_Owner_h','Workspace__ELT_Overall_Status_h','Workspace__ELT_Overall_Comments_h','Customer_Row_ID_h','Opportunity_ID_h','AccountOwner_h','Opportunity_Type_h','Revenue_Status_h','Revenue_Opportunity_Type_h','Opportunity_Owner_h','Opportunity_Category_h','Revenue_Total_Transactions_h','Line_Win_Probability_h','Implementation_Fee__PSD_c_h','DataDescription_h','Date_added_to_the_CLR_c_h','CreatedDate_c_h','Project_Effort_h','Sales_Stage_Name_h','AccountCategory_h','SOWStatus_h','ImplementationReady_h','RecordStatus_h','DataSourceType_h','CheckComments_h'];
      }else{
        this.columnsToDisplay = ['Client','RevenueID','Country','iMeet_Workspace_Title','Region','ProjectStatus','GlobalCISOBTLead','RegionalCISOBTLead','LocalDigitalOBTLead','GlobalCISPortraitLead','RegionalCISPortraitLead','LocalDigitalOBTLead','GlobalCISHRFeedSpecialist','GDS','ActivityType','ComplexityScore','RecordStatus','DataSourceType'];
        this.columnsToDisplay_h = ['Client_h','RevenueID_h','Country_h','iMeet_Workspace_Title_h','Region_h','ProjectStatus_h','GlobalCISOBTLead_h','RegionalCISOBTLead_h','LocalDigitalOBTLead_h','GlobalCISPortraitLead_h','RegionalCISPortraitLead_h','LocalDigitalOBTLead_h','GlobalCISHRFeedSpecialist_h','GDS_h','ActivityType_h','ComplexityScore_h','RecordStatus_h','DataSourceType_h'];
      }
    }
    if(this.HideColumnsButtonName == "P"){
      this.HideColumnsButtonName = "D";
    }else{
      this.HideColumnsButtonName = "P";
    }
    this.ResetFilter();
  }
  customFilterPredicate() {
    return (data: DataCLR, filter: string): boolean => {
      let searchString = JSON.parse(filter) as MyFilter;
      let isImplementationTypeAvailable = false;
      let isRecordStatusAvailable = false;
      let isProjectLevelAvailable = false;
      let isDataSourceTypeAvailable  = false;
      let isPipeline_statusAvailable = false;
      let isObtTypeAvailable = false;
      let isRegionAvailable = false;
      let isGDSAvailable = false;
      let isActivityTypeAvailable = false;
      let isOwnerShipAvailable = false;
      let isProjectStatusAvailable = false;
      let isCountryStatusAvailable = false;
      let isGroup_NameAvailable = false;
      let isWorkspace__ELT_Overall_StatusAvailable = false;
      let isSales_Stage_NameAvailable = false;
      let isOpportunity_TypeAvailable = false;
      let isRevenue_StatusAvailable = false;
      let isRevenue_Opportunity_TypeAvailable = false;
      let isOpportunity_CategoryAvailable = false;
      let isLine_Win_ProbabilityAvailable = false;
      let isGoliveDate_Available = false;
      if (searchString.Implementation_Type.length) {
        for (const d of searchString.Implementation_Type) {
          if (data.Implementation_Type.toString().trim() == d) {
            isImplementationTypeAvailable = true;
          }
        }
      } else {
        isImplementationTypeAvailable = true;
      }
      if (searchString.Pipeline_status.length) {
        for (const d of searchString.Pipeline_status) {
          if (data.Pipeline_status.toString().trim() == d) {
            isPipeline_statusAvailable = true;
          }
        }
      } else {
        isPipeline_statusAvailable = true;
      }
      if (searchString.OBT_Reseller___Direct.length) {
        for (const d of searchString.OBT_Reseller___Direct) {
          if (data.OBT_Reseller___Direct.toString().trim() == d) {
            isObtTypeAvailable = true;
          }
        }
      } else {
        isObtTypeAvailable = true;
      }
      if (searchString.Region.length) {
        for (const d of searchString.Region) {
          if (data.Region.toString().trim() == d) {
            isRegionAvailable = true;
          }
        }
      } else {
        isRegionAvailable = true;
      }
      if (searchString.GDS.length) {
        for (const d of searchString.GDS) {
          if (data.GDS.toString().trim() == d) {
            isGDSAvailable = true;
          }
        }
      } else {
        isGDSAvailable = true;
      }
      if (searchString.ActivityType.length) {
        for (const d of searchString.ActivityType) {
          if (data.ActivityType.toString().trim() == d) {
            isActivityTypeAvailable = true;
          }
        }
      } else {
        isActivityTypeAvailable = true;
      }
      if (searchString.OwnerShip.length) {
        for (const d of searchString.OwnerShip) {
          if (data.OwnerShip.toString().trim() == d) {
            isOwnerShipAvailable = true;
          }
        }
      } else {
        isOwnerShipAvailable = true;
      }
      if (searchString.ProjectStatus.length) {
        for (const d of searchString.ProjectStatus) {
          if (data.ProjectStatus.toString().trim() == d) {
            isProjectStatusAvailable = true;
          }
        }
      } else {
        isProjectStatusAvailable = true;
      }
      if (searchString.CountryStatus.length) {
        for (const d of searchString.CountryStatus) {
          if (data.CountryStatus.toString().trim() == d) {
            isCountryStatusAvailable = true;
          }
        }
      } else {
        isCountryStatusAvailable = true;
      }
      if (searchString.ProjectLevel.length) {
        for (const d of searchString.ProjectLevel) {
          if (data.ProjectLevel.toString().trim() == d) {
            isProjectLevelAvailable = true;
          }
        }
      } else {
        isProjectLevelAvailable = true;
      }
      if (searchString.Group_Name.length) {
        for (const d of searchString.Group_Name) {
          if (data.Group_Name.toString().trim() == d) {
            isGroup_NameAvailable = true;
          }
        }
      } else {
        isGroup_NameAvailable = true;
      }
      if (searchString.Workspace__ELT_Overall_Status.length) {
        for (const d of searchString.Workspace__ELT_Overall_Status) {
          if (data.Workspace__ELT_Overall_Status.toString().trim() == d) {
            isWorkspace__ELT_Overall_StatusAvailable = true;
          }
        }
      } else {
        isWorkspace__ELT_Overall_StatusAvailable = true;
      }
      if (searchString.Sales_Stage_Name.length) {
        for (const d of searchString.Sales_Stage_Name) {
          if (data.Sales_Stage_Name.toString().trim() == d) {
            isSales_Stage_NameAvailable = true;
          }
        }
      } else {
        isSales_Stage_NameAvailable = true;
      }
      if (searchString.Opportunity_Type.length) {
        for (const d of searchString.Opportunity_Type) {
          if (data.Opportunity_Type.toString().trim() == d) {
            isOpportunity_TypeAvailable = true;
          }
        }
      } else {
        isOpportunity_TypeAvailable = true;
      }
      if (searchString.Revenue_Status.length) {
        for (const d of searchString.Revenue_Status) {
          if (data.Revenue_Status.toString().trim() == d) {
            isRevenue_StatusAvailable = true;
          }
        }
      } else {
        isRevenue_StatusAvailable = true;
      }
      if (searchString.Revenue_Opportunity_Type.length) {
        for (const d of searchString.Revenue_Opportunity_Type) {
          if (data.Revenue_Opportunity_Type.toString().trim() == d) {
            isRevenue_Opportunity_TypeAvailable = true;
          }
        }
      } else {
        isRevenue_Opportunity_TypeAvailable = true;
      }
      if (searchString.Opportunity_Category.length) {
        for (const d of searchString.Opportunity_Category) {
          if (data.Opportunity_Category.toString().trim() == d) {
            isOpportunity_CategoryAvailable = true;
          }
        }
      } else {
        isOpportunity_CategoryAvailable = true;
      }
      if (searchString.Line_Win_Probability.length) {
        for (const d of searchString.Line_Win_Probability) {
          if (data.Line_Win_Probability.toString().trim() == d) {
            isLine_Win_ProbabilityAvailable = true;
          }
        }
      } else {
        isLine_Win_ProbabilityAvailable = true;
      }
      if (searchString.RecordStatus.length) {
        for (const d of searchString.RecordStatus) {
          if (data.RecordStatus.toString().trim() == d) {
            isRecordStatusAvailable = true;
          }
        }
      } else {
        isRecordStatusAvailable = true;
      }

      if (searchString.DataSourceType.length) {
        for (const d of searchString.DataSourceType) {
          if (data.DataSourceType.toString().trim() == d) {
            isDataSourceTypeAvailable = true;
          }
        }
      } else {
        isDataSourceTypeAvailable = true;
      }
      if(searchString.GoLiveDate_c != null && searchString.GoLiveDate_cE != null){
        if(data.GoLiveDate_c >= new Date(Number(this.datepipe.transform(searchString.GoLiveDate_c, 'yyyy')), Number(this.datepipe.transform(searchString.GoLiveDate_c, 'MM'))-1, Number(this.datepipe.transform(searchString.GoLiveDate_c, 'dd'))) && data.GoLiveDate_c <= new Date(Number(this.datepipe.transform(searchString.GoLiveDate_cE, 'yyyy')), Number(this.datepipe.transform(searchString.GoLiveDate_cE, 'MM'))-1, Number(this.datepipe.transform(searchString.GoLiveDate_cE, 'dd')))){
          isGoliveDate_Available = true;
        }
      }else if(searchString.GoLiveDate_c != null && searchString.GoLiveDate_cE == null){
        if(data.GoLiveDate_c >= new Date(Number(this.datepipe.transform(searchString.GoLiveDate_c, 'yyyy')), Number(this.datepipe.transform(searchString.GoLiveDate_c, 'MM'))-1, Number(this.datepipe.transform(searchString.GoLiveDate_c, 'dd')))){
          isGoliveDate_Available = true;
        }
      }else{
        isGoliveDate_Available = true;
      }
      return (
        isImplementationTypeAvailable &&
        isRecordStatusAvailable &&
        isProjectLevelAvailable &&
        isDataSourceTypeAvailable &&
        isPipeline_statusAvailable &&
        isObtTypeAvailable &&
        isRegionAvailable &&
        isGDSAvailable &&
        isActivityTypeAvailable &&
        isOwnerShipAvailable &&
        isProjectStatusAvailable &&
        isCountryStatusAvailable &&
        isGroup_NameAvailable &&
        isWorkspace__ELT_Overall_StatusAvailable &&
        isSales_Stage_NameAvailable &&
        isOpportunity_TypeAvailable &&
        isRevenue_StatusAvailable &&
        isRevenue_Opportunity_TypeAvailable &&
        isOpportunity_CategoryAvailable &&
        isLine_Win_ProbabilityAvailable &&
        isGoliveDate_Available && 
        data.Client.toString().trim().toLowerCase().indexOf(searchString.Client.toLowerCase()) !== -1 &&
        data.RevenueID.toString().trim().toLowerCase().indexOf(searchString.RevenueID.toLowerCase()) !== -1 &&
        data.iMeet_Workspace_Title.toString().trim().toLowerCase().indexOf(searchString.iMeet_Workspace_Title.toLowerCase()) !== -1 &&
        data.CreatedDate_c.toString().trim().toLowerCase().indexOf(searchString.CreatedDate_c.toLowerCase()) !== -1 &&
        data.Pipeline_comments.toString().trim().toLowerCase().indexOf(searchString.Pipeline_comments.toLowerCase()) !== -1 &&
        data.Service_configuration.toString().trim().toLowerCase().indexOf(searchString.Service_configuration.toLowerCase()) !== -1 &&
        data.Service_location.toString().trim().toLowerCase().indexOf(searchString.Service_location.toLowerCase()) !== -1 &&
        data.GlobalCISDQSLead.toString().trim().toLowerCase().indexOf(searchString.GlobalCISDQSLead.toLowerCase()) !== -1 &&
        // data.OBT_Reseller___Direct.toString().trim().toLowerCase().indexOf(searchString.OBT_Reseller___Direct.toLowerCase()) !== -1 &&
        data.Assignment_date_c.toString().trim().toLowerCase().indexOf(searchString.Assignment_date_c.toLowerCase()) !== -1 &&
        data.UpdateOn_c.toString().trim().toLowerCase().indexOf(searchString.UpdateOn_c.toLowerCase()) !== -1 &&
        data.OppVolume.toString().trim().toLowerCase().indexOf(searchString.OppVolume.toLowerCase()) !== -1 &&
        data.RevenueVolumeUSD.toString().trim().toLowerCase().indexOf(searchString.RevenueVolumeUSD.toLowerCase()) !== -1 &&
        data.Country.toString().trim().toLowerCase().indexOf(searchString.Country.toLowerCase()) !== -1 &&
        data.ProjectStart_ForCycleTime_c.toString().trim().toLowerCase().indexOf(searchString.ProjectStart_ForCycleTime_c.toLowerCase()) !== -1 &&
        data.CycleTime.toString().trim().toLowerCase().indexOf(searchString.CycleTime.toLowerCase()) !== -1 &&
        data.Milestone__Reason_Code.toString().trim().toLowerCase().indexOf(searchString.Milestone__Reason_Code.toLowerCase()) !== -1 &&
        data.PerCompleted.toString().trim().toLowerCase().indexOf(searchString.PerCompleted.toLowerCase()) !== -1 &&
        data.CompletedDate_c.toString().trim().toLowerCase().indexOf(searchString.CompletedDate_c.toLowerCase()) !== -1 &&
        data.GlobalProjectManager.toString().trim().toLowerCase().indexOf(searchString.GlobalProjectManager.toLowerCase()) !== -1 &&
        data.RegionalProjectManager.toString().trim().toLowerCase().indexOf(searchString.RegionalProjectManager.toLowerCase()) !== -1 &&
        data.AssigneeFullName.toString().trim().toLowerCase().indexOf(searchString.AssigneeFullName.toLowerCase()) !== -1 &&
        data.GlobalCISOBTLead.toString().trim().toLowerCase().indexOf(searchString.GlobalCISOBTLead.toLowerCase()) !== -1 &&
        data.RegionalCISOBTLead.toString().trim().toLowerCase().indexOf(searchString.RegionalCISOBTLead.toLowerCase()) !== -1 &&
        data.LocalDigitalOBTLead.toString().trim().toLowerCase().indexOf(searchString.LocalDigitalOBTLead.toLowerCase()) !== -1 &&
        data.GlobalCISPortraitLead.toString().trim().toLowerCase().indexOf(searchString.GlobalCISPortraitLead.toLowerCase()) !== -1 &&
        data.RegionalCISPortraitLead.toString().trim().toLowerCase().indexOf(searchString.RegionalCISPortraitLead.toLowerCase()) !== -1 &&
        data.LocalDigitalAdHocSupport.toString().trim().toLowerCase().indexOf(searchString.LocalDigitalAdHocSupport.toLowerCase()) !== -1 &&
        data.GlobalCISHRFeedSpecialist.toString().trim().toLowerCase().indexOf(searchString.GlobalCISHRFeedSpecialist.toLowerCase()) !== -1 &&
        data.MilestoneTitle.toString().trim().toLowerCase().indexOf(searchString.MilestoneTitle.toLowerCase()) !== -1 &&
        data.Milestone__Project_Notes.toString().trim().toLowerCase().indexOf(searchString.Milestone__Project_Notes.toLowerCase()) !== -1 &&
        data.Milestone__Closed_Loop_Owner.toString().trim().toLowerCase().indexOf(searchString.Milestone__Closed_Loop_Owner.toLowerCase()) !== -1 &&
        data.Workspace__ELT_Overall_Comments.toString().trim().toLowerCase().indexOf(searchString.Workspace__ELT_Overall_Comments.toLowerCase()) !== -1 &&
        data.Customer_Row_ID.toString().trim().toLowerCase().indexOf(searchString.Customer_Row_ID.toLowerCase()) !== -1 &&
        data.Opportunity_ID.toString().trim().toLowerCase().indexOf(searchString.Opportunity_ID.toLowerCase()) !== -1 &&
        data.AccountOwner.toString().trim().toLowerCase().indexOf(searchString.AccountOwner.toLowerCase()) !== -1 &&
        data.Opportunity_Owner.toString().trim().toLowerCase().indexOf(searchString.Opportunity_Owner.toLowerCase()) !== -1 &&
        data.Revenue_Total_Transactions.toString().trim().toLowerCase().indexOf(searchString.Revenue_Total_Transactions.toLowerCase()) !== -1 &&
        data.Implementation_Fee__PSD_.toString().trim().toLowerCase().indexOf(searchString.Implementation_Fee__PSD_.toLowerCase()) !== -1 &&
        data.DataDescription.toString().trim().toLowerCase().indexOf(searchString.DataDescription.toLowerCase()) !== -1 &&
        data.Project_Effort.toString().trim().toLowerCase().indexOf(searchString.Project_Effort.toLowerCase()) !== -1 &&
        data.AccountCategory.toString().trim().toLowerCase().indexOf(searchString.AccountCategory.toLowerCase()) !== -1 &&
        data.SOWStatus.toString().trim().toLowerCase().indexOf(searchString.SOWStatus.toLowerCase()) !== -1 &&
        data.ImplementationReady.toString().trim().toLowerCase().indexOf(searchString.ImplementationReady.toLowerCase()) !== -1 &&
        data.ComplexityScore.toString().trim().toLowerCase().indexOf(searchString.ComplexityScore.toLowerCase()) !== -1 &&
        data.Date_added_to_the_CLR_c.toString().trim().toLowerCase().indexOf(searchString.Date_added_to_the_CLR_c.toLowerCase()) !== -1 &&
        data.CheckComments.toString().trim().toLowerCase().indexOf(searchString.CheckComments.toLowerCase()) !== -1
      )
    }
  }
  onFilterValueChange(){
    this.ClientFilter.valueChanges.subscribe(value => {
      this.filteredValues["Client"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.RevenueIDFilter.valueChanges.subscribe(value => {
      this.filteredValues["RevenueID"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.iMeet_Workspace_TitleFilter.valueChanges.subscribe(value => {
      this.filteredValues["iMeet_Workspace_Title"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.CreatedDate_cFilter.valueChanges.subscribe(value => {
      this.filteredValues["CreatedDate_c"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.Implementation_TypeFilter.valueChanges.subscribe(value => {
      this.filteredValues["Implementation_Type"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.Pipeline_statusFilter.valueChanges.subscribe(value => {
      this.filteredValues["Pipeline_status"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.Pipeline_commentsFilter.valueChanges.subscribe(value => {
      this.filteredValues["Pipeline_comments"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.Service_configurationFilter.valueChanges.subscribe(value => {
      this.filteredValues["Service_configuration"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.Service_locationFilter.valueChanges.subscribe(value => {
      this.filteredValues["Service_location"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.GlobalCISDQSLeadFilter.valueChanges.subscribe(value => {
      this.filteredValues["GlobalCISDQSLead"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.OBT_Reseller___DirectFilter.valueChanges.subscribe(value => {
      this.filteredValues["OBT_Reseller___Direct"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.Assignment_date_cFilter.valueChanges.subscribe(value => {
      this.filteredValues["Assignment_date_c"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.UpdateOn_cFilter.valueChanges.subscribe(value => {
      this.filteredValues["UpdateOn_c"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.OppVolume_cFilter.valueChanges.subscribe(value => {
      this.filteredValues["OppVolume"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.RevenueVolumeUSDFilter.valueChanges.subscribe(value => {
      this.filteredValues["RevenueVolumeUSD"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.RegionFilter.valueChanges.subscribe(value => {
      this.filteredValues["Region"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.ActivityTypeFilter.valueChanges.subscribe(value => {
      this.filteredValues["ActivityType"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.CountryFilter.valueChanges.subscribe(value => {
      this.filteredValues["Country"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.OwnerShipFilter.valueChanges.subscribe(value => {
      this.filteredValues["OwnerShip"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    // this.GoLiveDate_cFilter.valueChanges.subscribe(value => {
    //   this.filteredValues["GoLiveDate_c"] = value;
    //   this.dataSource.filter = JSON.stringify(this.filteredValues);
    //   this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
    //   this.FilteredCount = this.dataSource.filteredData.length;
    // });
    this.GoLiveDate_cSFilter.valueChanges.subscribe(value => {
      if(value != null){
        this.filteredValues["GoLiveDate_c"] = new Date(Number(this.datepipe.transform(value, 'yyyy')), Number(this.datepipe.transform(value, 'MM'))-1, Number(this.datepipe.transform(value, 'dd')));
        this.dataSource.filter = JSON.stringify(this.filteredValues);
        this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
        this.FilteredCount = this.dataSource.filteredData.length;
      }else{
        this.filteredValues["GoLiveDate_c"] = null;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
        this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
        this.FilteredCount = this.dataSource.filteredData.length;
      }
    });
    this.GoLiveDate_cEFilter.valueChanges.subscribe(value => {
      if(value != null){
        this.filteredValues["GoLiveDate_cE"] = new Date(Number(this.datepipe.transform(value, 'yyyy')), Number(this.datepipe.transform(value, 'MM'))-1, Number(this.datepipe.transform(value, 'dd')));
        this.dataSource.filter = JSON.stringify(this.filteredValues);
        this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
        this.FilteredCount = this.dataSource.filteredData.length;
      }else{
        this.filteredValues["GoLiveDate_cE"] = null;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
        this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
        this.FilteredCount = this.dataSource.filteredData.length;
      }
    });
    this.ProjectStartDate_cFilter.valueChanges.subscribe(value => {
      this.filteredValues["ProjectStart_ForCycleTime_c"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.CycleTimeFilter.valueChanges.subscribe(value => {
      this.filteredValues["CycleTime"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.ProjectStatusFilter.valueChanges.subscribe(value => {
      this.filteredValues["ProjectStatus"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.Milestone__Reason_CodeFilter.valueChanges.subscribe(value => {
      this.filteredValues["Milestone__Reason_Code"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.PerCompletedFilter.valueChanges.subscribe(value => {
      this.filteredValues["PerCompleted"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.CountryStatusFilter.valueChanges.subscribe(value => {
      this.filteredValues["CountryStatus"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.ProjectLevelFilter.valueChanges.subscribe(value => {
      this.filteredValues["ProjectLevel"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.CompletedDate_cFilter.valueChanges.subscribe(value => {
      this.filteredValues["CompletedDate_c"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.GlobalProjectManagerFilter.valueChanges.subscribe(value => {
      this.filteredValues["GlobalProjectManager"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.RegionalProjectManagerFilter.valueChanges.subscribe(value => {
      this.filteredValues["RegionalProjectManager"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.AssigneeFullNameFilter.valueChanges.subscribe(value => {
      this.filteredValues["AssigneeFullName"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.GlobalCISOBTLeadFilter.valueChanges.subscribe(value => {
      this.filteredValues["GlobalCISOBTLead"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.RegionalCISOBTLeadFilter.valueChanges.subscribe(value => {
      this.filteredValues["RegionalCISOBTLead"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.LocalDigitalOBTLeadFilter.valueChanges.subscribe(value => {
      this.filteredValues["LocalDigitalOBTLead"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.LocalDigitalAdHocSupportFilter.valueChanges.subscribe(value => {
      this.filteredValues["LocalDigitalAdHocSupport"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.GlobalCISPortraitLeadFilter.valueChanges.subscribe(value => {
      this.filteredValues["GlobalCISPortraitLead"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.RegionalCISPortraitLeadFilter.valueChanges.subscribe(value => {
      this.filteredValues["RegionalCISPortraitLead"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.GDSFilter.valueChanges.subscribe(value => {
      this.filteredValues["GDS"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.GlobalCISHRFeedSpecialistFilter.valueChanges.subscribe(value => {
      this.filteredValues["GlobalCISHRFeedSpecialist"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.MilestoneTitleFilter.valueChanges.subscribe(value => {
      this.filteredValues["MilestoneTitle"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.Group_NameFilter.valueChanges.subscribe(value => {
      this.filteredValues["Group_Name"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.Milestone__Project_NotesFilter.valueChanges.subscribe(value => {
      this.filteredValues["Milestone__Project_Notes"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.Milestone__Closed_Loop_OwnerFilter.valueChanges.subscribe(value => {
      this.filteredValues["Milestone__Closed_Loop_Owner"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.Workspace__ELT_Overall_StatusFilter.valueChanges.subscribe(value => {
      this.filteredValues["Workspace__ELT_Overall_Status"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.Workspace__ELT_Overall_CommentsFilter.valueChanges.subscribe(value => {
      this.filteredValues["Workspace__ELT_Overall_Comments"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.Customer_Row_IDFilter.valueChanges.subscribe(value => {
      this.filteredValues["Customer_Row_ID"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.Opportunity_IDFilter.valueChanges.subscribe(value => {
      this.filteredValues["Opportunity_ID"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.AccountOwnerFilter.valueChanges.subscribe(value => {
      this.filteredValues["AccountOwner"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.Sales_Stage_NameFilter.valueChanges.subscribe(value => {
      this.filteredValues["Sales_Stage_Name"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.Opportunity_TypeFilter.valueChanges.subscribe(value => {
      this.filteredValues["Opportunity_Type"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.Revenue_StatusFilter.valueChanges.subscribe(value => {
      this.filteredValues["Revenue_Status"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.Revenue_Opportunity_TypeFilter.valueChanges.subscribe(value => {
      this.filteredValues["Revenue_Opportunity_Type"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.Opportunity_OwnerFilter.valueChanges.subscribe(value => {
      this.filteredValues["Opportunity_Owner"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.Opportunity_CategoryFilter.valueChanges.subscribe(value => {
      this.filteredValues["Opportunity_Category"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.Revenue_Total_TransactionsFilter.valueChanges.subscribe(value => {
      this.filteredValues["Revenue_Total_Transactions"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.Line_Win_ProbabilityFilter.valueChanges.subscribe(value => {
      this.filteredValues["Line_Win_Probability"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.Implementation_Fee__PSD_Filter.valueChanges.subscribe(value => {
      this.filteredValues["Implementation_Fee__PSD_"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.DataDescriptionFilter.valueChanges.subscribe(value => {
      this.filteredValues["DataDescription"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.Project_EffortFilter.valueChanges.subscribe(value => {
      this.filteredValues["Project_Effort"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.AccountCategoryFilter.valueChanges.subscribe(value => {
      this.filteredValues["AccountCategory"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.SOWStatusFilter.valueChanges.subscribe(value => {
      this.filteredValues["SOWStatus"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.ImplementationReadyFilter.valueChanges.subscribe(value => {
      this.filteredValues["ImplementationReady"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.ComplexityScoreFilter.valueChanges.subscribe(value => {
      this.filteredValues["ComplexityScore"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.RecordStatusFilter.valueChanges.subscribe(value => {
      this.filteredValues["RecordStatus"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.DataSourceTypeFilter.valueChanges.subscribe(value => {
      this.filteredValues["DataSourceType"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.Date_added_to_the_CLR_cFilter.valueChanges.subscribe(value => {
      this.filteredValues["Date_added_to_the_CLR_c"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.CheckCommentsFilter.valueChanges.subscribe(value => {
      this.filteredValues["CheckComments"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.dataSource.filterPredicate = this.customFilterPredicate();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  FilterDataIssues(){
    this.isLoading = true;
    this.timer        = timer(3000); // 5000 millisecond means 5 seconds
    this.subscription = this.timer.subscribe(() => {
      this.ClientFilter.setValue("");
      this.RevenueIDFilter.setValue("");
      this.iMeet_Workspace_TitleFilter.setValue("");
      this.CreatedDate_cFilter.setValue("");
      this.Implementation_TypeFilter.setValue("");
      this.Pipeline_statusFilter.setValue("");
      this.Pipeline_commentsFilter.setValue("");
      this.Service_configurationFilter.setValue("");
      this.Service_locationFilter.setValue("");
      this.GlobalCISDQSLeadFilter.setValue("");
      this.OBT_Reseller___DirectFilter.setValue("");
      this.Assignment_date_cFilter.setValue("");
      this.UpdateOn_cFilter.setValue("");
      this.OppVolume_cFilter.setValue("");
      this.RevenueVolumeUSDFilter.setValue("");
      this.RegionFilter.setValue("");
      this.CountryFilter.setValue("");
      this.OwnerShipFilter.setValue("");
      // this.GoLiveDate_cFilter.setValue("");
      this.GoLiveDate_cSFilter.setValue("");
      this.GoLiveDate_cEFilter.setValue("");
      this.ProjectStartDate_cFilter.setValue("");
      this.CycleTimeFilter.setValue("");
      this.ProjectStatusFilter.setValue("");
      this.Milestone__Reason_CodeFilter.setValue("");
      this.PerCompletedFilter.setValue("");
      this.CountryStatusFilter.setValue("");
      this.ProjectLevelFilter.setValue("");
      this.CompletedDate_cFilter.setValue("");
      this.GlobalProjectManagerFilter.setValue("");
      this.RegionalProjectManagerFilter.setValue("");
      this.AssigneeFullNameFilter.setValue("");
      this.GlobalCISOBTLeadFilter.setValue("");
      this.RegionalCISOBTLeadFilter.setValue("");
      this.LocalDigitalOBTLeadFilter.setValue("");
      this.LocalDigitalAdHocSupportFilter.setValue("");
      this.GlobalCISPortraitLeadFilter.setValue("");
      this.RegionalCISPortraitLeadFilter.setValue("");
      this.ActivityTypeFilter.setValue("");
      this.GDSFilter.setValue("");
      this.GlobalCISHRFeedSpecialistFilter.setValue("");
      this.MilestoneTitleFilter.setValue("");
      this.Group_NameFilter.setValue("");
      this.Milestone__Project_NotesFilter.setValue("");
      this.Milestone__Closed_Loop_OwnerFilter.setValue("");
      this.Workspace__ELT_Overall_StatusFilter.setValue("");
      this.Workspace__ELT_Overall_CommentsFilter.setValue("");
      this.Customer_Row_IDFilter.setValue("");
      this.Opportunity_IDFilter.setValue("");
      this.AccountOwnerFilter.setValue("");
      this.Sales_Stage_NameFilter.setValue("");
      this.Opportunity_TypeFilter.setValue("");
      this.Revenue_StatusFilter.setValue("");
      this.Revenue_Opportunity_TypeFilter.setValue("");
      this.Opportunity_OwnerFilter.setValue("");
      this.Opportunity_CategoryFilter.setValue("");
      this.Revenue_Total_TransactionsFilter.setValue("");
      this.Line_Win_ProbabilityFilter.setValue("");
      this.Implementation_Fee__PSD_Filter.setValue("");
      this.DataDescriptionFilter.setValue("");
      this.Project_EffortFilter.setValue("");
      this.AccountCategoryFilter.setValue("");
      this.SOWStatusFilter.setValue("");
      this.ImplementationReadyFilter.setValue("");
      this.ComplexityScoreFilter.setValue("");
      this.RecordStatusFilter.setValue(["Active"]);
      this.DataSourceTypeFilter.setValue("");
      this.Date_added_to_the_CLR_cFilter.setValue("");
      this.CheckCommentsFilter.setValue("Data Quality");
      this.isLoading = false;
    })
  }
  GetData(){
    this.dataSource = null;
    this.isLoading = true;
    this.LoginUID = localStorage.getItem("UID");
    this.dashboard.ShowSpinnerHandler(true);
    this.service.GetCLRManualData().subscribe(data =>{
      if(data.code == 200){
        this.DataCLR = data.Data;
        var datecheck6 = new Date();
        var datecheck10 = new Date();
        var check2Date = new Date(this.date.setDate(this.date.getDate()+15));
        var check6Date = new Date(datecheck6.setDate(datecheck6.getDate()-50));
        var check10Date = new Date(datecheck10.setDate(datecheck10.getDate()+10));
        for(let i = 0;i<data.Data.length;i++){
          if(this.DataCLR[i].DataSourceType != "OldData" && (this.DataCLR[i].GlobalProjectManager.includes('@') || this.DataCLR[i].RegionalProjectManager.includes('@') || this.DataCLR[i].AssigneeFullName.includes('@'))){
            this.DataCLR[i].CheckComments = "Data Quality :-"+ '\n'+ '\n';
            if(this.DataCLR[i].GlobalProjectManager.includes('@')){
              this.DataCLR[i].CheckComments += "Global Project Manager name is an e-mail id. Please change in iMeet"+ '\n';
            }else if(this.DataCLR[i].RegionalProjectManager.includes('@')){
              this.DataCLR[i].CheckComments += "Regional Project Manager name is an e-mail id. Please change in iMeet"+ '\n';
            }else{
              this.DataCLR[i].CheckComments += "Local Project Manager name is an e-mail id. Please change in iMeet"+ '\n';
            }
          }else{
            this.DataCLR[i].CheckComments = "---";
          }
          if(this.DataCLR[i].DataSourceType != "OldData" && this.DataCLR[i].ProjectStatus == "N-Active/No Date Confirmed" && new Date(this.DataCLR[i].GoLiveDate) < check2Date){
            if(this.DataCLR[i].CheckComments == "---"){
              this.DataCLR[i].CheckComments = "Data Quality :-"+ '\n'+ '\n';
              this.DataCLR[i].CheckComments += "Project Status is N-Active/No Date Confirmed and Go-Live is in the next 15 days"+ '\n';
            }else{
              this.DataCLR[i].CheckComments += "Project Status is N-Active/No Date Confirmed and Go-Live is in the next 15 days"+ '\n';
            }
          }else{
          }
          if(this.DataCLR[i].DataSourceType != "OldData" && this.DataCLR[i].DataSourceType != "Ad-Hoc Digital Data" && this.DataCLR[i].ProjectStatus == "H-Hold" && this.DataCLR[i].Milestone__Reason_Code == "---"){
            if(this.DataCLR[i].CheckComments == "---"){
              this.DataCLR[i].CheckComments = "Data Quality :-"+ '\n'+ '\n';
              this.DataCLR[i].CheckComments += "Project Status is H-Hold and Milestone Reason code is Blank"+ '\n';
            }else{
              this.DataCLR[i].CheckComments += "Project Status is H-Hold and Milestone Reason code is Blank"+ '\n';
            }
          }else{
          }
          if(this.DataCLR[i].DataSourceType != "OldData" && this.DataCLR[i].ProjectStatus == "C-Closed" && new Date(this.DataCLR[i].GoLiveDate) > new Date()){
            if(this.DataCLR[i].CheckComments == "---"){
              this.DataCLR[i].CheckComments = "Data Quality :-"+ '\n'+ '\n';
              this.DataCLR[i].CheckComments += "Project Status is C-Closed and Go-Live is greater than today"+ '\n';
            }else{
              this.DataCLR[i].CheckComments += "Project Status is C-Closed and Go-Live is greater than today"+ '\n';
            }
          }else{
          }
          if(this.DataCLR[i].DataSourceType != "OldData" && this.DataCLR[i].ProjectStatus == "A-Active/Date Confirmed" && this.DataCLR[i].Milestone__Reason_Code != "---"){
            if(this.DataCLR[i].CheckComments == "---"){
              this.DataCLR[i].CheckComments = "Data Quality :-"+ '\n'+ '\n';
              this.DataCLR[i].CheckComments += "Project Status is A-Active/Date Confirmed and Milestone Reason code is not Blank"+ '\n';
            }else{
              this.DataCLR[i].CheckComments += "Project Status is A-Active/Date Confirmed and Milestone Reason code is not Blank"+ '\n';
            }
          }else{
          }
          if(this.DataCLR[i].DataSourceType != "OldData" && this.DataCLR[i].ProjectStatus == "A-Active/Date Confirmed" && new Date(this.DataCLR[i].GoLiveDate) < check6Date){
            if(this.DataCLR[i].CheckComments == "---"){
              this.DataCLR[i].CheckComments = "Data Quality :-"+ '\n'+ '\n';
              this.DataCLR[i].CheckComments += "Project Status is A-Active/Date Confirmed and Go-Live is more than 50 days in the past"+ '\n';
            }else{
              this.DataCLR[i].CheckComments += "Project Status is A-Active/Date Confirmed and Go-Live is more than 50 days in the past"+ '\n';
            }
          }else{
          }
          if(this.DataCLR[i].ProjectStart_ForCycleTime != null){
            if(this.DataCLR[i].ProjectStatus != "X-Cancelled" && this.DataCLR[i].DataSourceType != "OldData" && new Date(this.DataCLR[i].GoLiveDate) < new Date(this.DataCLR[i].ProjectStart_ForCycleTime)){
              if(this.DataCLR[i].CheckComments == "---"){
                this.DataCLR[i].CheckComments = "Data Quality :-"+ '\n'+ '\n';
                this.DataCLR[i].CheckComments += "Project Start Date is greater than Go-Live Date"+ '\n';
              }else{
                this.DataCLR[i].CheckComments += "Project Start Date is greater than Go-Live Date"+ '\n';
              }
            }else{
            }
          }else{
          }
          // if(this.DataCLR[i].TaskStatus == "todo" && this.DataCLR[i].ProjectStart_ForCycleTime != null){
          //   if(new Date(this.DataCLR[i].ProjectStart_ForCycleTime) > new Date() && check10Date > new Date(this.DataCLR[i].ProjectStart_ForCycleTime)){
          //     if(this.DataCLR[i].CheckComments == "---"){
          //       this.DataCLR[i].CheckComments = "Data Quality :-"+ '\n'+ '\n';
          //       this.DataCLR[i].CheckComments += "Project Start Task Status is To-Do and Project Due Date is greater than today and less than today plus 10 days"+ '\n';
          //     }else{
          //       this.DataCLR[i].CheckComments += "Project Start Task Status is To-Do and Project Due Date is greater than today and less than today plus 10 days"+ '\n';
          //     }
          //   }else{
          //   }
          // }else{
          // }
          if(this.DataCLR[i].Date_added_to_the_CLR == null){
            this.DataCLR[i].Date_added_to_the_CLR_c = "---";
          }else{
            this.DataCLR[i].Date_added_to_the_CLR_c = this.datepipe.transform(this.DataCLR[i].Date_added_to_the_CLR, "yyyy-MM-dd");
          }
          if(this.DataCLR[i].Assignment_date == null){
            this.DataCLR[i].Assignment_date_c = "---";
          }else{
            this.DataCLR[i].Assignment_date_c = this.datepipe.transform(this.DataCLR[i].Assignment_date, "yyyy-MM-dd");
          }
          if(this.DataCLR[i].UpdateOn == null){
            this.DataCLR[i].UpdateOn_c = "---";
          }else{
            this.DataCLR[i].UpdateOn_c = this.datepipe.transform(this.DataCLR[i].UpdateOn, "yyyy-MM-dd");
          }
          if(this.DataCLR[i].OppVolume == null){
            this.DataCLR[i].OppVolume_c = "$0";
          }else{
            this.DataCLR[i].OppVolume_c = this.DataCLR[i].OppVolume.toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3)
          }
          if(this.DataCLR[i].CreatedDate == null){
            this.DataCLR[i].CreatedDate_c = "---";
          }else{
            this.DataCLR[i].CreatedDate_c = this.datepipe.transform(this.DataCLR[i].CreatedDate, "yyyy-MM-dd");
          }
          if(this.DataCLR[i].New_Business_volume__US__ == null){
            this.DataCLR[i].New_Business_volume__US___c = "$0";
          }else{
            this.DataCLR[i].New_Business_volume__US___c = this.DataCLR[i].New_Business_volume__US__.toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3)
          }
          if(this.DataCLR[i].RevenueVolumeUSD == null){
            this.DataCLR[i].RevenueVolumeUSD_c = "$0";
          }else{
            this.DataCLR[i].RevenueVolumeUSD_c = this.DataCLR[i].RevenueVolumeUSD.toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
            //this.DataCLR[i].RevenueVolumeUSD_c = "$"+Math.round(this.DataCLR[i].RevenueVolumeUSD).toLocaleString().replace(/,/g, '');
          }
          // if(this.DataCLR[i].GoLiveDate == null){
          //   this.DataCLR[i].GoLiveDate_c = "---";
          // }else{
          //   this.DataCLR[i].GoLiveDate_c = this.datepipe.transform(this.DataCLR[i].GoLiveDate, "yyyy-MM-dd");
          // }
          this.DataCLR[i].GoLiveDate_c = new Date(Number(this.datepipe.transform(this.DataCLR[i].GoLiveDate, 'yyyy')), Number(this.datepipe.transform(this.DataCLR[i].GoLiveDate, 'MM'))-1, Number(this.datepipe.transform(this.DataCLR[i].GoLiveDate, 'dd')));
          if(this.DataCLR[i].ProjectStart_ForCycleTime == null){
            this.DataCLR[i].ProjectStart_ForCycleTime_c = "---";
          }else{
            this.DataCLR[i].ProjectStart_ForCycleTime_c = this.datepipe.transform(this.DataCLR[i].ProjectStart_ForCycleTime, "yyyy-MM-dd");
          }
          if(this.DataCLR[i].CompletedDate == null){
            this.DataCLR[i].CompletedDate_c = "---";
          }else{
            this.DataCLR[i].CompletedDate_c = this.datepipe.transform(this.DataCLR[i].CompletedDate, "yyyy-MM-dd");
          }
          if(this.DataCLR[i].Implementation_Fee__PSD_ == null){
            this.DataCLR[i].Implementation_Fee__PSD_c = "$0";
          }else{
            this.DataCLR[i].Implementation_Fee__PSD_c = this.DataCLR[i].Implementation_Fee__PSD_.toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3)
          }
          if(this.DataCLR[i].EMEA_OBT_standard_fee == null){
            this.DataCLR[i].EMEA_OBT_standard_fee_c = "$0";
          }else{
            this.DataCLR[i].EMEA_OBT_standard_fee_c = this.DataCLR[i].EMEA_OBT_standard_fee.toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3)
          }
          if(this.DataCLR[i].EMEA_Accrual_date == null){
            this.DataCLR[i].EMEA_Accrual_date_c = "---";
          }else{
            this.DataCLR[i].EMEA_Accrual_date_c = this.datepipe.transform(this.DataCLR[i].EMEA_Accrual_date, "yyyy-MM-dd");
          }
        }
        this.dataSource = new MatTableDataSource(this.DataCLR);
        this.onFilterValueChange();
        this.SavedFilters = new MyFilter();
        this.SavedFilters = JSON.parse(localStorage.getItem('AutomatedFilters'));
        if(this.SavedFilters == null){
          this.RecordStatusFilter.setValue(['Active']);
        }else{
          this.ClientFilter.setValue(this.SavedFilters.Client);
          this.RevenueIDFilter.setValue(this.SavedFilters.RevenueID);
          this.iMeet_Workspace_TitleFilter.setValue(this.SavedFilters.iMeet_Workspace_Title);
          this.CreatedDate_cFilter.setValue(this.SavedFilters.CreatedDate_c);
          this.Implementation_TypeFilter.setValue(this.SavedFilters.Implementation_Type);
          this.Pipeline_statusFilter.setValue(this.SavedFilters.Pipeline_status);
          this.Pipeline_commentsFilter.setValue(this.SavedFilters.Pipeline_comments);
          this.Service_configurationFilter.setValue(this.SavedFilters.Service_configuration);
          this.Service_locationFilter.setValue(this.SavedFilters.Service_location);
          this.GlobalCISDQSLeadFilter.setValue(this.SavedFilters.GlobalCISDQSLead);
          this.OBT_Reseller___DirectFilter.setValue(this.SavedFilters.OBT_Reseller___Direct);
          this.Assignment_date_cFilter.setValue(this.SavedFilters.Assignment_date_c);
          this.UpdateOn_cFilter.setValue(this.SavedFilters.UpdateOn_c);
          this.OppVolume_cFilter.setValue(this.SavedFilters.OppVolume);
          this.RevenueVolumeUSDFilter.setValue(this.SavedFilters.RevenueVolumeUSD);
          this.RegionFilter.setValue(this.SavedFilters.Region);
          this.CountryFilter.setValue(this.SavedFilters.Country);
          this.OwnerShipFilter.setValue(this.SavedFilters.OwnerShip);
          // this.GoLiveDate_cFilter.setValue(this.SavedFilters.GoLiveDate_c);
          this.GoLiveDate_cSFilter.setValue(this.SavedFilters.GoLiveDate_c);
          this.GoLiveDate_cEFilter.setValue(this.SavedFilters.GoLiveDate_cE);
          this.ProjectStartDate_cFilter.setValue(this.SavedFilters.ProjectStart_ForCycleTime_c);
          this.CycleTimeFilter.setValue(this.SavedFilters.CycleTime);
          this.ProjectStatusFilter.setValue(this.SavedFilters.ProjectStatus);
          this.Milestone__Reason_CodeFilter.setValue(this.SavedFilters.Milestone__Reason_Code);
          this.PerCompletedFilter.setValue(this.SavedFilters.PerCompleted);
          this.CountryStatusFilter.setValue(this.SavedFilters.CountryStatus);
          this.ProjectLevelFilter.setValue(this.SavedFilters.ProjectLevel);
          this.CompletedDate_cFilter.setValue(this.SavedFilters.CompletedDate_c);
          this.GlobalProjectManagerFilter.setValue(this.SavedFilters.GlobalProjectManager);
          this.RegionalProjectManagerFilter.setValue(this.SavedFilters.RegionalProjectManager);
          this.AssigneeFullNameFilter.setValue(this.SavedFilters.AssigneeFullName);
          this.GlobalCISOBTLeadFilter.setValue(this.SavedFilters.GlobalCISOBTLead);
          this.RegionalCISOBTLeadFilter.setValue(this.SavedFilters.RegionalCISOBTLead);
          this.LocalDigitalOBTLeadFilter.setValue(this.SavedFilters.LocalDigitalOBTLead);
          this.LocalDigitalAdHocSupportFilter.setValue(this.SavedFilters.LocalDigitalAdHocSupport);
          this.GlobalCISPortraitLeadFilter.setValue(this.SavedFilters.GlobalCISPortraitLead);
          this.RegionalCISPortraitLeadFilter.setValue(this.SavedFilters.RegionalCISPortraitLead);
          this.GlobalCISHRFeedSpecialistFilter.setValue(this.SavedFilters.GlobalCISHRFeedSpecialist);
          this.ActivityTypeFilter.setValue(this.SavedFilters.ActivityType);
          this.GDSFilter.setValue(this.SavedFilters.GDS);
          this.MilestoneTitleFilter.setValue(this.SavedFilters.MilestoneTitle);
          this.Group_NameFilter.setValue(this.SavedFilters.Group_Name);
          this.Milestone__Project_NotesFilter.setValue(this.SavedFilters.Milestone__Project_Notes);
          this.Milestone__Closed_Loop_OwnerFilter.setValue(this.SavedFilters.Milestone__Closed_Loop_Owner);
          this.Workspace__ELT_Overall_StatusFilter.setValue(this.SavedFilters.Workspace__ELT_Overall_Status);
          this.Workspace__ELT_Overall_CommentsFilter.setValue(this.SavedFilters.Workspace__ELT_Overall_Comments);
          this.Customer_Row_IDFilter.setValue(this.SavedFilters.Customer_Row_ID);
          this.Opportunity_IDFilter.setValue(this.SavedFilters.Opportunity_ID);
          this.AccountOwnerFilter.setValue(this.SavedFilters.AccountOwner);
          this.Sales_Stage_NameFilter.setValue(this.SavedFilters.Sales_Stage_Name);
          this.Opportunity_TypeFilter.setValue(this.SavedFilters.Opportunity_Type);
          this.Revenue_StatusFilter.setValue(this.SavedFilters.Revenue_Status);
          this.Revenue_Opportunity_TypeFilter.setValue(this.SavedFilters.Revenue_Opportunity_Type);
          this.Opportunity_OwnerFilter.setValue(this.SavedFilters.Opportunity_Owner);
          this.Opportunity_CategoryFilter.setValue(this.SavedFilters.Opportunity_Category);
          this.Revenue_Total_TransactionsFilter.setValue(this.SavedFilters.Revenue_Total_Transactions);
          this.Line_Win_ProbabilityFilter.setValue(this.SavedFilters.Line_Win_Probability);
          this.Implementation_Fee__PSD_Filter.setValue(this.SavedFilters.Implementation_Fee__PSD_);
          this.DataDescriptionFilter.setValue(this.SavedFilters.DataDescription);
          this.Project_EffortFilter.setValue(this.SavedFilters.Project_Effort);
          this.AccountCategoryFilter.setValue(this.SavedFilters.AccountCategory);
          this.ImplementationReadyFilter.setValue(this.SavedFilters.ImplementationReady);
          this.SOWStatusFilter.setValue(this.SavedFilters.SOWStatus);
          this.ComplexityScoreFilter.setValue(this.SavedFilters.ComplexityScore);
          this.RecordStatusFilter.setValue(this.SavedFilters.RecordStatus);
          this.DataSourceTypeFilter.setValue(this.SavedFilters.DataSourceType);
          this.Date_added_to_the_CLR_cFilter.setValue(this.SavedFilters.Date_added_to_the_CLR_c);
          this.CheckCommentsFilter.setValue(this.SavedFilters.CheckComments);
        }
        this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
        this.FilteredCount = this.dataSource.filteredData.length;
        this.isLoading = false;
        this.dashboard.ShowSpinnerHandler(false);
      }else{
        this.isLoading = false;
        alert("Something went wrong,Please try again later");
        this.dashboard.ShowSpinnerHandler(false);
      }
    },error => (this.isLoading = false))
  }
  ResetFilter(){
    this.isLoading = true;
    // localStorage.removeItem('Filters');
    this.timer = timer(3000); // 5000 millisecond means 5 seconds
    this.subscription = this.timer.subscribe(() => {
      localStorage.removeItem('AutomatedFilters');
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
      this.ClientFilter.setValue("");
      this.RevenueIDFilter.setValue("");
      this.iMeet_Workspace_TitleFilter.setValue("");
      this.CreatedDate_cFilter.setValue("");
      this.Implementation_TypeFilter.setValue("");
      this.Pipeline_statusFilter.setValue("");
      this.Pipeline_commentsFilter.setValue("");
      this.Service_configurationFilter.setValue("");
      this.GlobalCISDQSLeadFilter.setValue("");
      this.Service_locationFilter.setValue("");
      this.OBT_Reseller___DirectFilter.setValue("");
      this.Assignment_date_cFilter.setValue("");
      this.UpdateOn_cFilter.setValue("");
      this.OppVolume_cFilter.setValue("");
      this.RegionFilter.setValue("");
      this.CountryFilter.setValue("");
      this.OwnerShipFilter.setValue("");
      // this.GoLiveDate_cFilter.setValue("");
      this.GoLiveDate_cSFilter.setValue("");
      this.GoLiveDate_cEFilter.setValue("");
      this.ProjectStartDate_cFilter.setValue("");
      this.CycleTimeFilter.setValue("");
      this.ProjectStatusFilter.setValue("");
      this.Milestone__Reason_CodeFilter.setValue("");
      this.PerCompletedFilter.setValue("");
      this.CountryStatusFilter.setValue("");
      this.ProjectLevelFilter.setValue("");
      this.CompletedDate_cFilter.setValue("");
      this.GlobalProjectManagerFilter.setValue("");
      this.RegionalProjectManagerFilter.setValue("");
      this.AssigneeFullNameFilter.setValue("");
      this.GlobalCISOBTLeadFilter.setValue("");
      this.RegionalCISOBTLeadFilter.setValue("");
      this.LocalDigitalOBTLeadFilter.setValue("");
      this.LocalDigitalAdHocSupportFilter.setValue("");
      this.GlobalCISPortraitLeadFilter.setValue("");
      this.RegionalCISPortraitLeadFilter.setValue("");
      this.ActivityTypeFilter.setValue("");
      this.GDSFilter.setValue("");
      this.GlobalCISHRFeedSpecialistFilter.setValue("");
      this.MilestoneTitleFilter.setValue("");
      this.Group_NameFilter.setValue("");
      this.Milestone__Project_NotesFilter.setValue("");
      this.Milestone__Closed_Loop_OwnerFilter.setValue("");
      this.Workspace__ELT_Overall_StatusFilter.setValue("");
      this.Workspace__ELT_Overall_CommentsFilter.setValue("");
      this.Customer_Row_IDFilter.setValue("");
      this.Opportunity_IDFilter.setValue("");
      this.AccountOwnerFilter.setValue("");
      this.Sales_Stage_NameFilter.setValue("");
      this.Opportunity_TypeFilter.setValue("");
      this.Revenue_StatusFilter.setValue("");
      this.Revenue_Opportunity_TypeFilter.setValue("");
      this.Opportunity_OwnerFilter.setValue("");
      this.Opportunity_CategoryFilter.setValue("");
      this.Revenue_Total_TransactionsFilter.setValue("");
      this.Line_Win_ProbabilityFilter.setValue("");
      this.Implementation_Fee__PSD_Filter.setValue("");
      this.DataDescriptionFilter.setValue("");
      this.Project_EffortFilter.setValue("");
      this.ImplementationReadyFilter.setValue("");
      this.AccountCategoryFilter.setValue("");
      this.SOWStatusFilter.setValue("");
      this.ComplexityScoreFilter.setValue("");
      this.RecordStatusFilter.setValue(["Active"]);
      this.DataSourceTypeFilter.setValue("");
      this.Date_added_to_the_CLR_cFilter.setValue("");
      this.CheckCommentsFilter.setValue("");
      // set showloader to false to hide loading div from view after 5 seconds
      this.isLoading = false;
    });
    // this.isLoading = false;
  }     
  private subscription: Subscription;
  private timer: Observable<any>;
  openDialog(): void {
    const dialogRef = this.dialog.open(CLRCommentdailog, {
      // width: '400px',
      data: {Dailog_Comment: this.Dailog_Comment,Dailog_Client : this.Dailog_Client,Dailog_RevenueID : this.Dailog_RevenueID}
    });
    dialogRef.afterClosed().subscribe(result => {
      //this.Comment = result;
      // this.GetData();
    });
  }
  ShowComment(Dailog_Client : string,Dailog_RevenueID : string,Dailog_Comment : string){
    this.Dailog_Client = Dailog_Client;
    this.Dailog_RevenueID = Dailog_RevenueID;
    this.Dailog_Comment = Dailog_Comment;
    this.openDialog();
  }
  openLink(WorkSpace : string){
    // var Hyperlink = "https://cwt.imeetcentral.com/"+ WorkSpace.replace(/[^\w\s]/gi,"")+"/";
    var Hyperlink  : string = "https://cwt.imeetcentral.com/"+WorkSpace.replace(/\s/g, "")+"/";
    window.open(Hyperlink);
  }
  exportCRM(){
    this.dashboard.ShowSpinnerHandler(true);
    this.service.CRMExport().subscribe(data =>{
      if(data.code == 200){
        this.service.PSDExport().subscribe(psddata =>{
          if(data.code == 200){
            const CustomizedData = data.Data.map(o => {
              return {
                'Revenue_Id': o.Revenue_Id,
                'Account Name' : o.Account_Name,
                'Account Owner' : o.Account_Owner,
                'Customer Row ID' : o.Customer_Row_ID,
                'BT Account Record Type' : o.BT_Account_Record_Type,
                'Company Alias' : o.Company_Alias,
                'Opportunity ID' : o.Opportunity_ID,
                'Description' : o.Description,
                'Industry' : o.Industry,
                'BT Current Service Configuration' : o.BT_Current_Service_Configuration,
                'BT Current GDS' : o.BT_Current_GDS,
                'BT Current Online Booking Tool' : o.BT_Current_Online_Booking_Tool,
                'BT Incumbent' : o.BT_Incumbent,
                'Opportunity Name'  : o.Opportunity_Name,
                'Line of Business' : o.Line_of_Business,
                'Opportunity Owner' : o.Opportunity_Owner,
                'Close Date' : o.Close_Date,
                'Sales Stage Name' : o.Sales_Stage_Name,
                'Line Win Probability' : o.Line_Win_Probability,
                'Opportunity Type' : o.Opportunity_Type,
                'Opportunity Category' : o.Opportunity_Category,
                'Opportunity Region' : o.Opportunity_Region,
                'Next Step' : o.Next_Step,
                'Country Scope' : o.Country_Scope,
                'Energy Resources Marine' : o.Energy__Resources___Marine,
                'Opportunity Scope' : o.Opportunity_Scope,
                'Opportunity Total Transactions' : o.Opportunity_Total_Transactions,
                'Opportunity Total Volume USD' : o.Opportunity_Total_Volume_USD,
                'Awarded Date' : o.Awarded_Date,
                'LOI Date' : o.LOI_Date,
                'Country' : o.Country,
                'Ownership Revenue' : o.Ownership__Revenue_,
                'Region Revenue' : o.Region__Revenue_,
                'Revenue Air Volume USD' : o.Revenue_Air_Volume_USD,
                'Revenue Car Volume USD' : o.Revenue_Car_Volume_USD,
                'Revenue Rail Volume USD' : o.Revenue_Rail_Volume_USD,
                'Revenue Total Transactions' : o.Revenue_Total_Transactions,
                'Transactions Air' : o.Transactions__Air,
                'Transactions Car' : o.Transactions__Car,
                'Transactions Hotel' : o.Transactions__Hotel,
                'Transactions Rail' : o.Transactions__Rail,
                'Revenue Total Volume USD' : o.Revenue_Total_Volume_USD,
                'Revenue Hotel Volume USD' : o.Revenue_Hotel_Volume_USD,
                'Total Awarded Volume USD' : o.Total_Awarded_Volume_USD,
                'Total Up Sell Volume USD' : o.Total_Up_Sell_Volume_USD,
                'GDS' : o.GDS,
                'Estimated Country Go Live Date' : o.Estimated_Country_Go_Live_Date,
                'OBT' : o.OBT,
                'Estimated Implementation Start Date' : o.Estimated_Implementation_Start_Date,
                'BT Incumbent Agency' : o.BT_Incumbent_Agency,
                'Revenue Opportunity Type' : o.Revenue_Opportunity_Type,
                'Revenue Status' : o.Revenue_Status,
                'Last Update Date' : o.Last_Update_Date
              };
            });
            const PSDCustomizedData = psddata.Data.map(o =>{
              return {
                "Created Date" : o.Created_Date,
                "Last Update Date" : o.Last_Update_Date,
                "Requestor" : o.Requestor,
                "Account Name" : o.Account_Name,
                "Account Owner" : o.Account_Owner,
                "Customer Row ID" : o.Customer_Row_ID,
                "Account Category" : o.Account_Category,
                "BT Account Record Type" : o.BT_Account_Record_Type,
                "Company Alias" : o.Company_Alias,
                "Opportunity ID" : o.Opportunity_ID,
                "Description" : o.Description,
                "Industry" : o.Industry,
                "BT Current Service Configuration" : o.BT_Current_Service_Configuration,
                "BT Current GDS" : o.BT_Current_GDS,
                "BT Current Online Booking Tool" : o.BT_Current_Online_Booking_Tool,
                "BT Incumbent" : o.BT_Incumbent,
                "Opportunity Name" : o.Opportunity_Name,
                "Product Name" : o.Product_Name,
                "Line of Business" : o.Line_of_Business,
                "Opportunity Owner" : o.Opportunity_Owner,
                "Close Date" : o.Close_Date,
                "Sales Stage Name" : o.Sales_Stage_Name,
                "Line Win Probability" : o.Line_Win_Probability,
                "Initiative Name" : o.Initiative_Name,
                "Opportunity Type" : o.Opportunity_Type,
                "Opportunity Region" : o.Opportunity_Region,
                "Country Scope" : o.Country_Scope,
                "Energy Resources Marine" : o.Energy__Resources___Marine,
                "Invoicing Period" : o.Invoicing_Period,
                "Pricing Model" : o.Pricing_Model,
                "PSD Price per Transaction" : o.PSD_Price_per_Transaction,
                "Total Transactions" : o.Total_Transactions,
                "Country" : o.Country,
                "Region Revenue" : o.Region__Revenue_,
                "Implementation Status" : o.Implementation_Status,
                "Total Revenue USD" : o.Total_Revenue_USD,
                "Estimated Implementation Start Date" : o.Estimated_Implementation_Start_Date,
                "Implementation End Date" : o.Implementation_End_Date,
                "Implementation Fee" : o.Implementation_Fee,
                "Go Live Date" : o.Go_Live_Date,
                "Revenue Car Volume USD" : o.Revenue_Car_Volume_USD,
                "Revenue Status" : o.Revenue_Status,
                "Revenue Id" : o.Revenue_Id,
              }
            });
            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(CustomizedData);
            const psdworksheet : XLSX.WorkSheet = XLSX.utils.json_to_sheet(PSDCustomizedData);
            const workbook: XLSX.WorkBook = { Sheets: { 'CRM': worksheet, 'PSD' : psdworksheet }, SheetNames: ['CRM','PSD'] };
            const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', compression : true });
            this.saveAsExcelFile(excelBuffer, 'CRMData');
          }
          else{
            alert("Something went wrong,Please try again later");
          }
        })
      }else{
        alert("Something went wrong,Please try again later");
      }
      this.service.UsersUsageofReports(this.LoginUID,"Automated CLR","CRM Export").subscribe(data =>{
      })
      this.dashboard.ShowSpinnerHandler(false);
    })
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'text/csv'
    });
    // FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    FileSaver.saveAs(data, fileName + ' '+ new Date().toLocaleDateString()+ ".csv");
  }
  exportCLR(){
    this.dashboard.ShowSpinnerHandler(true);
    this.service.GetCLRManualData().subscribe(data =>{
      if(data.code == 200){
        this.DataCLR = data.Data;
        for(let i = 0;i<data.Data.length;i++){
          if(this.DataCLR[i].Date_added_to_the_CLR == null){
            this.DataCLR[i].Date_added_to_the_CLR = null;
          }else{
            this.DataCLR[i].Date_added_to_the_CLR = new Date(this.DataCLR[i].Date_added_to_the_CLR);
          }
          if(this.DataCLR[i].Assignment_date == null){
            this.DataCLR[i].Assignment_date = null;
          }else{
            this.DataCLR[i].Assignment_date = new Date(this.DataCLR[i].Assignment_date);
          }
          if(this.DataCLR[i].UpdateOn == null){
            this.DataCLR[i].UpdateOn = null;
          }else{
            this.DataCLR[i].UpdateOn = new Date(this.DataCLR[i].UpdateOn);
          }
          if(this.DataCLR[i].GoLiveDate == null){
            this.DataCLR[i].GoLiveDate = null;
          }else{
            this.DataCLR[i].GoLiveDate = new Date(this.DataCLR[i].GoLiveDate);
          }
          if(this.DataCLR[i].CompletedDate == null){
            this.DataCLR[i].CompletedDate = null;
          }else{
            this.DataCLR[i].CompletedDate = new Date(this.DataCLR[i].CompletedDate);
          }
          if(this.DataCLR[i].CreatedDate == null){
            this.DataCLR[i].CreatedDate = null;
          }else{
            this.DataCLR[i].CreatedDate = new Date(this.DataCLR[i].CreatedDate);
          }
          if(this.DataCLR[i].ExternalKickoffDuedate == null){
            this.DataCLR[i].ExternalKickoffDuedate = null;
          }else{
            this.DataCLR[i].ExternalKickoffDuedate = new Date(this.DataCLR[i].ExternalKickoffDuedate);
          }
          if(this.DataCLR[i].ProjectStart_ForCycleTime == null){
            this.DataCLR[i].ProjectStart_ForCycleTime = null;
          }else{
            this.DataCLR[i].ProjectStart_ForCycleTime = new Date(this.DataCLR[i].ProjectStart_ForCycleTime);
          }
          if(this.DataCLR[i].MilestoneDueDate == null){
            this.DataCLR[i].MilestoneDueDate = null;
          }else{
            this.DataCLR[i].MilestoneDueDate = new Date(this.DataCLR[i].MilestoneDueDate);
          }
          if(this.DataCLR[i].AwardedDate == null){
            this.DataCLR[i].AwardedDate = null;
          }else{
            this.DataCLR[i].AwardedDate = new Date(this.DataCLR[i].AwardedDate);
          }
          if(this.DataCLR[i].ClosedDate == null){
            this.DataCLR[i].ClosedDate = null;
          }else{
            this.DataCLR[i].ClosedDate = new Date(this.DataCLR[i].ClosedDate);
          }
        }
        const CustomizedData = this.DataCLR.map(o => {
          return {
            'CLRID' : o.CLRID,
            'Client': o.Client == "---" ? "" : o.Client,
            'Revenue ID' : o.RevenueID == "---" ? "" : o.RevenueID,
            'Month-Year' : o.YearMonth,
            'Country' : o.Country == "---" ? "" : o.Country,
            'Created Date' : o.CreatedDate,
            'iMeet Workspace Title' : o.iMeet_Workspace_Title == "---" ? "" : o.iMeet_Workspace_Title,
            'Implementation Type' : o.Implementation_Type == "---" ? "" : o.Implementation_Type,
            'CountryCode' : o.CountryCode == "---" ? "" : o.CountryCode,
            'Pipeline status' : o.Pipeline_status == "---" ? "" : o.Pipeline_status,
            'Pipeline comments' : o.Pipeline_comments == "---" ? "" : o.Pipeline_comments,
            'Service location' : o.Service_configuration == "---" ? "" : o.Service_location,
            'Service configuration' : o.Service_configuration == "---" ? "" : o.Service_configuration,
            'OBT Type' : o.OBT_Reseller___Direct == "---" ? "" : o.OBT_Reseller___Direct,
            //Servicing_location : o.Servicing_location,
            'Assignment date' : o.Assignment_date,
            'Last Updated On' : o.UpdateOn,
            'Opportunity Total Volume USD' : o.OppVolume,
            //New_Business_volume__US___c : o.New_Business_volume__US___c,
            'Revenue Volume USD' : o.RevenueVolumeUSD,
            'Region Opportunity'  : o.Region,
            'OwnerShip Revenue' : o.OwnerShip == "---" ? "" : o.OwnerShip,
            'Project Start Date' : o.ProjectStart_ForCycleTime,
            'Task Go Live Date' : o.GoLiveDate,
            'Cycle Time' : o.CycleTime,
            'iMeet Milestone Project Status' : o.ProjectStatus == "---" ? "" : o.ProjectStatus,
            'Milestone Reason Code' : o.Milestone__Reason_Code == "---" ? "" : o.Milestone__Reason_Code,
            '% Completed' : o.PerCompleted == "---" ? "" : o.PerCompleted,
            'iMeet Milestone Country Status' : o.CountryStatus == "---" ? "" : o.CountryStatus,
            'iMeet Project Level' : o.ProjectLevel == "---" ? "" : o.ProjectLevel,
            'Completed Date' : o.CompletedDate,
            'Milestone Due Date' : o.MilestoneDueDate,
            'Workspace Project Owner' : o.ProjectOwner == "---" ? "" : o.ProjectOwner,
            'Global Project Manager' : o.GlobalProjectManager == "---" ? "" : o.GlobalProjectManager,
            'Regional Project Manager' : o.RegionalProjectManager == "---" ? "" : o.RegionalProjectManager,
            'Assignee Full Name' : o.AssigneeFullName == "---" ? "" : o.AssigneeFullName,
            'Global CIS DQS Lead' : o.AssigneeFullName == "---" ? "" : o.GlobalCISDQSLead,
            'Global Digital OBT Lead' : o.GlobalCISOBTLead == "---" ? "" : o.GlobalCISOBTLead,
            'Regional Digital OBT Lead' : o.RegionalCISOBTLead == "---" ? "" : o.RegionalCISOBTLead,
            'Local Digital OBT Lead' : o.LocalDigitalOBTLead == "---" ? "" : o.LocalDigitalOBTLead,
            'Local Digital AdHoc Support' : o.LocalDigitalAdHocSupport == "---" ? "" : o.LocalDigitalAdHocSupport,
            'Global Digital Portrait Lead' : o.GlobalCISPortraitLead == "---" ? "" : o.GlobalCISPortraitLead,
            'Regional Digital Portrait Lead' : o.RegionalCISPortraitLead == "---" ? "" : o.RegionalCISPortraitLead,
            'Global Digital HR Feed Special list' : o.GlobalCISHRFeedSpecialist == "---" ? "" : o.GlobalCISHRFeedSpecialist,
            'GDS' : o.GDS == "---" ? "" : o.GDS,
            'Digital Team Activity Type' : o.ActivityType == "---" ? "" : o.ActivityType,
            'Complexity Score' : o.ComplexityScore,
            'Milestone Title' : o.MilestoneTitle == "---" ? "" : o.MilestoneTitle,
            'Milestone Record ID Key' : o.Milestone__Record_ID_Key == "---" ? "" : o.Milestone__Record_ID_Key,
            'Group Name' : o.Group_Name == "---" ? "" : o.Group_Name,
            'Milestone Project Notes' : o.Milestone__Project_Notes == "---" ? "" : o.Milestone__Project_Notes,
            'Milestone Closed Loop Owner' : o.Milestone__Closed_Loop_Owner == "---" ? "" : o.Milestone__Closed_Loop_Owner,
            'Workspace ELT Overall Status' : o.Workspace__ELT_Overall_Status == "---" ? "" : o.Workspace__ELT_Overall_Status,
            'Workspace ELT Overall Comments' : o.Workspace__ELT_Overall_Comments == "---" ? "" : o.Workspace__ELT_Overall_Comments,
            'Customer Row ID' : o.Customer_Row_ID,
            'Opportunity ID' : o.Opportunity_ID,
            // 'Account Name' : o.Account_Name == "---" ? "" : o.Account_Name,
            'Account Owner' : o.Account_Name == "---" ? "" : o.AccountOwner,
            'Sales Stage Name' : o.Sales_Stage_Name == "---" ? "" : o.Sales_Stage_Name,
            'Opportunity Type' : o.Opportunity_Type == "---" ? "" : o.Opportunity_Type,
            'Revenue Status' : o.Revenue_Status == "---" ? "" : o.Revenue_Status,
            'Revenue Opportunity Type' : o.Revenue_Opportunity_Type == "---" ? "" : o.Revenue_Opportunity_Type,
            'Opportunity Owner' : o.Opportunity_Owner == "---" ? "" : o.Opportunity_Owner,
            'Opportunity Category' : o.Opportunity_Category == "---" ? "" : o.Opportunity_Category,
            'Market Leader' : o.MarketLeader == "---" ? "" : o.MarketLeader,
            'Revenue Total Transactions' : o.Revenue_Total_Transactions,
            'Line Win Probability' : o.Line_Win_Probability,
            'Next Step' : o.Next_Step == "---" ? "" : o.Next_Step,
            'Implementation Fee PSD' : o.Implementation_Fee__PSD_,
            'Awarded Date' : o.AwardedDate,
            //'ExternalKickoffDuedate' : o.ExternalKickoffDuedate_c,
            'Milestone Type' : o.MilestoneType == "---" ? "" : o.MilestoneType,
            'Project Effort' : o.Project_Effort,
            'Description' : o.DataDescription == "---" ? "" : o.DataDescription,
            'Last Updated Date' : o.Date_added_to_the_CLR,
            'Go-Live Month' : o.GoLiveMonth == "---" ? "" : o.GoLiveMonth,
            'Go-Live Year' : o.GoLiveYear == "---" ? "" : o.GoLiveYear,
            'Quarter' : o.Quarter == "---" ? "" : o.Quarter,
            'Cycle Time Categories' : o.CycleTimeCategories,
            'Account Category' : o.AccountCategory,
            'SOW Status' : o.SOWStatus,
            'Implementation Ready' : o.ImplementationReady,
            'Record Status' : o.RecordStatus,
            'Data Source Type' : o.DataSourceType == "---" ? "" : o.DataSourceType,
          };
        });
        //this.dataSource = this.CLRData;
        // this.excelService.exportAsExcelFile(CustomizedData, 'CLRData');
        this.excelService.exportAsExcelFile(CustomizedData,'CLRData');
      }else{
        alert("Something went wrong,Please try again later");
      }
      this.service.UsersUsageofReports(this.LoginUID,"Automated CLR","CLR Export").subscribe(data =>{
      })
      this.dashboard.ShowSpinnerHandler(false);
    })
  }
  ReplicateCLR(){
    if(localStorage.getItem('AutomatedFilters') == null){
      localStorage.setItem('AutomatedFilters',JSON.stringify(this.filteredValues));
    }else{
      localStorage.removeItem('AutomatedFilters');
      localStorage.setItem('AutomatedFilters',JSON.stringify(this.filteredValues));
    }
    let p_data : ParsingData = {
      ButtonType : "Replicate",
      ManualID : null,
      Client : "",
      CLRID : "",
      //iMeet_Workspace_Title : "",
      //Date_added_to_the_CLR : null,
      Implementation_Type : "",
      //CLR_Country : "",
      Pipeline_status : "",
      Pipeline_comments : "",
      // Service_configuration : "",
      // OBT_Reseller___Direct : "",
      //Servicing_location : "",
      Assignment_date : null,
      RevenueID : null,
      Project_Effort : 0,
      GoLiveDate : null,
      ProjectStatus : "",
      ProjectLevel : "",
      GlobalProjectManager : "",
      RegionalProjectManager : "",
      AssigneeFullName : "",
      RecordStatus : "",
      SelectionType : "",
      DigitalTeam : this.DigitalTeamList
    }
    const dialogRef = this.dialog.open(ReplicateDailog, {
      data : p_data
    });
    dialogRef.afterClosed().subscribe(result => {
      this.SelectionType = result.SelectionType;
      if(this.SelectionType == "Cancel"){
      }else if(this.SelectionType == "Update" || this.SelectionType == "Replicate"){
        this.GetData();
        this.GenerateTracker();
      }else{
      }
    });
  }
  RowSelected(j,CLRID : number,ManualID : number,Client : string,iMeet_Workspace_Title : string,Date_added_to_the_CLR : Date,Implementation_Type : string,CLR_Country : string,Pipeline_status : string,Pipeline_comments : string,Service_configuration : string,OBT_Reseller___Direct : string,Servicing_location : string,Assignment_date : Date,New_Business_volume__US__ : number,RevenueID : number,Implementation_Fee__PSD_ : number,EMEA_Country_to_charge : string,EMEA_Client : string,EMEA_OBT_standard_fee : number,EMEA_Included_for_accrual : string,EMEA_Accrual_date : Date,EMEA_Scope_description : string,EMEA_Billing_notes : string,Manual_Entry__Wave_2__Wave_3__etc_ : string,Project_Effort : number,Priority : number,Resource_Status : string,Global_Project_Manager_replacement : string,Regional_Project_Manager_replacement : string,Milestone__Assignee__Full_Name_replacement : string,Global_CIS_OBT_Lead_replacement : string,Global_CIS_HR_Feed_Specialist_replacement : string,Global_CIS_Portrait_Lead_replacement : string,Global_CIS_RoomIT_Integration_Lead_replacement : string,GoLiveDate :Date,ProjectStatus : string,ProjectLevel : string,GlobalProjectManager : string,RegionalProjectManager : string,AssigneeFullName : string,RecordStatus : string,DataSourceType : string)
  {
    if(localStorage.getItem('AutomatedFilters') == null){
      localStorage.setItem('AutomatedFilters',JSON.stringify(this.filteredValues));
    }else{
      localStorage.removeItem('AutomatedFilters');
      localStorage.setItem('AutomatedFilters',JSON.stringify(this.filteredValues));
    }
    if(RevenueID >= 600000000000000){
      alert('Please use digital Team Button to Update this Record');
    }else{
      let p_data : ParsingData = {
        ButtonType : "Save",
        ManualID : ManualID,
        Client : Client,
        CLRID : CLRID+"",
        Implementation_Type : Implementation_Type,
        Pipeline_status : Pipeline_status,
        Pipeline_comments : Pipeline_comments,
        // Service_configuration : Service_configuration,
        // OBT_Reseller___Direct : OBT_Reseller___Direct,
        Assignment_date : Assignment_date,
        RevenueID : RevenueID,
        Project_Effort : Project_Effort,
        GoLiveDate : GoLiveDate,
        ProjectStatus : ProjectStatus,
        ProjectLevel : ProjectLevel,
        GlobalProjectManager : GlobalProjectManager,
        RegionalProjectManager : RegionalProjectManager,
        AssigneeFullName : AssigneeFullName,
        RecordStatus : RecordStatus,
        SelectionType : "",
        DigitalTeam : this.DigitalTeamList
      }
      const dialogRef = this.dialog.open(ProjectTeamDailog, {
        data : p_data
      });
      dialogRef.afterClosed().subscribe(result => {
        this.SelectionType = result[0].SelectionType;
        if(this.SelectionType == "Cancel"){
        }else if(this.SelectionType == "Update"){
          for(let i = 0;i<this.dataSource.data.length;i++){
            if(this.dataSource.data[i].Revenue_ID == result[0].RevenueID){
              if(result[0].Implementation_Type == null || result[0].Implementation_Type == undefined){
              }else{
                this.dataSource.data[i].Implementation_Type = result[0].Implementation_Type;
              }
              if(result[0].Pipeline_status == null || result[0].Pipeline_status == undefined){
              }else{
                this.dataSource.data[i].Pipeline_status = result[0].Pipeline_status;
              }
              if(result[0].Pipeline_comments == null || result[0].Pipeline_comments == undefined){
              }else{
                this.dataSource.data[i].Pipeline_comments = result[0].Pipeline_comments;
              }
              if(result[0].OBT_Reseller___Direct == null || result[0].OBT_Reseller___Direct == undefined){
              }else{
                this.dataSource.data[i].OBT_Reseller___Direct = result[0].OBT_Reseller___Direct;
              }
              if(result[0].Project_Effort == null || result[0].Project_Effort == undefined){
              }else{
                this.dataSource.data[i].Project_Effort = result[0].Project_Effort;
              }
              if(result[0].Record_Status == null || result[0].Record_Status == undefined){
              }else{
                this.dataSource.data[i].RecordStatus = result[0].Record_Status;
              }
              if(result[0].Service_configuration == null || result[0].Service_configuration == undefined){
              }else{
                this.dataSource.data[i].Service_configuration = result[0].Service_configuration;
              }
              if(result[0].AssignmentDate == null || result[0].AssignmentDate == undefined){
              }else{
                this.dataSource.data[i].Assignment_date_c = this.datepipe.transform(result[0].AssignmentDate, "yyyy-MM-dd");
              }
            }
          }
          this.GenerateTracker();
        }else if(this.SelectionType == "Update_p"){
          for(let i = 0;i<this.dataSource.data.length;i++){
            if(this.dataSource.data[i].Revenue_ID == result[0].RevenueID){
              if(result[0].Implementation_Type == null || result[0].Implementation_Type == undefined){
              }else{
                this.dataSource.data[i].Implementation_Type = result[0].Implementation_Type;
              }
              if(result[0].Pipeline_status == null || result[0].Pipeline_status == undefined){
              }else{
                this.dataSource.data[i].Pipeline_status = result[0].Pipeline_status;
              }
              if(result[0].Pipeline_comments == null || result[0].Pipeline_comments == undefined){
              }else{
                this.dataSource.data[i].Pipeline_comments = result[0].Pipeline_comments;
              }
              if(result[0].OBT_Reseller___Direct == null || result[0].OBT_Reseller___Direct == undefined){
              }else{
                this.dataSource.data[i].OBT_Reseller___Direct = result[0].OBT_Reseller___Direct;
              }
              if(result[0].Project_Effort == null || result[0].Project_Effort == undefined){
              }else{
                this.dataSource.data[i].Project_Effort = result[0].Project_Effort;
              }
              if(result[0].Record_Status == null || result[0].Record_Status == undefined){
              }else{
                this.dataSource.data[i].RecordStatus = result[0].Record_Status;
              }
              if(result[0].ProjectLevel == null || result[0].ProjectLevel == undefined){
              }else{
                this.dataSource.data[i].ProjectLevel = result[0].ProjectLevel;
              }
              if(result[0].Service_configuration == null || result[0].Service_configuration == undefined){
              }else{
                this.dataSource.data[i].Service_configuration = result[0].Service_configuration;
              }
              if(result[0].GlobalProjectManager == null || result[0].GlobalProjectManager == undefined){
              }else{
                this.dataSource.data[i].GlobalProjectManager = result[0].GlobalProjectManager;
              }
              if(result[0].RegionalProjectManager == null || result[0].RegionalProjectManager == undefined){
              }else{
                this.dataSource.data[i].RegionalProjectManager = result[0].RegionalProjectManager;
              }
              if(result[0].AssigneeFullName == null || result[0].AssigneeFullName == undefined){
              }else{
                this.dataSource.data[i].AssigneeFullName = result[0].AssigneeFullName;
              }
              if(result[0].DateGo_Live == null || result[0].DateGo_Live == undefined){
              }else{
                this.dataSource.data[i].GoLiveDate_c = this.datepipe.transform(result[0].DateGo_Live, "yyyy-MM-dd");
              }
              if(result[0].AssignmentDate == null || result[0].AssignmentDate == undefined){
              }else{
                this.dataSource.data[i].Assignment_date_c = this.datepipe.transform(result[0].AssignmentDate, "yyyy-MM-dd");
              }
            }
          }
          this.GenerateTracker();
        }else if(this.SelectionType == "Replicate"){
          this.GetData();
          this.GenerateTracker();
        }else{

        }
      });
    }
  }
  RowSelectedAudit(j,RevenueID : number){
    let p_data : CLRDialogData = {
      Dailog_Client : '',
      Dailog_RevenueID : RevenueID+'',
      Dailog_Comment : '',
    }
    const dialogRef = this.dialog.open(RecordLevelAuditLogdailog, {
      data : p_data
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  GenerateTracker(){
    this.service.GenerateTracker().subscribe(data=>{
    })
  }
  RowSelectedDigitalTeam(j,CLRID:string,DTID : string,RevenueID : number,ProjectStatus : string,GlobalCISOBTLead : string,RegionalCISOBTLead : string,LocalDigitalOBTLead : string,GlobalCISPortraitLead : string,RegionalCISPortraitLead : string,GlobalCISHRFeedSpecialist : string,GDS : string,ActivityType : string,ComplexityScore : number,Client : string,Country : string,Region : string,GoLiveDate : Date,ProjectStart_ForCycleTime : Date,Pipeline_comments : string,RecordStatus : string){
    if(localStorage.getItem('AutomatedFilters') == null){
      localStorage.setItem('AutomatedFilters',JSON.stringify(this.filteredValues));
    }else{
      localStorage.removeItem('AutomatedFilters');
      localStorage.setItem('AutomatedFilters',JSON.stringify(this.filteredValues));
    }
    if(RevenueID >= 600000000000000){
      let data : AdhocData = {
        Action : 'Update',
        AHID : '',
        RevenueID : RevenueID+"",
        Client : Client,
        StartDate : ProjectStart_ForCycleTime,
        GoLiveDate : GoLiveDate,
        Country : Country,
        Region : Region,
        Comments : Pipeline_comments,
        ProjectStatus : ProjectStatus,
        GlobalCISOBTLead : GlobalCISOBTLead,
        RegionalCISOBTLead : RegionalCISOBTLead,
        LocalDigitalOBTLead : LocalDigitalOBTLead,
        GlobalCISPortraitLead : GlobalCISPortraitLead,
        RegionalCISPortraitLead : RegionalCISPortraitLead,
        GlobalCISHRFeedSpecialist : GlobalCISHRFeedSpecialist,
        GDS : GDS,
        ComplexityScore : ComplexityScore+"",
        ActivityType : ActivityType,
        Status : RecordStatus,
      }
      this.NgIfAutomatedCLR = false;
      this.NgIfAdhocDisplay = true;
      this.AdhocData = data;
    }else{
      let p_data : DigitalTeamData = {
        DTID : DTID+"",
        CLRID : CLRID+"",
        RevenueID : RevenueID+"",
        GlobalCISOBTLead : GlobalCISOBTLead,
        RegionalCISOBTLead : RegionalCISOBTLead,
        GlobalCISPortraitLead : GlobalCISPortraitLead,
        RegionalCISPortraitLead : RegionalCISPortraitLead,
        GlobalCISHRFeedSpecialist : GlobalCISHRFeedSpecialist,
        LocalDigitalOBTLead : LocalDigitalOBTLead,
        ProjectStatus : ProjectStatus,
        GDS : GDS,
        ActivityType : ActivityType,
        ComplexityScore : ComplexityScore+"",
        DigitalTeam : this.DigitalTeamList
      }
      const dialogRef = this.dialog.open(DigitalTeamdailog, {
        data : p_data
      });
      dialogRef.afterClosed().subscribe(result => {
        this.SelectionType = result[0].SelectionType;
        if(this.SelectionType == "Cancel"){
        }else if(this.SelectionType == "Update_d"){
          for(let i = 0;i<this.dataSource.data.length;i++){
            if(this.dataSource.data[i].Revenue_ID == result[0].RevenueID){
              if(result[0].GlobalCISOBTLead == null || result[0].GlobalCISOBTLead == undefined){
              }else{
                this.dataSource.data[i].GlobalCISOBTLead = result[0].GlobalCISOBTLead;
              }
              if(result[0].RegionalCISOBTLead == null || result[0].RegionalCISOBTLead == undefined){
              }else{
                this.dataSource.data[i].RegionalCISOBTLead = result[0].RegionalCISOBTLead;
              }
              if(result[0].LocalDigitalOBTLead == null || result[0].LocalDigitalOBTLead == undefined){
              }else{
                this.dataSource.data[i].LocalDigitalOBTLead = result[0].LocalDigitalOBTLead;
              }
              if(result[0].GlobalCISPortraitLead == null || result[0].GlobalCISPortraitLead == undefined){
              }else{
                this.dataSource.data[i].GlobalCISPortraitLead = result[0].GlobalCISPortraitLead;
              }
              if(result[0].RegionalCISPortraitLead == null || result[0].RegionalCISPortraitLead == undefined){
              }else{
                this.dataSource.data[i].RegionalCISPortraitLead = result[0].RegionalCISPortraitLead;
              }
              if(result[0].GlobalCISHRFeedSpecialist == null || result[0].GlobalCISHRFeedSpecialist == undefined){
              }else{
                this.dataSource.data[i].GlobalCISHRFeedSpecialist = result[0].GlobalCISHRFeedSpecialist;
              }
              if(result[0].ActivityType == null || result[0].ActivityType == undefined){
              }else{
                this.dataSource.data[i].ActivityType = result[0].ActivityType;
              }
              if(result[0].GDS == null || result[0].GDS == undefined){
              }else{
                this.dataSource.data[i].GDS = result[0].GDS;
              }
              if(result[0].ComplexityScore == null || result[0].ComplexityScore == undefined){
              }else{
                this.dataSource.data[i].ComplexityScore = result[0].ComplexityScore;
              }
            }
          }
          this.GenerateTracker();
        }else{
        }
      });
    }
  }
  checkUncheckImplementationType(){
    if(this.masterImplementationType == true){
      this.Implementation_TypeFilter.setValue(this.Implementation_TypeList);
    }else{
      this.Implementation_TypeFilter.setValue("");
    }
  }
  onImplementationTypechange(){
    if(this.Implementation_TypeList.length == this.Implementation_TypeFilter.value.length){
      this.masterImplementationType = true;
    }else{
      this.masterImplementationType = false;
    }
  }
  onPipelineStatuschange(){
    if(this.Pipeline_statusList.length == this.Pipeline_statusFilter.value.length){
      this.masterPipelineStatus = true;
    }else{
      this.masterPipelineStatus = false;
    }
  }
  checkUncheckPipelineStatus(){
    if(this.masterPipelineStatus == true){
      this.Pipeline_statusFilter.setValue(this.Pipeline_statusList);
    }else{
      this.Pipeline_statusFilter.setValue("");
    }
  }
  onOBTTypechange(){
    if(this.OBTResellerList.length == this.OBT_Reseller___DirectFilter.value.length){
      this.masterOBTType = true;
    }else{
      this.masterOBTType = false;
    }
  }
  checkUncheckOBTType(){
    if(this.masterOBTType == true){
      this.OBT_Reseller___DirectFilter.setValue(this.OBTResellerList);
    }else{
      this.OBT_Reseller___DirectFilter.setValue("");
    }
  }
  onRegionchange(){
    if(this.RegionList.length == this.RegionFilter.value.length){
      this.masterRegion = true;
    }else{
      this.masterRegion = false;
    }
  }
  checkUncheckRegion(){
    if(this.masterRegion == true){
      this.RegionFilter.setValue(this.RegionList);
    }else{
      this.RegionFilter.setValue("");
    }
  }
  onActivityTypechange(){
    if(this.ActivityTypeList.length == this.ActivityTypeFilter.value.length){
      this.masterActivityType = true;
    }else{
      this.masterActivityType = false;
    }
  }
  checkUncheckActivityType(){
    if(this.masterActivityType == true){
      this.ActivityTypeFilter.setValue(this.ActivityTypeList);
    }else{
      this.ActivityTypeFilter.setValue("");
    }
  }
  onGDSchange(){
    if(this.GDSList.length == this.GDSFilter.value.length){
      this.masterGDS = true;
    }else{
      this.masterGDS = false;
    }
  }
  checkUncheckGDS(){
    if(this.masterGDS == true){
      this.GDSFilter.setValue(this.GDSList);
    }else{
      this.GDSFilter.setValue("");
    }
  }
  onOwnershipchange(){
    if(this.OwnerShipList.length == this.OwnerShipFilter.value.length){
      this.masterOwnership = true;
    }else{
      this.masterOwnership = false;
    }
  }
  checkUncheckOwnership(){
    if(this.masterOwnership == true){
      this.OwnerShipFilter.setValue(this.OwnerShipList);
    }else{
      this.OwnerShipFilter.setValue("");
    }
  }
  onCountryStatuschange(){
    if(this.CountryStatusList.length == this.CountryStatusFilter.value.length){
      this.masterCountryStatus = true;
    }else{
      this.masterCountryStatus = false;
    }
  }
  checkUncheckCountryStatus(){
    if(this.masterCountryStatus == true){
      this.CountryStatusFilter.setValue(this.CountryStatusList);
    }else{
      this.CountryStatusFilter.setValue("");
    }
  }
  onProjectStatuschange(){
    if(this.ProjectStatusList.length == this.ProjectStatusFilter.value.length){
      this.masterProjectStatus = true;
    }else{
      this.masterProjectStatus = false;
    }
  }
  checkUncheckProjectLevel(){
    if(this.masterProjectLevel == true){
      this.ProjectLevelFilter.setValue(this.ProjectLevelList);
    }else{
      this.ProjectLevelFilter.setValue("");
    }
  }
  onProjectLevelchange(){
    if(this.ProjectLevelList.length == this.ProjectLevelFilter.value.length){
      this.masterProjectLevel = true;
    }else{
      this.masterProjectLevel = false;
    }
  }
  checkUncheckProjectStatus(){
    if(this.masterProjectStatus == true){
      this.ProjectStatusFilter.setValue(this.ProjectStatusList);
    }else{
      this.ProjectStatusFilter.setValue("");
    }
  }
  checkUncheckGroupName(){
    if(this.masterGroupName == true){
      this.Group_NameFilter.setValue(this.Group_NameList);
    }else{
      this.Group_NameFilter.setValue("");
    }
  }
  onGroupNamechange(){
    if(this.Group_NameList.length == this.Group_NameFilter.value.length){
      this.masterGroupName = true;
    }else{
      this.masterGroupName = false;
    }
  }
  checkUncheckWorkspaceEltOverall(){
    if(this.masterWorkspaceEltOverallStatus == true){
      this.Workspace__ELT_Overall_StatusFilter.setValue(this.Workspace__ELT_Overall_StatusList);
    }else{
      this.Workspace__ELT_Overall_StatusFilter.setValue("");
    }
  }
  onWorkspaceEltOverallStatuschange(){
    if(this.Workspace__ELT_Overall_StatusList.length == this.Workspace__ELT_Overall_StatusFilter.value.length){
      this.masterWorkspaceEltOverallStatus = true;
    }else{
      this.masterWorkspaceEltOverallStatus = false;
    }
  }
  checkUncheckSalesStageName(){
    if(this.masterSalesStageName == true){
      this.Sales_Stage_NameFilter.setValue(this.Sales_Stage_NameList);
    }else{
      this.Sales_Stage_NameFilter.setValue("");
    }
  }
  onSalesStageNamechange(){
    if(this.Sales_Stage_NameList.length == this.Sales_Stage_NameFilter.value.length){
      this.masterSalesStageName = true;
    }else{
      this.masterSalesStageName = false;
    }
  }
  checkUncheckOpportunityType(){
    if(this.masterOpportunityType == true){
      this.Opportunity_TypeFilter.setValue(this.Opportunity_TypeList);
    }else{
      this.Opportunity_TypeFilter.setValue("");
    }
  }
  onOpportunityTypechange(){
    if(this.Opportunity_TypeList.length == this.Opportunity_TypeFilter.value.length){
      this.masterOpportunityType = true;
    }else{
      this.masterOpportunityType = false;
    }
  }
  checkUncheckRevenueStatus(){
    if(this.masterRevenueStatus == true){
      this.Revenue_StatusFilter.setValue(this.Revenue_StatusList);
    }else{
      this.Revenue_StatusFilter.setValue("");
    }
  }
  onRevenueStatuschange(){
    if(this.Revenue_StatusList.length == this.Revenue_StatusFilter.value.length){
      this.masterRevenueStatus = true;
    }else{
      this.masterRevenueStatus = false;
    }
  }
  checkUncheckRevenueOpportunityType(){
    if(this.masterRevenueOpportunityType == true){
      this.Revenue_Opportunity_TypeFilter.setValue(this.Revenue_Opportunity_TypeList);
    }else{
      this.Revenue_Opportunity_TypeFilter.setValue("");
    }
  }
  onRevenueOpportunitychange(){
    if(this.Revenue_Opportunity_TypeList.length == this.Revenue_Opportunity_TypeFilter.value.length){
      this.masterRevenueOpportunityType = true;
    }else{
      this.masterRevenueOpportunityType = false;
    }
  }
  checkUncheckOpportunityCategory(){
    if(this.masterOpportunityCategory == true){
      this.Opportunity_CategoryFilter.setValue(this.Opportunity_CategoryList);
    }else{
      this.Opportunity_CategoryFilter.setValue("");
    }
  }
  onOpportunityCategorychange(){
    if(this.Opportunity_CategoryList.length == this.Opportunity_CategoryFilter.value.length){
      this.masterOpportunityCategory = true;
    }else{
      this.masterOpportunityCategory = false;
    }
  }
  checkUncheckLineWin(){
    if(this.masterLineWin == true){
      this.Line_Win_ProbabilityFilter.setValue(this.Line_Win_ProbabilityList);
    }else{
      this.Line_Win_ProbabilityFilter.setValue("");
    }
  }
  onLineWinchange(){
    if(this.Line_Win_ProbabilityList.length == this.Line_Win_ProbabilityFilter.value.length){
      this.masterLineWin = true;
    }else{
      this.masterLineWin = false;
    }
  }
  checkUncheckRecordStatus(){
    if(this.masterRecordStatus == true){
      this.RecordStatusFilter.setValue(this.RecordStatusList);
    }else{
      this.RecordStatusFilter.setValue("");
    }
  }
  onRecordStatuschange(){
    if(this.RecordStatusList.length == this.RecordStatusFilter.value.length){
      this.masterRecordStatus = true;
    }else{
      this.masterRecordStatus = false;
    }
  }
  checkUncheckDatasourceType(){
    if(this.masterDatasourceType == true){
      this.DataSourceTypeFilter.setValue(this.DataSourceTypeList);
    }else{
      this.DataSourceTypeFilter.setValue("");
    }
  }
  onDatasourceTypechange(){
    if(this.DataSourceTypeList.length == this.DataSourceTypeFilter.value.length){
      this.masterDatasourceType = true;
    }else{
      this.masterDatasourceType = false;
    }
  }
}

@Component({
  selector: 'app-replicate',
  templateUrl: './replicate.component.html',
  styleUrls: ['./replicate.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ReplicateDailog {
  constructor(
    public datepipe : DatePipe,
    public service : DashboardServiceService,
    public dialogRef: MatDialogRef<ReplicateDailog>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ParsingData)
    {
      this.GlobalDigitalOBTLeadList_P = data.DigitalTeam;
      this.GlobalOBTDigitalTeamData.next(this.GlobalDigitalOBTLeadList_P.slice());
      this.RegionalDigitalOBTLeadList_P = data.DigitalTeam;
      this.RegionalOBTDigitalTeamData.next(this.RegionalDigitalOBTLeadList_P.slice());
      this.LocalDigitalOBTLeadList_P = data.DigitalTeam;
      this.LocalOBTDigitalTeamData.next(this.LocalDigitalOBTLeadList_P.slice());
      this.GlobalDigitalPortraitLeadList_P = data.DigitalTeam;
      this.GlobalPortraitDigitalTeamData.next(this.GlobalDigitalPortraitLeadList_P.slice());
      this.RegionalDigitalPortraitLeadList_P = data.DigitalTeam;
      this.RegionalPortraitDigitalTeamData.next(this.RegionalDigitalPortraitLeadList_P.slice());
      this.GlobalDigitalHRFeedSpeciaList_P = data.DigitalTeam;
      this.GlobalHRFeedDigitalTeamData.next(this.GlobalDigitalHRFeedSpeciaList_P.slice());
      // set screenWidth on page load
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      window.onresize = () => {
        // set screenWidth on screen size change
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
      };
    }
  todayDate : Date = new Date();
  screenWidth : number;
  screenHeight : number;
  dropdownSettings:IDropdownSettings;
  dropdownList = [];
  selectedItems = [];
  RevIDData : DropDownList[];
  SelectedData : DropDownList[];
  LoginUID : string;
  Selectallchecked : boolean;
  SelectallcheckedDigital : boolean;
  ManualRevenueID : number;
  ProjectLevel : string;
  Implementation_Type : string;
  Pipeline_status : string;
  Pipeline_comments : string;
  // Service_configuration : string;
  // OBT_Reseller___Direct = new FormControl();
  dateAssignment : Date;
  Project_Effort : number;
  Record_Status : string;
  GlobalDigitalOBTLeadList_P: FilterDigitalTeam[];RegionalDigitalOBTLeadList_P: FilterDigitalTeam[];
  LocalDigitalOBTLeadList_P: FilterDigitalTeam[];GlobalDigitalPortraitLeadList_P: FilterDigitalTeam[];
  RegionalDigitalPortraitLeadList_P: FilterDigitalTeam[];GlobalDigitalHRFeedSpeciaList_P: FilterDigitalTeam[];
  ComplexityScoreList_P;
  // GDS_P;
  ActivityType_P;
  GlobalCISOBTLead = new FormControl();
  RegionalCISOBTLead = new FormControl();
  LocalDigitalOBTLead = new FormControl();
  GlobalCISPortraitLead = new FormControl();
  RegionalCISPortraitLead = new FormControl();
  GlobalCISHRFeedSpecialist = new FormControl();
  ActivityType = new FormControl();
  ComplexityScore;
  GDS = new FormControl();
  // CS_disable : boolean = true;
  AssignePerson_R = new FormControl();
  RegionalManager_R = new FormControl();
  GlobalManager_R = new FormControl();
  GPMsearch = new FormControl();
  RPMsearch = new FormControl();
  AFNsearch = new FormControl();
  OBTsearch = new FormControl();
  GManagerList : FilterGlobalProjectManager[];
  RManagerList : FilterGlobalProjectManager[];
  LManagerList : FilterGlobalProjectManager[];
  ImpTypechecked : boolean;PStatuschecked : boolean;PCommentschecked : boolean;ServiceConfigchecked : boolean;
  OBTResellerchecked : boolean;AssignmentDatechecked : boolean;ProjectEffortchecked : boolean;Statuschecked : boolean;
  AssignePersonchecked : boolean;RegionalManagerchecked : boolean;GlobalManagerchecked : boolean;GoLiveDatechecked : boolean;
  ProjectLevelchecked : boolean;

  GlobalCISOBTLeadchecked : boolean;RegionalCISOBTLeadchecked : boolean;LocalDigitalOBTLeadchecked : boolean;
  GlobalCISPortraitLeadchecked : boolean;RegionalCISPortraitLeadchecked : boolean;GlobalCISHRFeedSpecialistchecked : boolean;
  ActivityTypechecked : boolean;Complexitychecked : boolean;
  // GDSchecked : boolean;
  
  
  GlobalCISOBTLeadsearch = new FormControl();
  RegionalCISOBTLeadsearch = new FormControl();
  LocalDigitalOBTLeadsearch = new FormControl();
  GlobalCISPortraitLeadsearch = new FormControl();
  RegionalCISPortraitLeadsearch = new FormControl();
  GlobalCISHRFeedSpecialistsearch = new FormControl();
  protected _onDestroy = new Subject<void>();
  OBTList : FilterOpportunityType[];
  public GPMData: ReplaySubject<FilterGlobalProjectManager[]> = new ReplaySubject<FilterGlobalProjectManager[]>(1);
  public RPMData: ReplaySubject<FilterGlobalProjectManager[]> = new ReplaySubject<FilterGlobalProjectManager[]>(1);
  public AFNData: ReplaySubject<FilterGlobalProjectManager[]> = new ReplaySubject<FilterGlobalProjectManager[]>(1);
  public GlobalOBTDigitalTeamData: ReplaySubject<FilterDigitalTeam[]> = new ReplaySubject<FilterDigitalTeam[]>(1);
  public RegionalOBTDigitalTeamData: ReplaySubject<FilterDigitalTeam[]> = new ReplaySubject<FilterDigitalTeam[]>(1);
  public LocalOBTDigitalTeamData: ReplaySubject<FilterDigitalTeam[]> = new ReplaySubject<FilterDigitalTeam[]>(1);
  public GlobalPortraitDigitalTeamData: ReplaySubject<FilterDigitalTeam[]> = new ReplaySubject<FilterDigitalTeam[]>(1);
  public RegionalPortraitDigitalTeamData: ReplaySubject<FilterDigitalTeam[]> = new ReplaySubject<FilterDigitalTeam[]>(1);
  public GlobalHRFeedDigitalTeamData: ReplaySubject<FilterDigitalTeam[]> = new ReplaySubject<FilterDigitalTeam[]>(1);
  public OBTData: ReplaySubject<FilterOpportunityType[]> = new ReplaySubject<FilterOpportunityType[]>(1);
  OnActivityTypeChecked(){
    if(this.ActivityTypechecked == true){
      this.Complexitychecked = true;
    }else{
      this.Complexitychecked = false;
    }
  }
  SearchValueChanges(){
    this.GlobalCISOBTLeadsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.GlobalOBTfilter();
      });
    this.RegionalCISOBTLeadsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.RegionalOBTfilter();
      });
    this.LocalDigitalOBTLeadsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.LocalOBTfilter();
      });
    this.GlobalCISPortraitLeadsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.GlobalPortraitfilter();
      });
    this.RegionalCISPortraitLeadsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.RegionalPortraitfilter();
      });
    this.GlobalCISHRFeedSpecialistsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.GlobalHRFeedfilter();
      });
    this.GPMsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.GPMfilter();
      });
    this.RPMsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.RPMfilter();
      });
    this.AFNsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.AFNfilter();
      });
    this.OBTsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.OBTfilter();
      });
  }
  protected AFNfilter() {
    if (!this.LManagerList) {
      return;
    }
    // get the search keyword
    let search = this.AFNsearch.value;
    if (!search) {
      this.AFNData.next(this.LManagerList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.AFNData.next(
      this.LManagerList.filter(manager => manager.GlobalProjectManager.toLowerCase().indexOf(search) > -1)
    );
  }
  protected GPMfilter() {
    if (!this.GManagerList) {
      return;
    }
    // get the search keyword
    let search = this.GPMsearch.value;
    if (!search) {
      this.GPMData.next(this.GManagerList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.GPMData.next(
      this.GManagerList.filter(manager => manager.GlobalProjectManager.toLowerCase().indexOf(search) > -1)
    );
  }
  protected RPMfilter() {
    if (!this.RManagerList) {
      return;
    }
    // get the search keyword
    let search = this.RPMsearch.value;
    if (!search) {
      this.RPMData.next(this.RManagerList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.RPMData.next(
      this.RManagerList.filter(manager => manager.GlobalProjectManager.toLowerCase().indexOf(search) > -1)
    );
  }
  protected GlobalOBTfilter() {
    if (!this.GlobalDigitalOBTLeadList_P) {
      return;
    }
    // get the search keyword
    let search = this.GlobalCISOBTLeadsearch.value;
    if (!search) {
      this.GlobalOBTDigitalTeamData.next(this.GlobalDigitalOBTLeadList_P.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.GlobalOBTDigitalTeamData.next(
      this.GlobalDigitalOBTLeadList_P.filter(manager => manager.Manager.toLowerCase().indexOf(search) > -1)
    );
  }
  protected RegionalOBTfilter() {
    if (!this.RegionalDigitalOBTLeadList_P) {
      return;
    }
    // get the search keyword
    let search = this.RegionalCISOBTLeadsearch.value;
    if (!search) {
      this.RegionalOBTDigitalTeamData.next(this.RegionalDigitalOBTLeadList_P.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.RegionalOBTDigitalTeamData.next(
      this.RegionalDigitalOBTLeadList_P.filter(manager => manager.Manager.toLowerCase().indexOf(search) > -1)
    );
  }
  protected LocalOBTfilter() {
    if (!this.LocalDigitalOBTLeadList_P) {
      return;
    }
    // get the search keyword
    let search = this.LocalDigitalOBTLeadsearch.value;
    if (!search) {
      this.LocalOBTDigitalTeamData.next(this.LocalDigitalOBTLeadList_P.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.LocalOBTDigitalTeamData.next(
      this.LocalDigitalOBTLeadList_P.filter(manager => manager.Manager.toLowerCase().indexOf(search) > -1)
    );
  }
  protected GlobalPortraitfilter() {
    if (!this.GlobalDigitalPortraitLeadList_P) {
      return;
    }
    // get the search keyword
    let search = this.GlobalCISPortraitLeadsearch.value;
    if (!search) {
      this.GlobalPortraitDigitalTeamData.next(this.GlobalDigitalPortraitLeadList_P.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.GlobalPortraitDigitalTeamData.next(
      this.GlobalDigitalPortraitLeadList_P.filter(manager => manager.Manager.toLowerCase().indexOf(search) > -1)
    );
  }
  protected RegionalPortraitfilter() {
    if (!this.RegionalDigitalPortraitLeadList_P) {
      return;
    }
    // get the search keyword
    let search = this.RegionalCISPortraitLeadsearch.value;
    if (!search) {
      this.RegionalPortraitDigitalTeamData.next(this.RegionalDigitalPortraitLeadList_P.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.RegionalPortraitDigitalTeamData.next(
      this.RegionalDigitalPortraitLeadList_P.filter(manager => manager.Manager.toLowerCase().indexOf(search) > -1)
    );
  }
  protected GlobalHRFeedfilter() {
    if (!this.GlobalDigitalHRFeedSpeciaList_P) {
      return;
    }
    // get the search keyword
    let search = this.GlobalCISHRFeedSpecialistsearch.value;
    if (!search) {
      this.GlobalHRFeedDigitalTeamData.next(this.GlobalDigitalHRFeedSpeciaList_P.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.GlobalHRFeedDigitalTeamData.next(
      this.GlobalDigitalHRFeedSpeciaList_P.filter(manager => manager.Manager.toLowerCase().indexOf(search) > -1)
    );
  }
  protected OBTfilter() {
    if (!this.OBTList) {
      return;
    }
    // get the search keyword
    let search = this.OBTsearch.value;
    if (!search) {
      this.OBTData.next(this.OBTList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.OBTData.next(
      this.OBTList.filter(manager => manager.Opportunity_Type.toLowerCase().indexOf(search) > -1)
    );
  }
  ngOnInit() {
    this.service.ListofLeadersManagers().subscribe(data =>{
      if(data.code == 200){
        var datas = { GlobalProjectManager : "---",isSelected : true};
        var datas1 = {GlobalProjectManager : "Not Required",isSelected : true};
        var datas2 = {GlobalProjectManager : "To Be Assigned",isSelected : true};
        data.FilterGlobalProjectManager.push(datas);
        data.FilterGlobalProjectManager.push(datas1);
        data.FilterGlobalProjectManager.push(datas2);
        this.GManagerList = data.FilterGlobalProjectManager;
        this.GPMData.next(this.GManagerList.slice());
        this.RManagerList = data.FilterGlobalProjectManager;
        this.RPMData.next(this.RManagerList.slice());
        this.LManagerList = data.FilterGlobalProjectManager;
        this.AFNData.next(this.LManagerList.slice());
        var data_obt = ["AeTM","Amadeus Cytric - Direct","Amadeus Cytric -  Reseller","B Plus","Concur Travel  - Direct","Concur Travel - Reseller","CWT Book2Go","CWT China online","Deem","GetThere - Direct","GetThere - Reseller","HRS","IATA Number Change","KDS - Direct","KDS - Reseller","No OBT","None","Offline","Onesto","Unspecified","Serko","Smart Traveller Online","TimeToGo","Traveldoo - Direct","Traveldoo - Reseller","Zillious Reseller"]
        this.OBTList = [];
        data_obt.forEach(item =>{
          this.OBTList.push({Opportunity_Type: item,isSelected: true});
        })
        this.OBTData.next(this.OBTList.slice());
      }
    })
    this.SearchValueChanges();
    // this.GDS_P = ["---","Amadeus","Sabre","TravelPort"];
    this.ActivityType_P = ["---","Ad-hoc","New Portrait and OBT Client Implementation","OBT Migration","Mergers/ Splits","Portrait Only","Modify Existing OBT Site","Client Top Consolidation","Add OBT to existing Country","Other","Trainline Implementation","Direct/Reseller OBT Conversion","FSC/GSC Migration","HR Feed & Portrait","Client OBT Trainings"];
    this.ActivityType.valueChanges.subscribe(value => {
      if(value == "---"){
        this.ComplexityScore = 0;
      }else if(value == "New Portrait and OBT Client Implementation"){
        this.ComplexityScore = 3;
      }else if(value == "OBT Migration"){
        this.ComplexityScore = 3
      }else if(value == "Mergers/ Splits"){
        this.ComplexityScore = 4
      }else if(value == "Portrait Only"){
        this.ComplexityScore = 1
      }else if(value == "Modify Existing OBT Site"){
        this.ComplexityScore = 1
      }else if(value == "Client Top Consolidation"){
        this.ComplexityScore = 3
      }else if(value == "Add OBT to existing Country"){
        this.ComplexityScore = 3
      }else if(value == "Other"){
        this.ComplexityScore = 1
      }else if(value == "Trainline Implementation"){
        this.ComplexityScore = 1
      }else if(value == "Direct/Reseller OBT Conversion"){
        this.ComplexityScore = 1
      }else if(value == "FSC/GSC Migration"){
        this.ComplexityScore = 3
      }else if(value == "HR Feed & Portrait"){
        this.ComplexityScore = 2
      }else if(value == "Client OBT Trainings"){
        this.ComplexityScore = 1
      }else if(value == "Ad-hoc"){
        this.ComplexityScore = 0;
      }else{
        this.ComplexityScore = 0
      }
    });
    this.LoginUID = localStorage.getItem("UID");
    if(this.LoginUID == "" || this.LoginUID == null){
      this.dialogRef.close();
    }else{
    }
    this.Selectallchecked = false;
    this.SelectallcheckedDigital = false;
    this.ImpTypechecked = false;
    this.PStatuschecked = false;
    this.GoLiveDatechecked = false;
    this.GlobalManagerchecked = false;
    this.RegionalManagerchecked = false;
    this.AssignePersonchecked = false;
    this.ProjectLevelchecked = false;
    this.PCommentschecked = false;
    this.ServiceConfigchecked = false;
    this.OBTResellerchecked = false;
    this.AssignmentDatechecked = false;
    this.ProjectEffortchecked = false;
    this.Statuschecked = false;
    this.GlobalCISOBTLeadchecked = false;
    this.RegionalCISOBTLeadchecked = false;
    this.LocalDigitalOBTLeadchecked = false;
    this.GlobalCISPortraitLeadchecked = false;
    this.RegionalCISPortraitLeadchecked = false;
    this.GlobalCISHRFeedSpecialistchecked = false;
    this.ActivityTypechecked = false;
    this.Complexitychecked = false;
    // this.GDSchecked = false;
    this.service.GetRevenueId().subscribe(data =>{
      if(data.code == 200){
        this.RevIDData = data.RevenueId;
        for(let i = 0;i<data.RevenueId.length;i++){
          this.RevIDData[i].item_id = i+1;
          if(data.RevenueId[i].Opportunity_ID == null ||data.RevenueId[i].Opportunity_ID == ""){
            data.RevenueId[i].Opportunity_ID = "0";
          }
          this.RevIDData[i].item_text = data.RevenueId[i].Workspace_Title+ ","+data.RevenueId[i].Region+","+data.RevenueId[i].Opportunity_ID + "," + data.RevenueId[i].RevenueID +","+data.RevenueId[i].CountryCode;
        }
        this.dropdownList = this.RevIDData;
        this.dropdownSettings = {
          singleSelection: false,
          idField: 'item_id',
          textField: 'item_text',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          itemsShowLimit: 10,
          allowSearchFilter: true,
          limitSelection: 100,
        };
      }
      else{
        alert(data.message);
      }
    })
  }
  checkUncheckSelectall(){
    if(this.Selectallchecked == true){
      this.Selectallchecked = true;
      this.ImpTypechecked = true;
      this.PStatuschecked = true;
      this.GoLiveDatechecked = true;
      this.GlobalManagerchecked = true;
      this.RegionalManagerchecked = true;
      this.AssignePersonchecked = true;
      this.ProjectLevelchecked = true;
      this.PCommentschecked = true;
      this.ServiceConfigchecked = true;
      this.OBTResellerchecked = true;
      this.AssignmentDatechecked = true;
      this.ProjectEffortchecked = true;
      this.Statuschecked = true;
    }else{
      this.Selectallchecked = false;
      this.ImpTypechecked = false;
      this.PStatuschecked = false;
      this.GoLiveDatechecked = false;
      this.GlobalManagerchecked = false;
      this.RegionalManagerchecked = false;
      this.AssignePersonchecked = false;
      this.ProjectLevelchecked = false;
      this.PCommentschecked = false;
      this.ServiceConfigchecked = false;
      this.OBTResellerchecked = false;
      this.AssignmentDatechecked = false;
      this.ProjectEffortchecked = false;
      this.Statuschecked = false;
    }
  }
  checkUncheckSelectallDigital(){
    if(this.SelectallcheckedDigital == true){
      this.SelectallcheckedDigital = true;
      this.GlobalCISOBTLeadchecked = true;
      this.RegionalCISOBTLeadchecked = true;
      this.LocalDigitalOBTLeadchecked = true;
      this.GlobalCISPortraitLeadchecked = true;
      this.RegionalCISPortraitLeadchecked = true;
      this.GlobalCISHRFeedSpecialistchecked = true;
      this.ActivityTypechecked = true;
      this.Complexitychecked = true;
      // this.GDSchecked = true;
    }else{
      this.SelectallcheckedDigital = false;
      this.GlobalCISOBTLeadchecked = false;
      this.RegionalCISOBTLeadchecked = false;
      this.LocalDigitalOBTLeadchecked = false;
      this.GlobalCISPortraitLeadchecked = false;
      this.RegionalCISPortraitLeadchecked = false;
      this.GlobalCISHRFeedSpecialistchecked = false;
      this.ActivityTypechecked = false;
      this.Complexitychecked = false;
      // this.GDSchecked = false;
    }
  }
  Errors : number = 0;
  ErrorMessage;
  DateGolive_R : Date;
  ErrorChecks(){
    this.ErrorMessage = "";
    if(this.ImpTypechecked == true && this.Implementation_Type == null){
      this.ErrorMessage += "Please Uncheck the Implementation Type or Select a value from dropdown" + '\n';
      this.Errors = this.Errors + 1;
    }
    if(this.PStatuschecked == true && this.Pipeline_status == null){
      this.ErrorMessage +="Please Uncheck the Pipeline Status or Select a value from dropdown" + '\n';
      this.Errors = this.Errors + 1;
    }
    // if(this.ServiceConfigchecked == true && this.Service_configuration == null){
    //   this.ErrorMessage +="Please Uncheck the Service Configuration or Enter a value in Text Box" + '\n';
    //   this.Errors = this.Errors + 1;
    // }
    // if(this.OBTResellerchecked == true && this.OBT_Reseller___Direct == null){
    //   this.ErrorMessage +="Please Uncheck the OBT Reseller Direct or Enter a value in Text Box" + '\n';
    //   this.Errors = this.Errors + 1;
    // }
    if(this.AssignmentDatechecked == true && this.dateAssignment == null){
      this.ErrorMessage +="Please Uncheck the Assignment Date or Select a Date" + '\n';
      this.Errors = this.Errors + 1;
    }
    if(this.ProjectEffortchecked == true && this.Project_Effort == null){
      this.ErrorMessage +="Please Uncheck the Project Effort or Enter a value in Text Box" + '\n';
      this.Errors = this.Errors + 1;
    }else if(this.ProjectEffortchecked == true && (this.Project_Effort > 5 || this.Project_Effort <0)){
      this.ErrorMessage +="Project Effort should be in between 0 - 5" + '\n';
      this.Errors = this.Errors + 1;
    }
    if(this.Statuschecked == true && this.Record_Status == null){
      this.ErrorMessage +="Please Uncheck the Record Status or Select a value from dropdown" + '\n';
      this.Errors = this.Errors + 1;
    }
    if(this.GoLiveDatechecked == true && this.DateGolive_R == null){
      this.ErrorMessage +="Please Uncheck the GoliveDate or Select a Date" + '\n';
      this.Errors = this.Errors + 1;
    }
    if(this.GlobalManagerchecked == true && this.GlobalManager_R.value == null){
      this.ErrorMessage +="Please Uncheck the Global Manager or Select a value from dropdown" + '\n';
      this.Errors = this.Errors + 1;
    }
    if(this.RegionalManagerchecked == true && this.RegionalManager_R.value == null){
      this.ErrorMessage +="Please Uncheck the Regional Manager or Select a value from dropdown" + '\n';
      this.Errors = this.Errors + 1;
    }
    if(this.AssignePersonchecked == true && this.AssignePerson_R.value == null){
      this.ErrorMessage +="Please Uncheck the Local Manager or Select a value from dropdown" + '\n';
      this.Errors = this.Errors + 1;
    }
    if(this.ProjectLevelchecked == true && this.ProjectLevel == null){
      this.ErrorMessage +="Please Uncheck the Project Level or Select a value from dropdown" + '\n';
      this.Errors = this.Errors + 1;
    }
    if(this.PCommentschecked == true && this.Pipeline_comments == null){
      this.ErrorMessage +="Please Uncheck the Pipeline Comments or Enter a value in Text Box" + '\n';
      this.Errors = this.Errors + 1;
    }
    if(this.GlobalCISOBTLeadchecked == true && this.GlobalCISOBTLead.value == null){
      this.ErrorMessage +="Please Uncheck the Global CIS OBT Lead or Select a value from dropdown" + '\n';
      this.Errors = this.Errors + 1;
    }
    if(this.RegionalCISOBTLeadchecked == true && this.RegionalCISOBTLead.value == null){
      this.ErrorMessage +="Please Uncheck the Regional CIS OBT Lead or Select a value from dropdown" + '\n';
      this.Errors = this.Errors + 1;
    }
    if(this.LocalDigitalOBTLeadchecked == true && this.LocalDigitalOBTLead.value == null){
      this.ErrorMessage +="Please Uncheck the Local CIS OBT Lead or Select a value from dropdown" + '\n';
      this.Errors = this.Errors + 1;
    }
    if(this.GlobalCISPortraitLeadchecked == true && this.GlobalCISPortraitLead.value == null){
      this.ErrorMessage +="Please Uncheck the Global CIS Portrait Lead or Select a value from dropdown" + '\n';
      this.Errors = this.Errors + 1;
    }
    if(this.RegionalCISPortraitLeadchecked == true && this.RegionalCISPortraitLead.value == null){
      this.ErrorMessage +="Please Uncheck the Regional CIS Portrait Lead or Select a value from dropdown" + '\n';
      this.Errors = this.Errors + 1;
    }
    if(this.GlobalCISHRFeedSpecialistchecked == true && this.GlobalCISHRFeedSpecialist.value == null){
      this.ErrorMessage +="Please Uncheck the Global CIS HRFeed Specialist or Select a value from dropdown" + '\n';
      this.Errors = this.Errors + 1;
    }
    if(this.ActivityTypechecked == true && this.ActivityType.value == null){
      this.ErrorMessage +="Please Uncheck the Activity Type or Select a value from dropdown" + '\n';
      this.Errors = this.Errors + 1;
    }
    if(this.Complexitychecked == true && this.ComplexityScore == null){
      this.ErrorMessage += "Please Uncheck the Complexity Score or Select a value from dropdown" + '\n';
      this.Errors = this.Errors + 1;
    }else if(this.Complexitychecked == true && this.ActivityType.value == "Ad-hoc" && (this.ComplexityScore > 200 || this.ComplexityScore < 0)){
      this.ErrorMessage += "Complexity score should be in between 0 - 200 if activity type is Ad-hoc" + '\n';
      this.Errors = this.Errors + 1;
    }
    // if(this.GDSchecked == true && this.GDS.value == null){
    //   this.ErrorMessage +="Please Uncheck the GDS or Select a value from dropdown" + '\n';
    //   this.Errors = this.Errors + 1;
    // }
    if(this.Errors > 0){
      alert(this.ErrorMessage);
    }
  }
  DateGo_Live_R;Date;
  OnSaveClick(){
    this.Errors = 0;
    this.ErrorChecks();
    this.SelectedData = this.selectedItems;
    if(this.Errors == 0){
      if(this.SelectedData.length <= 0){
        alert("Please Select atleast one Revenue ID");
      }else{
        var RevID;
        for(let i=0;i<this.SelectedData.length;i++){
          if(i == 0){
            RevID = this.SelectedData[i].item_text.split(',')[3];
          }else{
            RevID += ","+this.SelectedData[i].item_text.split(',')[3];
          }
        }
        if(this.DateGolive_R == null){
          this.DateGo_Live_R = null;
        }else{
          this.DateGo_Live_R = this.datepipe.transform(this.DateGolive_R, "MM-dd-yyyy")+"";
        }
        if(this.dateAssignment == null){
          this.Date = null;
        }else{
          this.Date = this.datepipe.transform(this.dateAssignment, "MM-dd-yyyy")+"";
        }
        this.service.ReplicatingManualData(RevID,
        "",
        this.Implementation_Type,
        this.Pipeline_status,
        this.Pipeline_comments,
        // this.Service_configuration,
        // this.OBT_Reseller___Direct.value,
        this.Date,
        "",
        this.Project_Effort,
        this.Record_Status,
        this.ProjectLevel,
        this.DateGo_Live_R+"",
        this.GlobalManager_R.value,
        this.RegionalManager_R.value,
        this.AssignePerson_R.value,
        this.ImpTypechecked,
        this.PStatuschecked,
        this.PCommentschecked,
        // this.ServiceConfigchecked,
        // this.OBTResellerchecked,
        this.AssignmentDatechecked,
        this.ProjectEffortchecked,this.Statuschecked,
        this.ProjectLevelchecked,this.GoLiveDatechecked,
        this.GlobalManagerchecked,this.RegionalManagerchecked,
        this.AssignePersonchecked,
        // this.GDS.value,
        this.ComplexityScore,this.ActivityType.value,
        this.GlobalCISOBTLead.value,this.RegionalCISOBTLead.value,
        this.LocalDigitalOBTLead.value,this.GlobalCISPortraitLead.value,
        this.RegionalCISPortraitLead.value,this.GlobalCISHRFeedSpecialist.value,
        // this.GDSchecked,
        this.Complexitychecked,
        this.ActivityTypechecked,this.GlobalCISOBTLeadchecked,
        this.RegionalCISOBTLeadchecked,this.LocalDigitalOBTLeadchecked,
        this.GlobalCISPortraitLeadchecked,this.RegionalCISPortraitLeadchecked,
        this.GlobalCISHRFeedSpecialistchecked,
        this.LoginUID).subscribe(data =>{
          if(data.code = 200){
            alert(data.message+"");
            this.dialogRef.close({SelectionType : 'Replicate'});
          }else{
            alert(data.message+"");
          }
        })
        this.service.UsersUsageofReports(this.LoginUID,"Automated CLR","Replicate").subscribe(data =>{
        })
      }
    }else{
    }
  }
  OnCancelClick(){
    this.dialogRef.close({SelectionType : 'Cancel'});
  }
  OnApplyClick(){
    this.service.GetManualdataUsingRevID(this.ManualRevenueID).subscribe(data =>{
      if(data.code == 200){
        this.Implementation_Type = data.Data[0].Implementation_Type;
        this.Pipeline_status = data.Data[0].Pipeline_status;
        this.Pipeline_comments = data.Data[0].Pipeline_comments;
        // this.Service_configuration = data.Data[0].Service_configuration;
        // this.OBT_Reseller___Direct.setValue(data.Data[0].OBT_Reseller___Direct);
        this.dateAssignment = new Date(data.Data[0].Assignment_date);
        this.Project_Effort = data.Data[0].Project_Effort;
        this.Record_Status = data.Data[0].RecordStatus;
      }else{
      }
    })
  }
}
@Component({
  selector: 'app-digitalteammanualdata',
  templateUrl: './digitalteammanualdata.component.html',
  styleUrls: ['./digitalteammanualdata.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DigitalTeamdailog {
  constructor(
    public service : DashboardServiceService,
    public dialogRef: MatDialogRef<DigitalTeamdailog>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: DigitalTeamData) {
      this.GlobalDigitalOBTLeadList_P = data.DigitalTeam;
      this.GlobalOBTDigitalTeamData.next(this.GlobalDigitalOBTLeadList_P.slice());
      this.RegionalDigitalOBTLeadList_P = data.DigitalTeam;
      this.RegionalOBTDigitalTeamData.next(this.RegionalDigitalOBTLeadList_P.slice());
      this.LocalDigitalOBTLeadList_P = data.DigitalTeam;
      this.LocalOBTDigitalTeamData.next(this.LocalDigitalOBTLeadList_P.slice());
      this.GlobalDigitalPortraitLeadList_P = data.DigitalTeam;
      this.GlobalPortraitDigitalTeamData.next(this.GlobalDigitalPortraitLeadList_P.slice());
      this.RegionalDigitalPortraitLeadList_P = data.DigitalTeam;
      this.RegionalPortraitDigitalTeamData.next(this.RegionalDigitalPortraitLeadList_P.slice());
      this.GlobalDigitalHRFeedSpeciaList_P = data.DigitalTeam;
      this.GlobalHRFeedDigitalTeamData.next(this.GlobalDigitalHRFeedSpeciaList_P.slice());
      this.GlobalCISOBTLead.setValue(data.GlobalCISOBTLead);
      this.RegionalCISOBTLead.setValue(data.RegionalCISOBTLead);
      this.LocalDigitalOBTLead.setValue(data.LocalDigitalOBTLead);
      this.GlobalCISPortraitLead.setValue(data.GlobalCISPortraitLead);
      this.RegionalCISPortraitLead.setValue(data.RegionalCISPortraitLead);
      this.GlobalCISHRFeedSpecialist.setValue(data.GlobalCISHRFeedSpecialist);
      this.ActivityType.setValue(data.ActivityType);
      this.ComplexityScore = data.ComplexityScore;
      // this.GDS.setValue(data.GDS);
      this.ProjectStatus = data.ProjectStatus;
      if(data.ProjectStatus == "P-Pipeline" || this.ProjectStatus == "HP-High Potential" || this.ProjectStatus == "EP-Early Potential"){
        this.ProjectStatusNgIf = true;
      }else{
        this.ProjectStatusNgIf = false;
      }
      this.DTID = data.DTID;
      this.CLRID = data.CLRID;
      this.RevenueID = data.RevenueID;
      // set screenWidth on page load
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      window.onresize = () => {
        // set screenWidth on screen size change
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
      };
    }
    screenWidth: number;
    screenHeight : number;
    DTID;
    CLRID;
    RevenueID;
    ProjectStatus;
    ProjectStatusNgIf;
    // CS_disable : boolean = true;
    GlobalCISOBTLead_V;RegionalCISOBTLead_V;LocalDigitalOBTLead_V;
    GlobalCISPortraitLead_V;RegionalCISPortraitLead_V;GlobalCISHRFeedSpecialist_V;
    GlobalCISOBTLead = new FormControl();
    RegionalCISOBTLead = new FormControl();
    LocalDigitalOBTLead = new FormControl();
    GlobalCISPortraitLead = new FormControl();
    RegionalCISPortraitLead = new FormControl();
    GlobalCISHRFeedSpecialist = new FormControl();
    ActivityType = new FormControl();
    ComplexityScore;
    // GDS = new FormControl();
    GlobalDigitalOBTLeadList_P: FilterDigitalTeam[];RegionalDigitalOBTLeadList_P: FilterDigitalTeam[];
    LocalDigitalOBTLeadList_P: FilterDigitalTeam[];GlobalDigitalPortraitLeadList_P: FilterDigitalTeam[];
    RegionalDigitalPortraitLeadList_P: FilterDigitalTeam[];GlobalDigitalHRFeedSpeciaList_P: FilterDigitalTeam[];
    // GDS_P;
    ActivityType_P;
  GlobalCISOBTLeadsearch = new FormControl();
  RegionalCISOBTLeadsearch = new FormControl();
  LocalDigitalOBTLeadsearch = new FormControl();
  GlobalCISPortraitLeadsearch = new FormControl();
  RegionalCISPortraitLeadsearch = new FormControl();
  GlobalCISHRFeedSpecialistsearch = new FormControl();
  protected _onDestroy = new Subject<void>();
  public GlobalOBTDigitalTeamData: ReplaySubject<FilterDigitalTeam[]> = new ReplaySubject<FilterDigitalTeam[]>(1);
  public RegionalOBTDigitalTeamData: ReplaySubject<FilterDigitalTeam[]> = new ReplaySubject<FilterDigitalTeam[]>(1);
  public LocalOBTDigitalTeamData: ReplaySubject<FilterDigitalTeam[]> = new ReplaySubject<FilterDigitalTeam[]>(1);
  public GlobalPortraitDigitalTeamData: ReplaySubject<FilterDigitalTeam[]> = new ReplaySubject<FilterDigitalTeam[]>(1);
  public RegionalPortraitDigitalTeamData: ReplaySubject<FilterDigitalTeam[]> = new ReplaySubject<FilterDigitalTeam[]>(1);
  public GlobalHRFeedDigitalTeamData: ReplaySubject<FilterDigitalTeam[]> = new ReplaySubject<FilterDigitalTeam[]>(1);
  SearchValueChanges(){
    this.GlobalCISOBTLeadsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.GlobalOBTfilter();
      });
    this.RegionalCISOBTLeadsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.RegionalOBTfilter();
      });
    this.LocalDigitalOBTLeadsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.LocalOBTfilter();
      });
    this.GlobalCISPortraitLeadsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.GlobalPortraitfilter();
      });
    this.RegionalCISPortraitLeadsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.RegionalPortraitfilter();
      });
    this.GlobalCISHRFeedSpecialistsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.GlobalHRFeedfilter();
      });
  }
  protected GlobalOBTfilter() {
    if (!this.GlobalDigitalOBTLeadList_P) {
      return;
    }
    // get the search keyword
    let search = this.GlobalCISOBTLeadsearch.value;
    if (!search) {
      this.GlobalOBTDigitalTeamData.next(this.GlobalDigitalOBTLeadList_P.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.GlobalOBTDigitalTeamData.next(
      this.GlobalDigitalOBTLeadList_P.filter(manager => manager.Manager.toLowerCase().indexOf(search) > -1)
    );
  }
  protected RegionalOBTfilter() {
    if (!this.RegionalDigitalOBTLeadList_P) {
      return;
    }
    // get the search keyword
    let search = this.RegionalCISOBTLeadsearch.value;
    if (!search) {
      this.RegionalOBTDigitalTeamData.next(this.RegionalDigitalOBTLeadList_P.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.RegionalOBTDigitalTeamData.next(
      this.RegionalDigitalOBTLeadList_P.filter(manager => manager.Manager.toLowerCase().indexOf(search) > -1)
    );
  }
  protected LocalOBTfilter() {
    if (!this.LocalDigitalOBTLeadList_P) {
      return;
    }
    // get the search keyword
    let search = this.LocalDigitalOBTLeadsearch.value;
    if (!search) {
      this.LocalOBTDigitalTeamData.next(this.LocalDigitalOBTLeadList_P.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.LocalOBTDigitalTeamData.next(
      this.LocalDigitalOBTLeadList_P.filter(manager => manager.Manager.toLowerCase().indexOf(search) > -1)
    );
  }
  protected GlobalPortraitfilter() {
    if (!this.GlobalDigitalPortraitLeadList_P) {
      return;
    }
    // get the search keyword
    let search = this.GlobalCISPortraitLeadsearch.value;
    if (!search) {
      this.GlobalPortraitDigitalTeamData.next(this.GlobalDigitalPortraitLeadList_P.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.GlobalPortraitDigitalTeamData.next(
      this.GlobalDigitalPortraitLeadList_P.filter(manager => manager.Manager.toLowerCase().indexOf(search) > -1)
    );
  }
  protected RegionalPortraitfilter() {
    if (!this.RegionalDigitalPortraitLeadList_P) {
      return;
    }
    // get the search keyword
    let search = this.RegionalCISPortraitLeadsearch.value;
    if (!search) {
      this.RegionalPortraitDigitalTeamData.next(this.RegionalDigitalPortraitLeadList_P.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.RegionalPortraitDigitalTeamData.next(
      this.RegionalDigitalPortraitLeadList_P.filter(manager => manager.Manager.toLowerCase().indexOf(search) > -1)
    );
  }
  protected GlobalHRFeedfilter() {
    if (!this.GlobalDigitalHRFeedSpeciaList_P) {
      return;
    }
    // get the search keyword
    let search = this.GlobalCISHRFeedSpecialistsearch.value;
    if (!search) {
      this.GlobalHRFeedDigitalTeamData.next(this.GlobalDigitalHRFeedSpeciaList_P.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.GlobalHRFeedDigitalTeamData.next(
      this.GlobalDigitalHRFeedSpeciaList_P.filter(manager => manager.Manager.toLowerCase().indexOf(search) > -1)
    );
  }
  OnCancelClick(){
    this.dialogRef.close([{SelectionType : 'Cancel'}]);
  }
  OnSaveClick(){
    if(this.ActivityType.value == "Ad-hoc" && (this.ComplexityScore>200 || this.ComplexityScore<0))
    {
      alert("Complexity score should be in between 0 - 200 if activity type is Ad-hoc");
    }else if(this.ComplexityScore > 5 || this.ComplexityScore <0){
      alert("Complexity score should be in between 0 - 5");
    }else{
      if(this.ProjectStatusNgIf == true){
        this.GlobalCISOBTLead_V = this.GlobalCISOBTLead.value;
        this.RegionalCISOBTLead_V = this.RegionalCISOBTLead.value;
        this.LocalDigitalOBTLead_V = this.LocalDigitalOBTLead.value;
        this.GlobalCISPortraitLead_V = this.GlobalCISPortraitLead.value;
        this.RegionalCISPortraitLead_V = this.RegionalCISPortraitLead.value;
        this.GlobalCISHRFeedSpecialist_V = this.GlobalCISHRFeedSpecialist.value;
      }else{
        this.GlobalCISOBTLead_V = this.data.GlobalCISOBTLead;
        this.RegionalCISOBTLead_V = this.data.RegionalCISOBTLead;
        this.LocalDigitalOBTLead_V = this.data.LocalDigitalOBTLead;
        this.GlobalCISPortraitLead_V = this.data.GlobalCISPortraitLead;
        this.RegionalCISPortraitLead_V = this.data.RegionalCISPortraitLead;
        this.GlobalCISHRFeedSpecialist_V = this.data.GlobalCISHRFeedSpecialist;
      }
      this.service.UpdateDigitalColumns(this.CLRID,this.DTID,this.RevenueID,this.GlobalCISOBTLead_V,
        this.RegionalCISOBTLead_V,this.LocalDigitalOBTLead_V,this.GlobalCISPortraitLead_V,this.RegionalCISPortraitLead_V,
        this.GlobalCISHRFeedSpecialist_V,this.ActivityType.value,
        // this.GDS.value,
        this.ComplexityScore,localStorage.getItem("UID")).subscribe(data => {
        if(data.code == 200){
          // alert(data.message);
          this.dialogRef.close([{SelectionType : 'Update_d',RevenueID : this.RevenueID,GlobalCISOBTLead : this.GlobalCISOBTLead_V,
          RegionalCISOBTLead : this.RegionalCISOBTLead_V,LocalDigitalOBTLead : this.LocalDigitalOBTLead_V,GlobalCISPortraitLead : this.GlobalCISPortraitLead_V,
          RegionalCISPortraitLead : this.RegionalCISPortraitLead_V,GlobalCISHRFeedSpecialist : this.GlobalCISHRFeedSpecialist_V,ActivityType : this.ActivityType.value,
          // GDS : this.GDS.value,
          ComplexityScore : this.ComplexityScore}]);
        }else{
          alert(data.message);
        }
        this.service.UsersUsageofReports(localStorage.getItem("UID"),"Automated CLR","Digital Team Update").subscribe(data =>{
        })
      });
    }
  }
  ngOnInit() {
    this.SearchValueChanges();
    // this.GDS_P = ["---","Amadeus","Sabre","TravelPort"];
    this.ActivityType_P = ["---","Ad-hoc","Add OBT to existing Country","Client OBT Trainings","Client Top Consolidation","Direct/Reseller OBT Conversion","FSC/GSC Migration","HR Feed & Portrait","Mergers/Splits","Modify Existing OBT Site","New Portrait and OBT Client Implementation","OBT Migration","Other","Portrait Only","Trainline Implementation"];
    this.ActivityType.valueChanges.subscribe(value => {
      if(value == "---"){
        this.ComplexityScore = 0;
      }else if(value == "New Portrait and OBT Client Implementation"){
        this.ComplexityScore = 3;
      }else if(value == "OBT Migration"){
        this.ComplexityScore = 3
      }else if(value == "Mergers/Splits"){
        this.ComplexityScore = 4
      }else if(value == "Portrait Only"){
        this.ComplexityScore = 1
      }else if(value == "Modify Existing OBT Site"){
        this.ComplexityScore = 1
      }else if(value == "Client Top Consolidation"){
        this.ComplexityScore = 3
      }else if(value == "Add OBT to existing Country"){
        this.ComplexityScore = 3
      }else if(value == "Other"){
        this.ComplexityScore = 1
      }else if(value == "Trainline Implementation"){
        this.ComplexityScore = 1
      }else if(value == "Direct/Reseller OBT Conversion"){
        this.ComplexityScore = 1
      }else if(value == "FSC/GSC Migration"){
        this.ComplexityScore = 3
      }else if(value == "HR Feed & Portrait"){
        this.ComplexityScore = 2
      }else if(value == "Client OBT Trainings"){
        this.ComplexityScore = 1
      }else if(value == "Ad-hoc"){
        this.ComplexityScore = 0;
      }else{
        this.ComplexityScore = 0
      }
    });
  }
}
@Component({
  selector: 'app-projectteam',
  templateUrl: './projectteam.component.html',
  styleUrls: ['./projectteam.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectTeamDailog {
  constructor(
    public datepipe : DatePipe,
    public service : DashboardServiceService,
    public dialogRef: MatDialogRef<ProjectTeamDailog>,
    @Inject(MAT_DIALOG_DATA) public data: ParsingData)
    {
      dialogRef.disableClose = true;
      this.ManualId = data.ManualID;
      this.RevenueID = data.RevenueID;
      this.Implementation_Type = data.Implementation_Type;
      this.Pipeline_status = data.Pipeline_status;
      this.Pipeline_comments = data.Pipeline_comments;
      // this.Service_configuration = data.Service_configuration;
      // this.OBT_Reseller___Direct.setValue(data.OBT_Reseller___Direct);
      this.Record_Status = data.RecordStatus;
      if(data.Assignment_date == null){
        this.dateAssignment = null;
      }else{
        this.dateAssignment = new Date(data.Assignment_date);
      }
      if(data.GoLiveDate == null){
        this.DateGolive = null;
      }else{
        this.DateGolive = new Date(data.GoLiveDate);
      }
      this.Project_Effort = data.Project_Effort;
      this.ProjectStatus = data.ProjectStatus;
      this.ProjectLevel = data.ProjectLevel;
      this.GlobalProjectManager.setValue(data.GlobalProjectManager);
      this.RegionalProjectManager.setValue(data.RegionalProjectManager);
      this.AssigneeFullName.setValue(data.AssigneeFullName);
      if(this.ProjectStatus == "P-Pipeline" || this.ProjectStatus == "HP-High Potential" || this.ProjectStatus == "EP-Early Potential"){
        this.PipelineFields = true;
      }else{
        this.PipelineFields = false;
      }
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      window.onresize = () => {
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
      };
  }
  screenWidth: number;
  screenHeight : number;
  LoginUID : string;
  DateGolive : Date;
  ManualId : number;
  RevenueID : number;
  Implementation_Type : string;
  Pipeline_status : string;
  // Service_configuration : string;
  // OBT_Reseller___Direct = new FormControl();
  GlobalProjectManager = new FormControl();
  RegionalProjectManager = new FormControl();
  AssigneeFullName = new FormControl();
  dateAssignment : Date;
  todayDate : Date = new Date();
  Project_Effort : number;
  Record_Status : string;
  ProjectLevel : string;
  Pipeline_comments : string;
  PipelineFields : boolean;
  ProjectStatus : string;
  GPMsearch = new FormControl();
  RPMsearch = new FormControl();
  AFNsearch = new FormControl();
  OBTsearch = new FormControl();
  GManagerList : FilterGlobalProjectManager[];
  RManagerList : FilterGlobalProjectManager[];
  LManagerList : FilterGlobalProjectManager[];
  OBTList : FilterOpportunityType[];
  Loader : boolean = false;
  public GPMData: ReplaySubject<FilterGlobalProjectManager[]> = new ReplaySubject<FilterGlobalProjectManager[]>(1);
  public RPMData: ReplaySubject<FilterGlobalProjectManager[]> = new ReplaySubject<FilterGlobalProjectManager[]>(1);
  public AFNData: ReplaySubject<FilterGlobalProjectManager[]> = new ReplaySubject<FilterGlobalProjectManager[]>(1);
  public OBTData: ReplaySubject<FilterOpportunityType[]> = new ReplaySubject<FilterOpportunityType[]>(1);
  protected _onDestroy = new Subject<void>();
  OnCancelClick(){
    this.dialogRef.close([{SelectionType : 'Cancel'}])
  }
  SearchValueChanges(){
    this.GPMsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.GPMfilter();
      });
    this.RPMsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.RPMfilter();
      });
    this.AFNsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.AFNfilter();
      });
    this.OBTsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.OBTfilter();
      });
  }
  ngOnInit() {
    this.service.ListofLeadersManagers().subscribe(data =>{
      if(data.code == 200){
        var datas = {GlobalProjectManager : "---",isSelected : true};
        var datas1 = {GlobalProjectManager : "Not Required",isSelected : true};
        var datas2 = {GlobalProjectManager : "To Be Assigned",isSelected : true};
        data.FilterGlobalProjectManager.push(datas);
        data.FilterGlobalProjectManager.push(datas1);
        data.FilterGlobalProjectManager.push(datas2);
        this.GManagerList = data.FilterGlobalProjectManager;
        this.GPMData.next(this.GManagerList.slice());
        this.RManagerList = data.FilterGlobalProjectManager;
        this.RPMData.next(this.RManagerList.slice());
        this.LManagerList = data.FilterGlobalProjectManager;
        this.AFNData.next(this.LManagerList.slice());
        var data_obt = ["AeTM","Amadeus Cytric - Direct","Amadeus Cytric -  Reseller","B Plus","Concur Travel  - Direct","Concur Travel - Reseller","CWT Book2Go","CWT China online","Deem","GetThere - Direct","GetThere - Reseller","HRS","IATA Number Change","KDS - Direct","KDS - Reseller","No OBT","None","Offline","Onesto","Unspecified","Serko","Smart Traveller Online","TimeToGo","Traveldoo - Direct","Traveldoo - Reseller","Zillious Reseller"]
        this.OBTList = [];
        data_obt.forEach(item =>{
          this.OBTList.push({Opportunity_Type: item,isSelected: true});
        })
        this.OBTData.next(this.OBTList.slice());
      }
    })
    this.LoginUID = localStorage.getItem("UID");
    if(this.LoginUID == "" || this.LoginUID == null){
      this.dialogRef.close();
    }else{
    }
    this.SearchValueChanges();
  }
  protected AFNfilter() {
    if (!this.LManagerList) {
      return;
    }
    // get the search keyword
    let search = this.AFNsearch.value;
    if (!search) {
      this.AFNData.next(this.LManagerList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.AFNData.next(
      this.LManagerList.filter(manager => manager.GlobalProjectManager.toLowerCase().indexOf(search) > -1)
    );
  }
  protected OBTfilter() {
    if (!this.OBTList) {
      return;
    }
    // get the search keyword
    let search = this.OBTsearch.value;
    if (!search) {
      this.OBTData.next(this.OBTList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.OBTData.next(
      this.OBTList.filter(manager => manager.Opportunity_Type.toLowerCase().indexOf(search) > -1)
    );
  }
  protected GPMfilter() {
    if (!this.GManagerList) {
      return;
    }
    // get the search keyword
    let search = this.GPMsearch.value;
    if (!search) {
      this.GPMData.next(this.GManagerList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.GPMData.next(
      this.GManagerList.filter(manager => manager.GlobalProjectManager.toLowerCase().indexOf(search) > -1)
    );
  }
  protected RPMfilter() {
    if (!this.RManagerList) {
      return;
    }
    // get the search keyword
    let search = this.RPMsearch.value;
    if (!search) {
      this.RPMData.next(this.RManagerList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.RPMData.next(
      this.RManagerList.filter(manager => manager.GlobalProjectManager.toLowerCase().indexOf(search) > -1)
    );
  }
  OnSaveClick(){
    if(this.Project_Effort > 5 || this.Project_Effort < 0){
      alert("Project Effort should be in between 0-5");
    }else{
      this.Loader = true;
      var Date;
      if(this.dateAssignment == null){
        Date = null;
      }else{
        Date = this.datepipe.transform(this.dateAssignment, "MM-dd-yyyy")+"";
      }
      var DateGo_Live
      if(this.DateGolive == null){
        DateGo_Live = null;
      }else{
        DateGo_Live = this.datepipe.transform(this.DateGolive, "MM-dd-yyyy")+"";
      }
      if(this.ProjectStatus == "P-Pipeline" || this.ProjectStatus == "HP-High Potential" || this.ProjectStatus == "EP-Early Potential"){
        this.service.UpdateManualPipelineColumns(this.ManualId,this.RevenueID,
          this.Implementation_Type,
          this.Pipeline_status,
          this.Pipeline_comments,
          // this.Service_configuration,
          // this.OBT_Reseller___Direct.value,
          Date,
          this.RevenueID,
          this.Project_Effort+'',
          DateGo_Live,
          this.ProjectLevel,
          this.GlobalProjectManager.value,
          this.RegionalProjectManager.value,
          this.AssigneeFullName.value,this.Record_Status,this.LoginUID).subscribe(data =>{
            if(data.code == 200){
              // alert(data.message);
              this.dialogRef.close([{SelectionType : 'Update_p',RevenueID : this.RevenueID,Implementation_Type : this.Implementation_Type,
              Pipeline_status : this.Pipeline_status,Pipeline_comments : this.Pipeline_comments,
              // OBT_Reseller___Direct : this.OBT_Reseller___Direct.value,Service_configuration : this.Service_configuration
              Project_Effort : this.Project_Effort,Record_Status : this.Record_Status,ProjectLevel : this.ProjectLevel,
              GlobalProjectManager : this.GlobalProjectManager.value,AssignmentDate : Date,Golivedate : DateGo_Live,
              AssigneeFullName : this.AssigneeFullName.value,RegionalProjectManager : this.RegionalProjectManager.value}]);
            }else{
              alert(data.message);
            }
            this.Loader = false;
        });
        this.service.UsersUsageofReports(this.LoginUID,"Automated CLR","Project Team Update").subscribe(data =>{
        })
      }else{
        this.service.UpdateManualColumns(this.ManualId,this.RevenueID,
          this.Implementation_Type,
          this.Pipeline_status,
          this.Pipeline_comments,
          // this.Service_configuration,
          // this.OBT_Reseller___Direct.value,
          Date,
          this.RevenueID,
          this.Project_Effort+"",
          this.Record_Status,this.LoginUID
          ).subscribe(data =>{
            if(data.code == 200){
              // alert(data.message);
              this.dialogRef.close([{SelectionType : 'Update',RevenueID : this.RevenueID,Implementation_Type : this.Implementation_Type,
              Pipeline_comments : this.Pipeline_comments,
              // OBT_Reseller___Direct : this.OBT_Reseller___Direct.value,Service_configuration : this.Service_configuration
              Project_Effort : this.Project_Effort,Record_Status : this.Record_Status,AssigneeFullName : this.AssigneeFullName,
              Pipeline_status : this.Pipeline_status}]);
            }else{
              alert(data.message);
            }
            this.Loader = false;
        });
        this.service.UsersUsageofReports(this.LoginUID,"Automated CLR","Project Team Update").subscribe(data =>{
        })
      }
    }
  }  
}
@Component({
  selector: 'app-clrcommentdailog',
  templateUrl: './clrcommentdailog.component.html',
  styleUrls: ['./clrcommentdailog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CLRCommentdailog {
  constructor(
    public dialogRef: MatDialogRef<CLRCommentdailog>,
    @Inject(MAT_DIALOG_DATA) public data: CLRDialogData) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  selector: 'app-auditlog',
  templateUrl: './auditlog.component.html',
  styleUrls: ['./auditlog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AuditLogdailog {
  constructor(
    public datepipe : DatePipe,
    public service : DashboardServiceService,
    public dialogRef: MatDialogRef<AuditLogdailog>) {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      window.onresize = () => {
        // set screenWidth on screen size change
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
      };
    }
    screenWidth
    screenHeight
    
  @ViewChild(MatSort) sort: MatSort;
  onNoClick(): void {
    this.dialogRef.close();
  }
  dataSource;
  displayedColumns : string[] = ['RevenueID', 'UpdatedBy','Username','Field','OldValue','NewValue','DateUpdated'];
  searchbar : string;
  Data : Data[];
  ngOnInit(){
    this.service.GetAuditLog().subscribe(data =>{
      this.Data = data.Data;
      for(let i = 0;i<data.Data.length;i++){
        if(this.Data[i].UpdatedOn == null){
          this.Data[i].DateUpdated = "---";
        }else{
          this.Data[i].DateUpdated = this.datepipe.transform(this.Data[i].UpdatedOn, "y-MM-dd, h:mm a") + " IST";
        }
        if(this.Data[i].RevenueID == "400000000000000"){
          this.Data[i].RevenueID = this.Data[i].RevenueID + " - " + this.Data[i].TaskRecordIDKey;
        }else{
          this.Data[i].RevenueID = this.Data[i].RevenueID;
        }
      }
      this.dataSource = new MatTableDataSource(this.Data);
      this.searchbar = localStorage.getItem("Username");
      this.dataSource.filter = this.searchbar.trim().toLowerCase();
      this.dataSource.sort = this.sort;
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  OnCancelClick(){
    this.dialogRef.close();
  }
}
@Component({
  selector: 'app-recordlevelauditlog',
  templateUrl: './recordlevelauditlog.component.html',
  styleUrls: ['./recordlevelauditlog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RecordLevelAuditLogdailog {
  constructor(
    public datepipe : DatePipe,
    public service : DashboardServiceService,
    public dialogRef: MatDialogRef<RecordLevelAuditLogdailog>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: CLRDialogData) {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      window.onresize = () => {
        // set screenWidth on screen size change
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
      };
      this.RevenueID = data.Dailog_RevenueID;
    }
    screenWidth
    screenHeight
    RevenueID;
  @ViewChild(MatSort) sort: MatSort;
  onNoClick(): void {
    this.dialogRef.close();
  }
  dataSource;
  displayedColumns : string[] = ['RevenueID', 'UpdatedBy','Username','Field','OldValue','NewValue','DateUpdated'];
  searchbar : string;
  Data : Data[];
  ngOnInit(){
    this.service.GetRecordLevelAuditLog(this.RevenueID).subscribe(data =>{
      this.Data = data.Data;
      for(let i = 0;i<data.Data.length;i++){
        if(this.Data[i].UpdatedOn == null){
          this.Data[i].DateUpdated = "---";
        }else{
          this.Data[i].DateUpdated = this.datepipe.transform(this.Data[i].UpdatedOn, "y-MM-dd, h:mm a") + " IST";
        }
        if(this.Data[i].RevenueID == "400000000000000"){
          this.Data[i].RevenueID = this.Data[i].RevenueID + " - " + this.Data[i].TaskRecordIDKey;
        }else{
          this.Data[i].RevenueID = this.Data[i].RevenueID;
        }
      }
      this.dataSource = new MatTableDataSource(this.Data);
      this.searchbar = this.RevenueID;
      this.dataSource.filter = this.searchbar.trim().toLowerCase();
      this.dataSource.sort = this.sort;
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  OnCancelClick(){
    this.dialogRef.close();
  }
}