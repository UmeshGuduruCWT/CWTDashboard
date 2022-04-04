import { Component, OnInit, ViewChild, ViewEncapsulation, Inject, Optional, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { DashboardServiceService } from '../../dashboard-service.service';
import { ExcelService } from '../../excel.service';
import { CLRData, DataCLR } from 'src/app/Models/AutomatedCLRResponse';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
import { DashboardComponent } from '../dashboard/dashboard.component';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
// @Injectable()
export interface CLRDialogData {
  Dailog_Client : string;
  Dailog_RevenueID : string;
  Dailog_Comment : string;
}
export interface ParsingData {
  ButtonType : string;
  ManualID : number,
  Client : string,
  //iMeet_Workspace_Title : string,
  //Date_added_to_the_CLR : Date,
  Implementation_Type : string,
  //CLR_Country : string,
  Pipeline_status : string,
  Pipeline_comments : string,
  Service_configuration : string,
  OBT_Reseller___Direct : string;
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
}
@Component({
  selector: 'app-clrreport',
  templateUrl: './clrreport.component.html',
  styleUrls: ['./clrreport.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CLRReportComponent implements OnInit, AfterViewInit {
  constructor(private router : Router,private route : ActivatedRoute,private cdr: ChangeDetectorRef,private service : DashboardServiceService,public dialog: MatDialog,public datepipe : DatePipe,private dashboard : DashboardComponent,private excelService:ExcelService) {
    // set screenWidth on page load
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    window.onresize = () => {
      // set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    };
  }
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
  displayedColumns : string[] = ['Client','RevenueID','Country','CreatedDate_c','iMeet_Workspace_Title','Implementation_Type','Pipeline_status','Pipeline_comments','Service_configuration','OBT_Reseller___Direct','Assignment_date_c','RevenueVolumeUSD','Region','OwnerShip','GoLiveDate_c','ProjectStatus','Milestone__Reason_Code','PerCompleted','CountryStatus','ProjectLevel','CompletedDate_c','GlobalProjectManager','RegionalProjectManager','AssigneeFullName','GlobalCISOBTLead','GlobalCISHRFeedSpecialist','MilestoneTitle','Group_Name','Milestone__Project_Notes','Milestone__Closed_Loop_Owner','Workspace__ELT_Overall_Status','Workspace__ELT_Overall_Comments','Customer_Row_ID','Opportunity_ID','AccountOwner','Sales_Stage_Name','Opportunity_Type','Revenue_Status','Revenue_Opportunity_Type','Opportunity_Owner','Opportunity_Category','Revenue_Total_Transactions','Line_Win_Probability','Implementation_Fee__PSD_','DataDescription','Date_added_to_the_CLR_c','Project_Effort','RecordStatus','DataSourceType','actions'];
  displayedColumns_h : string[] = ['Client_h','RevenueID_h','Country_h','CreatedDate_c_h','iMeet_Workspace_Title_h','Implementation_Type_h','Pipeline_status_h','Pipeline_comments_h','Service_configuration_h','OBT_Reseller___Direct_h','Assignment_date_c_h','RevenueVolumeUSD_c_h','Region_h','OwnerShip_h','GoLiveDate_c_h','ProjectStatus_h','Milestone__Reason_Code_h','PerCompleted_h','CountryStatus_h','ProjectLevel_h','CompletedDate_c_h','GlobalProjectManager_h','RegionalProjectManager_h','AssigneeFullName_h','GlobalCISOBTLead_h','GlobalCISHRFeedSpecialist_h','MilestoneTitle_h','Group_Name_h','Milestone__Project_Notes_h','Milestone__Closed_Loop_Owner_h','Workspace__ELT_Overall_Status_h','Workspace__ELT_Overall_Comments_h','Customer_Row_ID_h','Opportunity_ID_h','AccountOwner_h','Sales_Stage_Name_h','Opportunity_Type_h','Revenue_Status_h','Revenue_Opportunity_Type_h','Opportunity_Owner_h','Opportunity_Category_h','Revenue_Total_Transactions_h','Line_Win_Probability_h','Implementation_Fee__PSD_c_h','DataDescription_h','Date_added_to_the_CLR_c_h','Project_Effort_h','RecordStatus_h','DataSourceType_h','actions_h']
  columnsToDisplay: string[] = this.displayedColumns.slice();
  columnsToDisplay_h: string[] = this.displayedColumns_h.slice();
  displayReplicateButton : string;
  //displayedColumns : string[] = ['RevenueID','Client','iMeet_Workspace_Title','Date_added_to_the_CLR_c','Implementation_Type','CLR_Country','Pipeline_status','Pipeline_comments','Service_configuration','OBT_Reseller___Direct','Servicing_location','Assignment_date_c','New_Business_volume__US___c','RevenueVolumeUSD_c','Region','Country','OwnerShip','GoLiveDate_c','ProjectStatus','Milestone__Reason_Code','CountryStatus','ProjectLevel','CompletedDate_c','ProjectOwner','GlobalProjectManager','ProjectConsultant','RegionalProjectManager','AssigneeFullName','GlobalCISOBTLead','GlobalCISPortraitLead','GlobalCISHRFeedSpecialist','MilestoneTitle','Milestone__Record_ID_Key','Group_Name','Milestone__Project_Notes','Milestone__Closed_Loop_Owner','Workspace__ELT_Overall_Status','Workspace__ELT_Overall_Comments','Customer_Row_ID','Opportunity_ID','Account_Name','Sales_Stage_Name','Opportunity_Type','Revenue_Status','Revenue_Opportunity_Type','Opportunity_Owner','Opportunity_Category','MarketLeader','Revenue_Total_Transactions','Implementation_Fee__PSD_c','EMEA_Country_to_charge','EMEA_Client','EMEA_OBT_standard_fee_c','EMEA_Included_for_accrual','EMEA_Accrual_date_c','EMEA_Scope_description','EMEA_Billing_notes','Manual_Entry__Wave_2__Wave_3__etc_','Project_Effort','Priority','Resource_Status','Global_Project_Manager_replacement','Regional_Project_Manager_replacement','Milestone__Assignee__Full_Name_replacement','Global_CIS_OBT_Lead_replacement','Global_CIS_HR_Feed_Specialist_replacement','Global_CIS_Portrait_Lead_replacement','Global_CIS_RoomIT_Integration_Lead_replacement','actions'];
  filterEntity: DataCLR;
  SavedFilters
  filterType: MatTableFilter;
  SelectionType : string;
  LoginUID : string;
  FilteredVolume;FilteredCount;
  // sub : Subscription;
  // private sort: MatSort;
  // @ViewChild(MatSort) set matSort(ms: MatSort) {
  //   this.sort = ms;
  //   this.setDataSourceAttributes();
  // }
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatPaginator, {static: false}) set paginator(value: MatPaginator) {
  //   this.dataSource.paginator = value;
  // }
  // @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
  //   this.paginator = mp;
  //   this.setDataSourceAttributes();
  // }
  // setDataSourceAttributes() {
  //   this.dataSource.paginator = this.paginator;
  //   // this.dataSource.sort = this.sort;
  // }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // this.GetData();
  }
  ShowCLREditOption : boolean = false;
  ngOnInit(): void {
    // this.cdr.detach();
    // // interval for doing the change detection every 5 seconds
    // setInterval(() => {
    //   this.cdr.detectChanges();
    // }, 5000);
    // this.sub = this.route.paramMap.subscribe(data =>{
    //   // this.LoggedINID = data.get("UID");
    // })
    // this.router.routeReuseStrategy.shouldReuseRoute = () =>{
    //   return false;
    // }
    this.dashboard.ShowSpinnerHandler(true);
    this.service.UserReportAccess(localStorage.getItem("UID")).subscribe(data=>{
      if(data.code == 200){
        if(data.Data[0].CLREdits == true){
          this.ShowCLREditOption = true;
          this.displayReplicateButton = "true";
        }else{
          this.ShowCLREditOption = false;
          this.columnsToDisplay.pop();
          this.columnsToDisplay_h.pop();
          this.displayReplicateButton = "false";
        }
      }
      this.dashboard.ShowSpinnerHandler(false);
    })
    this.GetData();
  }
  GetData(){
    this.LoginUID = localStorage.getItem("UID");
    this.dashboard.ShowSpinnerHandler(true);
    this.service.GetCLRManualData().subscribe(data =>{
      if(data.code == 200){
        this.DataCLR = data.Data;
        for(let i = 0;i<data.Data.length;i++){
          if(this.DataCLR[i].Date_added_to_the_CLR == null){
            this.DataCLR[i].Date_added_to_the_CLR_c = "---";
          }else{
            this.DataCLR[i].Date_added_to_the_CLR_c = this.datepipe.transform(this.DataCLR[i].Date_added_to_the_CLR, "yyyy-MMM-dd");
          }
          if(this.DataCLR[i].Assignment_date == null){
            this.DataCLR[i].Assignment_date_c = "---";
          }else{
            this.DataCLR[i].Assignment_date_c = this.datepipe.transform(this.DataCLR[i].Assignment_date, "yyyy-MMM-dd");
          }
          if(this.DataCLR[i].CreatedDate == null){
            this.DataCLR[i].CreatedDate_c = "---";
          }else{
            this.DataCLR[i].CreatedDate_c = this.datepipe.transform(this.DataCLR[i].CreatedDate, "yyyy-MMM-dd");
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
          if(this.DataCLR[i].GoLiveDate == null){
            this.DataCLR[i].GoLiveDate_c = "---";
          }else{
            this.DataCLR[i].GoLiveDate_c = this.datepipe.transform(this.DataCLR[i].GoLiveDate, "yyyy-MMM-dd");
          }
          if(this.DataCLR[i].CompletedDate == null){
            this.DataCLR[i].CompletedDate_c = "---";
          }else{
            this.DataCLR[i].CompletedDate_c = this.datepipe.transform(this.DataCLR[i].CompletedDate, "yyyy-MMM-dd");
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
            this.DataCLR[i].EMEA_Accrual_date_c = this.datepipe.transform(this.DataCLR[i].EMEA_Accrual_date, "yyyy-MMM-dd");
          }
        }
        this.Region_F = this.DataCLR.filter(
          (Region, i, arr) => arr.findIndex(t => t.Region === Region.Region) === i
        );
        // this.OwnerShip_F = this.DataCLR.filter(
        //   (OwnerShip, i, arr) => arr.findIndex(t => t.OwnerShip === OwnerShip.OwnerShip) === i
        // );
        // this.ProjectStatus_F = this.DataCLR.filter(
        //   (ProjectStatus, i, arr) => arr.findIndex(t => t.ProjectStatus === ProjectStatus.ProjectStatus) === i
        // );
        // this.ProjectLevel_F = this.DataCLR.filter(
        //   (ProjectLevel, i, arr) => arr.findIndex(t => t.ProjectLevel === ProjectLevel.ProjectLevel) === i
        // );
        // this.Opportunity_Type_F = this.DataCLR.filter(
        //   (Opportunity_Type, i, arr) => arr.findIndex(t => t.Opportunity_Type === Opportunity_Type.Opportunity_Type) === i
        // );
        // this.Revenue_Status_F = this.DataCLR.filter(
        //   (Revenue_Status, i, arr) => arr.findIndex(t => t.Revenue_Status === Revenue_Status.Revenue_Status) === i
        // );
        // this.Revenue_Opportunity_Type_F = this.DataCLR.filter(
        //   (Revenue_Opportunity_Type, i, arr) => arr.findIndex(t => t.Revenue_Opportunity_Type === Revenue_Opportunity_Type.Revenue_Opportunity_Type) === i
        // );
        // this.Opportunity_Category_F = this.DataCLR.filter(
        //   (Opportunity_Category, i, arr) => arr.findIndex(t => t.Opportunity_Category === Opportunity_Category.Opportunity_Category) === i
        // );
        // this.RecordStatus_F = this.DataCLR.filter(
        //   (RecordStatus, i, arr) => arr.findIndex(t => t.RecordStatus === RecordStatus.RecordStatus) === i
        // );
        // this.DataSourceType_F = this.DataCLR.filter(
        //   (DataSourceType, i, arr) => arr.findIndex(t => t.DataSourceType === DataSourceType.DataSourceType) === i
        // );
        this.filterEntity = null;
        this.filterType = null;
        this.dataSource = null;
        this.filterEntity = new DataCLR();
        this.SavedFilters = new DataCLR();
        this.SavedFilters = JSON.parse(localStorage.getItem('Filters'))
        if(this.SavedFilters == null){
          this.filterEntity.RecordStatus = 'Active';
          // this.filterEntity.Region = ['APAC','EMEA'];
        }else{
          this.filterEntity = this.SavedFilters;
          // this.filterEntity.Region = ['APAC','EMEA'];
        }
        this.filterType = MatTableFilter.ANYWHERE;
        this.dataSource = new MatTableDataSource(this.DataCLR);
        this.FilteredVolume = "$0";
        this.FilteredCount = "0";
        this.dashboard.ShowSpinnerHandler(false);
      }else{
        alert("Something went wrong,Please try again later");
        this.dashboard.ShowSpinnerHandler(false);
      }
    })
  }
  // ImpTypeControl = new FormControl();
  // ImplementationTypelist: string[];
  // ImplementationType_F: Observable<string[]>;
  // private _ImpTypefilter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.ImplementationTypelist.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  // }
  // PipelinestatusControl = new FormControl();
  // Pipelinestatuslist: string[];
  // Pipelinestatus_F: Observable<string[]>;
  // private _Pipelinestatusfilter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.Pipelinestatuslist.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  // }
  // RegionControl = new FormControl();
  // Regionlist: string[];
  // Region_F: Observable<string[]>;
  // private _Regionfilter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.Regionlist.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  // }
  // OwnerShipControl = new FormControl();
  // OwnerShiplist: string[];
  // OwnerShip_F: Observable<string[]>;
  // private _OwnerShipfilter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.OwnerShiplist.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  // }
  // ProjectStatusControl = new FormControl();
  // ProjectStatuslist: string[];
  // ProjectStatus_F: Observable<string[]>;
  // private _ProjectStatusfilter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.ProjectStatuslist.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  // }
  // ProjectLevelControl = new FormControl();
  // ProjectLevellist: string[];
  // ProjectLevel_F: Observable<string[]>;
  // private _ProjectLevelfilter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.ProjectLevellist.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  // }
  // Sales_Stage_NameControl = new FormControl();
  // Sales_Stage_Namelist: string[];
  // Sales_Stage_Name_F: Observable<string[]>;
  // private _Sales_Stage_Namefilter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.Sales_Stage_Namelist.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  // }
  // Opportunity_TypeControl = new FormControl();
  // Opportunity_Typelist: string[];
  // Opportunity_Type_F: Observable<string[]>;
  // private _Opportunity_Typefilter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.Opportunity_Typelist.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  // }
  // Revenue_StatusControl = new FormControl();
  // Revenue_Statuslist: string[];
  // Revenue_Status_F: Observable<string[]>;
  // private _Revenue_Statusfilter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.Revenue_Statuslist.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  // }
  // Revenue_Opportunity_TypeControl = new FormControl();
  // Revenue_Opportunity_Typelist: string[];
  // Revenue_Opportunity_Type_F: Observable<string[]>;
  // private _Revenue_Opportunity_Typefilter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.Revenue_Opportunity_Typelist.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  // }
  // Opportunity_CategoryControl = new FormControl();
  // Opportunity_Categorylist: string[];
  // Opportunity_Category_F: Observable<string[]>;
  // private _Opportunity_Categoryfilter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.Opportunity_Categorylist.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  // }
  // RecordStatusControl = new FormControl();
  // RecordStatuslist: string[];
  // RecordStatus_F: Observable<string[]>;
  // private _RecordStatusfilter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.RecordStatuslist.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  // }
  // DataSourceTypeControl = new FormControl();
  // DataSourceTypelist: string[];
  // DataSourceType_F: Observable<string[]>;
  // private _DataSourceTypefilter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.DataSourceTypelist.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  // }
  FilterChange(){
    this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
    this.FilteredCount = this.dataSource.filteredData.length;
    // console.log(this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3));
  }
  ResetFilter(){
    localStorage.removeItem('Filters');
    this.FilteredVolume = "$0";
    this.FilteredCount = "0";
    this.GetData();
    this.FilterChange();
  }
  // openDialog(): void {
  //   const dialogRef = this.dialog.open(CLRCommentdailog, {
  //     // width: '400px',
  //     data: {Dailog_Comment: this.Dailog_Comment,Dailog_Client : this.Dailog_Client,Dailog_RevenueID : this.Dailog_RevenueID}
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     //this.Comment = result;
  //     // this.GetData();
  //   });
  // }
  ShowComment(Dailog_Client : string,Dailog_RevenueID : string,Dailog_Comment : string){
    this.Dailog_Client = Dailog_Client;
    this.Dailog_RevenueID = Dailog_RevenueID;
    this.Dailog_Comment = Dailog_Comment;
    // this.openDialog();
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
            // this.dataSource = this.CLRData;
            // this.excelService.exportAsExcelFile(CustomizedData, 'CRMData');
            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(CustomizedData);
            const psdworksheet : XLSX.WorkSheet = XLSX.utils.json_to_sheet(PSDCustomizedData);
            // console.log('worksheet',worksheet);
            const workbook: XLSX.WorkBook = { Sheets: { 'CRM': worksheet, 'PSD' : psdworksheet }, SheetNames: ['CRM','PSD'] };
            const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
            this.saveAsExcelFile(excelBuffer, 'CRMData');
          }
          else{
            alert("Something went wrong,Please try again later");
          }
        })
      }else{
        alert("Something went wrong,Please try again later");
      }
      this.service.UsersUsageofReports(this.LoginUID,"A_CLR","CRMExport").subscribe(data =>{
      })
      this.dashboard.ShowSpinnerHandler(false);
    })
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    // FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    FileSaver.saveAs(data, fileName + ' '+ new Date().toLocaleDateString()+ EXCEL_EXTENSION);
  }
  exportCLR(){
    this.dashboard.ShowSpinnerHandler(true);
    this.service.AutomatedCLRExport().subscribe(data =>{
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
            'Client': o.Client == "---" ? "" : o.Client,
            'Revenue ID' : o.RevenueID == "---" ? "" : o.RevenueID,
            Country : o.Country == "---" ? "" : o.Country,
            'iMeet Workspace Title' : o.iMeet_Workspace_Title == "---" ? "" : o.iMeet_Workspace_Title,
            'Last Updated Date' : o.Date_added_to_the_CLR,
            'Implementation Type' : o.Implementation_Type == "---" ? "" : o.Implementation_Type,
            'CountryCode' : o.CountryCode == "---" ? "" : o.CountryCode,
            'Pipeline status' : o.Pipeline_status == "---" ? "" : o.Pipeline_status,
            'Pipeline comments' : o.Pipeline_comments == "---" ? "" : o.Pipeline_comments,
            'Service configuration' : o.Service_configuration == "---" ? "" : o.Service_configuration,
            'OBT Reseller Direct' : o.OBT_Reseller___Direct == "---" ? "" : o.OBT_Reseller___Direct,
            //Servicing_location : o.Servicing_location,
            'Assignment date' : o.Assignment_date,
            //New_Business_volume__US___c : o.New_Business_volume__US___c,
            'Revenue Volume USD' : o.RevenueVolumeUSD,
            'Region Opportunity'  : o.Region == "---" ? "" : o.Region,
            'OwnerShip Revenue' : o.OwnerShip == "---" ? "" : o.OwnerShip,
            'Task Go Live Date' : o.GoLiveDate,
            'iMeet Milestone Project Status' : o.ProjectStatus == "---" ? "" : o.ProjectStatus,
            'Milestone Reason Code' : o.Milestone__Reason_Code == "---" ? "" : o.Milestone__Reason_Code,
            '% Completed' : o.PerCompleted == "---" ? "" : o.PerCompleted,
            'iMeet Milestone Country Status' : o.CountryStatus == "---" ? "" : o.CountryStatus,
            'iMeet Project Level' : o.ProjectLevel == "---" ? "" : o.ProjectLevel,
            'Completed Date' : o.CompletedDate,
            'Milestone Due Date' : o.MilestoneDueDate,
            'Workspace Project Owner' : o.ProjectOwner == "---" ? "" : o.ProjectOwner,
            'Global Project Manager' : o.GlobalProjectManager == "---" ? "" : o.GlobalProjectManager,
            //ProjectConsultant : o.ProjectConsultant,
            'Regional Project Manager' : o.RegionalProjectManager == "---" ? "" : o.RegionalProjectManager,
            'Assignee Full Name' : o.AssigneeFullName == "---" ? "" : o.AssigneeFullName,
            'Global Digital OBT Lead' : o.GlobalCISOBTLead == "---" ? "" : o.GlobalCISOBTLead,
            'Regional Digital OBT Lead' : o.RegionalCISOBTLead == "---" ? "" : o.RegionalCISOBTLead,
            'Global Digital HR Feed Special list' : o.GlobalCISHRFeedSpecialist == "---" ? "" : o.GlobalCISHRFeedSpecialist,
            'Global Digital Portrait Lead' : o.GlobalCISPortraitLead == "---" ? "" : o.GlobalCISPortraitLead,
            'Regional Digital Portrait Lead' : o.RegionalCISPortraitLead == "---" ? "" : o.RegionalCISPortraitLead,
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
            'Closed Date' : o.ClosedDate,
            //'ExternalKickoffDuedate' : o.ExternalKickoffDuedate_c,
            'Milestone Type' : o.MilestoneType == "---" ? "" : o.MilestoneType,
            'Project Start For CycleTime' : o.ProjectStart_ForCycleTime,
            'Cycle Time' : o.CycleTime,
            'Project Effort' : o.Project_Effort,
            'Go-Live Month' : o.GoLiveMonth == "---" ? "" : o.GoLiveMonth,
            'Go-Live Year' : o.GoLiveYear == "---" ? "" : o.GoLiveYear,
            Quarter : o.Quarter == "---" ? "" : o.Quarter,
            Description : o.DataDescription == "---" ? "" : o.DataDescription,
            'Record Status' : o.RecordStatus,
            'Data Source Type' : o.DataSourceType == "---" ? "" : o.DataSourceType,
          };
        });
        //this.dataSource = this.CLRData;
        this.excelService.exportAsExcelFile(CustomizedData, 'CLRData');
      }else{
        alert("Something went wrong,Please try again later");
      }
      this.service.UsersUsageofReports(this.LoginUID,"A_CLR","Export").subscribe(data =>{
      })
      this.dashboard.ShowSpinnerHandler(false);
    })
  }
  ReplicateCLR(){
  }
  // ReplicateCLR(){
  //   // var i = 0;
  //   // if(i == 0){
  //   //   alert("Under Maintenance")
  //   // }else{
  //     if(localStorage.getItem('Filters') == null){
  //       localStorage.setItem('Filters',JSON.stringify(this.filterEntity));
  //     }else{
  //       localStorage.removeItem('Filters');
  //       localStorage.setItem('Filters',JSON.stringify(this.filterEntity));
  //     }
  //     let p_data : ParsingData = {
  //       ButtonType : "Replicate",
  //       ManualID : null,
  //       Client : "",
  //       //iMeet_Workspace_Title : "",
  //       //Date_added_to_the_CLR : null,
  //       Implementation_Type : "",
  //       //CLR_Country : "",
  //       Pipeline_status : "",
  //       Pipeline_comments : "",
  //       Service_configuration : "",
  //       OBT_Reseller___Direct : "",
  //       //Servicing_location : "",
  //       Assignment_date : null,
  //       RevenueID : null,
  //       Project_Effort : 0,
  //       GoLiveDate : null,
  //       ProjectStatus : "",
  //       ProjectLevel : "",
  //       GlobalProjectManager : "",
  //       RegionalProjectManager : "",
  //       AssigneeFullName : "",
  //       RecordStatus : "",
  //       SelectionType : ""
  //     }
  //     const dialogRef = this.dialog.open(ManualDataEntry, {
  //       //width : '1000px',
  //       //height : '500px',
  //       data : p_data
  //     });
  //     dialogRef.afterClosed().subscribe(result => {
  //       this.SelectionType = result.SelectionType;
  //       var link = "/Dashboard/"+localStorage.getItem("UID")+"/AutomatedCLR";
  //       if(this.SelectionType == "Cancel"){
  //       }else if(this.SelectionType == "Update" || this.SelectionType == "Replicate"){
  //         // this.router.navigateByUrl(link);
  //         this.GetData();
  //       }else{
  //       }
  //     });
  //   // }
  // }
  RowSelected(j,ManualID : number,Client : string,iMeet_Workspace_Title : string,Date_added_to_the_CLR : Date,Implementation_Type : string,CLR_Country : string,Pipeline_status : string,Pipeline_comments : string,Service_configuration : string,OBT_Reseller___Direct : string,Servicing_location : string,Assignment_date : Date,New_Business_volume__US__ : number,RevenueID : number,Implementation_Fee__PSD_ : number,EMEA_Country_to_charge : string,EMEA_Client : string,EMEA_OBT_standard_fee : number,EMEA_Included_for_accrual : string,EMEA_Accrual_date : Date,EMEA_Scope_description : string,EMEA_Billing_notes : string,Manual_Entry__Wave_2__Wave_3__etc_ : string,Project_Effort : number,Priority : number,Resource_Status : string,Global_Project_Manager_replacement : string,Regional_Project_Manager_replacement : string,Milestone__Assignee__Full_Name_replacement : string,Global_CIS_OBT_Lead_replacement : string,Global_CIS_HR_Feed_Specialist_replacement : string,Global_CIS_Portrait_Lead_replacement : string,Global_CIS_RoomIT_Integration_Lead_replacement : string,GoLiveDate :Date,ProjectStatus : string,ProjectLevel : string,GlobalProjectManager : string,RegionalProjectManager : string,AssigneeFullName : string,RecordStatus : string,DataSourceType : string)
  {
  }
  // RowSelected(j,ManualID : number,Client : string,iMeet_Workspace_Title : string,Date_added_to_the_CLR : Date,Implementation_Type : string,CLR_Country : string,Pipeline_status : string,Pipeline_comments : string,Service_configuration : string,OBT_Reseller___Direct : string,Servicing_location : string,Assignment_date : Date,New_Business_volume__US__ : number,RevenueID : number,Implementation_Fee__PSD_ : number,EMEA_Country_to_charge : string,EMEA_Client : string,EMEA_OBT_standard_fee : number,EMEA_Included_for_accrual : string,EMEA_Accrual_date : Date,EMEA_Scope_description : string,EMEA_Billing_notes : string,Manual_Entry__Wave_2__Wave_3__etc_ : string,Project_Effort : number,Priority : number,Resource_Status : string,Global_Project_Manager_replacement : string,Regional_Project_Manager_replacement : string,Milestone__Assignee__Full_Name_replacement : string,Global_CIS_OBT_Lead_replacement : string,Global_CIS_HR_Feed_Specialist_replacement : string,Global_CIS_Portrait_Lead_replacement : string,Global_CIS_RoomIT_Integration_Lead_replacement : string,GoLiveDate :Date,ProjectStatus : string,ProjectLevel : string,GlobalProjectManager : string,RegionalProjectManager : string,AssigneeFullName : string,RecordStatus : string,DataSourceType : string)
  // {
  //   if(localStorage.getItem('Filters') == null){
  //     localStorage.setItem('Filters',JSON.stringify(this.filterEntity));
  //   }else{
  //     localStorage.removeItem('Filters');
  //     localStorage.setItem('Filters',JSON.stringify(this.filterEntity));
  //   }
  //   // if(DataSourceType == "iMeet 4SeriesData"){
  //   //   alert("You cannot update the "+DataSourceType+"");
  //   // }else {
  //     let p_data : ParsingData = {
  //       ButtonType : "Save",
  //       ManualID : ManualID,
  //       Client : Client,
  //       Implementation_Type : Implementation_Type,
  //       Pipeline_status : Pipeline_status,
  //       Pipeline_comments : Pipeline_comments,
  //       Service_configuration : Service_configuration,
  //       OBT_Reseller___Direct : OBT_Reseller___Direct,
  //       Assignment_date : Assignment_date,
  //       RevenueID : RevenueID,
  //       Project_Effort : Project_Effort,
  //       GoLiveDate : GoLiveDate,
  //       ProjectStatus : ProjectStatus,
  //       ProjectLevel : ProjectLevel,
  //       GlobalProjectManager : GlobalProjectManager,
  //       RegionalProjectManager : RegionalProjectManager,
  //       AssigneeFullName : AssigneeFullName,
  //       RecordStatus : RecordStatus,
  //       SelectionType : ""
  //     }
  //     const dialogRef = this.dialog.open(ManualDataEntry, {
  //       data : p_data
  //     });
  //     dialogRef.afterClosed().subscribe(result => {
  //       this.SelectionType = result.SelectionType;
  //       // var link = "/Dashboard/"+localStorage.getItem("UID")+"/AutomatedCLR";
  //       if(this.SelectionType == "Cancel"){
  //         // this.router.navigate(["/Dashboard",localStorage.getItem("UID"),"/AutomatedCLR"]);
  //         // localStorage.setItem("Navigate","AutoCLR");
  //         // this.router.navigate(["/Dashboard",localStorage.getItem("UID")])

  //         // this.router.navigateByUrl('/', {skipLocationChange : true}).then(()=>{
  //         //   this.router.navigate(["/Dashboard/AutomatedCLR"]);
  //         // })
  //         // var links = "AutomatedCLR";

  //         // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
  //         //   this.router.navigate([links],{relativeTo : this.route});
  //         // });
  //         // this.GetData();
  //       }else if(this.SelectionType == "Update" || this.SelectionType == "Replicate"){
  //         // this.router.navigateByUrl(link);
  //         this.GetData();
  //       }else{
  //       }
  //     });
  //   // }
  // }
}
// @Component({
//   selector: 'app-addingmanualdatadailog',
//   templateUrl: './adding-manualdata.component.html',
//   styleUrls: ['./adding-manualdata.component.css'],
//   encapsulation: ViewEncapsulation.None
// })
// export class ManualDataEntry {
//   LoginUID : string;
//   HeaderText : string;
//   ManualId : number;
//   RevenueID : number;
//   Implementation_Type : string;
//   Pipeline_status : string;
//   Pipeline_comments : string;
//   AssignePerson_R : string;RegionalManager_R : string;GlobalManager_R : string;
//   Service_configuration : string;
//   OBT_Reseller___Direct : string;
//   dateAssignment : Date;
//   Record_Status : string;
//   Project_Effort : number;
//   DateGolive : Date;
//   ProjectStatus : string;
//   ProjectLevel : string;
//   GlobalProjectManager : string;
//   RegionalProjectManager : string;
//   AssigneeFullName : string;
//   buttoncontent : string;
//   ManualRevenueID : number;
//   PipelineFields : boolean;
//   ReplicateField : boolean;
//   RevenueIDField : boolean;
//   dropdownList = [];
//   selectedItems = [];
//   todayDate : Date = new Date();
//   Workspacetitle_disable : boolean;
//   DateaddedCLR_disable : boolean;
//   CLRCountry_disable : boolean;
//   NewBusinessV_disable : boolean;
//   ImpFeePsd_disable : boolean;
//   dropdownSettings:IDropdownSettings;

//   Selectallchecked : boolean;
//   ImpTypechecked : boolean;PStatuschecked : boolean;PCommentschecked : boolean;ServiceConfigchecked : boolean;
//   OBTResellerchecked : boolean;AssignmentDatechecked : boolean;ProjectEffortchecked : boolean;Statuschecked : boolean;
//   AssignePersonchecked : boolean;RegionalManagerchecked : boolean;GlobalManagerchecked : boolean;
//   ProjectLevelchecked : boolean;
//   Selectallchecked_ngif : boolean;
//   ImpTypechecked_ngif : boolean;PStatuschecked_ngif : boolean;PCommentschecked_ngif : boolean;ProjectLevelchecked_ngif : boolean;ServiceConfigchecked_ngif : boolean;
//   OBTResellerchecked_ngif : boolean;AssignmentDatechecked_ngif : boolean; ProjectEffortchecked_ngif : boolean; Statuschecked_ngif : boolean;
//   AssignePerson_ngif : boolean;
//   ProjectLevel_ngif : boolean;
//   Update_Functionality : boolean;
//   NonReplicateFields : boolean;
//   constructor(
//     public datepipe : DatePipe,
//     public service : DashboardServiceService,
//     public dialogRef : MatDialogRef<ManualDataEntry>,
//     @Optional() @Inject(MAT_DIALOG_DATA) public data: ParsingData,
//     ) {
//       dialogRef.disableClose = true;
//       this.ManualId = data.ManualID;
//       this.RevenueID = data.RevenueID;
//       if(data.ButtonType == "Replicate"){
//         this.Update_Functionality = false;
//         this.ImpTypechecked_ngif = true;
//         this.PStatuschecked_ngif = true;
//         this.AssignePerson_ngif = true;
//         this.ProjectLevel_ngif = true;
//         this.PCommentschecked_ngif = true;
//         this.ProjectLevelchecked_ngif = true;
//         this.ServiceConfigchecked_ngif = true;
//         this.OBTResellerchecked_ngif = true;
//         this.AssignmentDatechecked_ngif = true;
//         this.ProjectEffortchecked_ngif = true;
//         this.Statuschecked_ngif = true;
//         this.Selectallchecked_ngif = true;
//         this.buttoncontent = data.ButtonType;
//         this.ReplicateField = true;
//         this.RevenueIDField = false;
//         this.HeaderText = "Replicate with other Clients";
//         this.Workspacetitle_disable = true;
//         this.DateaddedCLR_disable = true;
//         this.CLRCountry_disable = true;
//         this.NewBusinessV_disable = true;
//         this.ImpFeePsd_disable = true;
//         this.NonReplicateFields = false;
//       }else{
//         this.Update_Functionality = true;
//         this.ImpTypechecked_ngif = false;
//         this.PStatuschecked_ngif = false;
//         this.AssignePerson_ngif = false;
//         this.PCommentschecked_ngif = false;
//         this.ProjectLevelchecked_ngif = false;
//         this.ServiceConfigchecked_ngif = false;
//         this.OBTResellerchecked_ngif = false;
//         this.AssignmentDatechecked_ngif = false;
//         this.ProjectEffortchecked_ngif = false;
//         this.Statuschecked_ngif = false;
//         this.Selectallchecked_ngif = false;
//         this.ReplicateField = false;
//         this.RevenueIDField = true;
//         this.Workspacetitle_disable = false;
//         this.DateaddedCLR_disable = false;
//         this.CLRCountry_disable = false;
//         this.NewBusinessV_disable = false;
//         this.ImpFeePsd_disable = false;
//         this.NonReplicateFields = true;
//         if(data.ManualID < 0){
//           this.Implementation_Type = "";
//           this.Pipeline_status = "";
//           this.Pipeline_comments = "";
//           this.Service_configuration = "";
//           this.OBT_Reseller___Direct = "";
//           this.Project_Effort = 0;
//           this.ProjectStatus = "";
//           this.ProjectLevel = "";
//           this.GlobalProjectManager = "";
//           this.RegionalProjectManager = "";
//           this.AssigneeFullName = "";
//           this.Record_Status = "";
//           this.buttoncontent = "Save";
//           this.HeaderText = "Add New Client";
//         }else{
//           this.Implementation_Type = data.Implementation_Type;
//           this.Pipeline_status = data.Pipeline_status;
//           this.Pipeline_comments = data.Pipeline_comments;
//           this.Service_configuration = data.Service_configuration;
//           this.OBT_Reseller___Direct = data.OBT_Reseller___Direct;
//           this.Record_Status = data.RecordStatus;
//           if(data.Assignment_date == null){
//             this.dateAssignment = null;
//           }else{
//             this.dateAssignment = new Date(data.Assignment_date);
//           }
//           if(data.GoLiveDate == null){
//             this.DateGolive = null;
//           }else{
//             this.DateGolive = new Date(data.GoLiveDate);
//           }
//           this.Project_Effort = data.Project_Effort;
//           this.ProjectStatus = data.ProjectStatus;
//           this.ProjectLevel = data.ProjectLevel;
//           this.GlobalProjectManager = data.GlobalProjectManager;
//           this.RegionalProjectManager = data.RegionalProjectManager;
//           this.AssigneeFullName = data.AssigneeFullName;
//           this.buttoncontent = "Update";
//           this.HeaderText = "Update Client";
//         }
//         if(this.ProjectStatus == "P-Pipeline" || this.ProjectStatus == "HP-High Potential" || this.ProjectStatus == "EP-Early Potential"){
//           this.PipelineFields = true;
//           this.ProjectLevel_ngif = true;
//         }else{
//           this.PipelineFields = false;
//           this.ProjectLevel_ngif = false;
//         }
//       }

//       // set screenWidth on page load
//       this.screenWidth = window.innerWidth;
//       this.screenHeight = window.innerHeight;
//       window.onresize = () => {
//         // set screenWidth on screen size change
//         this.screenWidth = window.innerWidth;
//         this.screenHeight = window.innerHeight;
//       };
//     }
//   screenWidth: number;
//   screenHeight : number;
//   myDate = new Date();
//   myControl = new FormControl();
//   options : RevenueId_H[];
//   RevIDData : DropDownList[];
//   SelectedData : DropDownList[];
//   filteredOptions: Observable<RevenueId_H[]>;
//   OnCancelClick(){
//     this.dialogRef.close({SelectionType : 'Cancel'})
//   }
//   ngOnInit() {
//     this.LoginUID = localStorage.getItem("UID");
//     if(this.LoginUID == "" || this.LoginUID == null){
//       this.dialogRef.close();
//     }else{
//     }
//     this.Selectallchecked = false;
//     this.ImpTypechecked = false;
//     this.PStatuschecked = false;
//     this.GlobalManagerchecked = false;
//     this.RegionalManagerchecked = false;
//     this.AssignePersonchecked = false;
//     this.ProjectLevelchecked = false;
//     this.PCommentschecked = false;
//     this.ServiceConfigchecked = false;
//     this.OBTResellerchecked = false;
//     this.AssignmentDatechecked = false;
//     this.ProjectEffortchecked = false;
//     this.Statuschecked = false;
//     this.service.GetRevenueId().subscribe(data =>{
//       if(data.code == 200){
//         this.options = data.RevenueId;
//         this.RevIDData = data.RevenueId;
//         for(let i = 0;i<data.RevenueId.length;i++){
//           this.RevIDData[i].item_id = i+1;
//           this.RevIDData[i].item_text = data.RevenueId[i].RevenueID + ","+data.RevenueId[i].Workspace_Title+" - "+data.RevenueId[i].Region +" - "+data.RevenueId[i].CountryCode;
//         }
//         this.dropdownList = this.RevIDData;
//         this.dropdownSettings = {
//           singleSelection: false,
//           idField: 'item_id',
//           textField: 'item_text',
//           selectAllText: 'Select All',
//           unSelectAllText: 'UnSelect All',
//           itemsShowLimit: 10,
//           allowSearchFilter: true,
//           limitSelection: 100,
//         };
//       }
//       else{
//         alert(data.message);
//       }
//     })
//   }
//   checkUncheckSelectall(){
//     if(this.Selectallchecked == true){
//       this.Selectallchecked = true;
//       //this.Clientchecked = true;
//       this.ImpTypechecked = true;
//       this.PStatuschecked = true;
//       this.GlobalManagerchecked = true;
//       this.RegionalManagerchecked = true;
//       this.AssignePersonchecked = true;
//       this.ProjectLevelchecked = true;
//       this.PCommentschecked = true;
//       this.ServiceConfigchecked = true;
//       this.OBTResellerchecked = true;
//       this.AssignmentDatechecked = true;
//       this.ProjectEffortchecked = true;
//       this.Statuschecked = true;
//     }else{
//       this.Selectallchecked = false;
//       //this.Clientchecked = false;
//       this.ImpTypechecked = false;
//       this.PStatuschecked = false;
//       this.GlobalManagerchecked = false;
//       this.RegionalManagerchecked = false;
//       this.AssignePersonchecked = false;
//       this.ProjectLevelchecked = false;
//       this.PCommentschecked = false;
//       this.ServiceConfigchecked = false;
//       this.OBTResellerchecked = false;
//       this.AssignmentDatechecked = false;
//       this.ProjectEffortchecked = false;
//       this.Statuschecked = false;
//     }
//   }
//   OnSaveClick(){
//     if(this.Implementation_Type == null){
//       this.Implementation_Type = "";
//     }
//     if(this.Pipeline_status == null){
//       this.Pipeline_status = "";
//     }
//     if(this.Pipeline_comments == null){
//       this.Pipeline_comments = "";
//     }
//     if(this.Service_configuration == null){
//       this.Service_configuration = "";
//     }
//     if(this.OBT_Reseller___Direct == null){
//       this.OBT_Reseller___Direct = "";
//     }
//     if(this.Project_Effort == null){
//       this.Project_Effort = 1;
//     }
//     if(this.ProjectLevel == null){
//       this.ProjectLevel = "";
//     }
//     if(this.GlobalProjectManager == null){
//       this.GlobalProjectManager = "";
//     }
//     if(this.RegionalProjectManager == null){
//       this.RegionalProjectManager = "";
//     }
//     if(this.AssigneeFullName == null){
//       this.AssigneeFullName = "";
//     }
//     if(this.AssignePerson_R == null){
//       this.AssignePerson_R = "";
//     }
//     if(this.GlobalManager_R == null){
//       this.GlobalManager_R = "";
//     }
//     if(this.RegionalManager_R == null){
//       this.RegionalManager_R = "";
//     }
//     var Date;
//     if(this.dateAssignment == null){
//       Date = null;
//     }else{
//       Date = this.datepipe.transform(this.dateAssignment, "MM-dd-yyyy")+""
//     }
//     var DateGo_Live
//     if(this.DateGolive == null){
//       DateGo_Live = null;
//     }else{
//       DateGo_Live = this.datepipe.transform(this.DateGolive, "MM-dd-yyyy")+""
//     }
//     if(this.buttoncontent == "Replicate"){
//       this.SelectedData = this.selectedItems;
//       if(this.SelectedData.length <= 0){
//       }else{
//         var RevID;
//         for(let i=0;i<this.SelectedData.length;i++){
//           if(i == 0){
//             RevID = this.SelectedData[i].item_text.split(',')[0];
//           }else{
//             RevID += ","+this.SelectedData[i].item_text.split(',')[0];
//           }
//         }
//         this.service.ReplicatingManualData(RevID,
//         this.RevenueID,
//         this.Implementation_Type,
//         this.Pipeline_status,
//         this.Pipeline_comments,
//         this.Service_configuration,
//         this.OBT_Reseller___Direct,
//         Date,
//         this.RevenueID,
//         this.Project_Effort,
//         this.Record_Status,
//         this.ProjectLevel,
//         this.GlobalManager_R,
//         this.RegionalManager_R,
//         this.AssignePerson_R,
//         this.ImpTypechecked,
//         this.PStatuschecked,
//         this.PCommentschecked,
//         this.ServiceConfigchecked,
//         this.OBTResellerchecked,
//         this.AssignmentDatechecked,
//         this.ProjectEffortchecked,this.Statuschecked,this.ProjectLevelchecked,this.GlobalManagerchecked,this.RegionalManagerchecked,this.AssignePersonchecked,this.LoginUID).subscribe(data =>{
//           if(data.code = 200){
//             // alert(data.message+"");
//             this.dialogRef.close({SelectionType : 'Replicate'});
//           }else{
//             alert(data.message+"");
//           }
//         })
//         this.service.UsersUsageofReports(this.LoginUID,"A_CLR","Replicate").subscribe(data =>{
//         })
//       }
//     }else{
//       if(this.buttoncontent == "Save"){
//       }else{
//         if(this.ProjectStatus == "P-Pipeline" || this.ProjectStatus == "HP-High Potential" || this.ProjectStatus == "EP-Early Potential"){
//           this.service.UpdateManualPipelineColumns(this.ManualId,this.RevenueID,
//             this.Implementation_Type,
//             this.Pipeline_status,
//             this.Pipeline_comments,
//             this.Service_configuration,
//             this.OBT_Reseller___Direct,
//             Date,
//             this.RevenueID,
//             this.Project_Effort+'',
//             '',
//             DateGo_Live,
//             this.ProjectLevel,
//             this.GlobalProjectManager,
//             this.RegionalProjectManager,
//             this.AssigneeFullName,this.Record_Status,this.LoginUID).subscribe(data =>{
//               if(data.code == 200){
//                 // alert(data.message);
//                 this.dialogRef.close({SelectionType : 'Update'});
//               }else{
//                 alert(data.message);
//               }
//           });
//           this.service.UsersUsageofReports(this.LoginUID,"A_CLR","Update_Pipeline").subscribe(data =>{
//           })
//         }else{
//           this.service.UpdateManualColumns(this.ManualId,this.RevenueID,
//             this.Implementation_Type,
//             this.Pipeline_status,
//             this.Pipeline_comments,
//             this.Service_configuration,
//             this.OBT_Reseller___Direct,
//             Date,
//             this.RevenueID,
//             this.Project_Effort+"",
//             this.Record_Status,this.LoginUID
//             ).subscribe(data =>{
//               if(data.code == 200){
//                 // alert(data.message);
//                 this.dialogRef.close({SelectionType : 'Update'});
//               }else{
//                 alert(data.message);
//               }
//           });
//           this.service.UsersUsageofReports(this.LoginUID,"A_CLR","Update_Normal").subscribe(data =>{
//           })
//         }
//       }
//     }
//   }
//   OnApplyClick(){
//     this.service.GetManualdataUsingRevID(this.ManualRevenueID).subscribe(data =>{
//       if(data.code == 200){
//         this.Implementation_Type = data.Data[0].Implementation_Type;
//         this.Pipeline_status = data.Data[0].Pipeline_status;
//         this.Pipeline_comments = data.Data[0].Pipeline_comments;
//         this.Service_configuration = data.Data[0].Service_configuration;
//         this.OBT_Reseller___Direct = data.Data[0].OBT_Reseller___Direct;
//         this.dateAssignment = new Date(data.Data[0].Assignment_date);
//         this.Project_Effort = data.Data[0].Project_Effort;
//         this.Record_Status = data.Data[0].RecordStatus;
//       }else{
//       }
//     })
//   }
// }
// @Component({
//   selector: 'app-clrcommentdailog',
//   templateUrl: './clrcommentdailog.component.html',
//   styleUrls: ['./clrcommentdailog.component.css'],
//   encapsulation: ViewEncapsulation.None
// })
// export class CLRCommentdailog {
//   constructor(
//     public dialogRef: MatDialogRef<CLRCommentdailog>,
//     @Inject(MAT_DIALOG_DATA) public data: CLRDialogData) {}
//   onNoClick(): void {
//     this.dialogRef.close();
//   }
// }