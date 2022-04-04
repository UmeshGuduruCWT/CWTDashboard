import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DashboardServiceService } from '../../dashboard-service.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Region, Status } from '../../Models/LLFilters';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LLData } from 'src/app/Models/LlResponse';
import { DatePipe } from '@angular/common';
import { LivedashboardComponent } from '../livedashboard/livedashboard.component';
import { ExcelService } from 'src/app/excel.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
export interface LLDialogData {
  Dailog_Client : string;
  Dailog_RevenueID : string;
  Dailog_Comment : string;
}
@Component({
  selector: 'app-lessons-learnt',
  templateUrl: './lessons-learnt.component.html',
  styleUrls: ['./lessons-learnt.component.css']
})
export class LessonsLearntComponent implements OnInit {
  displayedColumns : string[] = ['iMeet_Workspace_Title','Date_feedback_raised_c','Country_Area_of_Responsibility','Region','What_was_the_event_issue_concern','Is_there_any_specific_recognition_to_a_person_group_process_rela','Go_Live_Date_c','Reason_Type','Created_by_Field','Leader','Reason_Code__Added_by_Leader_','What_do_you_recommend___to_avoid_this_occurring_again_in_future','Status__By_Leader_','Action_Taken__By_Leader_'];
  dataSource;
  masterRegion : boolean; masterStatus : boolean;
  RegionList : Region[];
  StatusList : Status[];
  Apply_disable : boolean;
  Dailog_Comment : string;
  Dailog_RevenueID : string;
  Dailog_Client : string;
  screenWidth : number;
  screenWidth2 : number;
  screenHeight : number;
  SelectedRegion : any; SelectedStatus : any;
  LLdata : LLData[];
  LoginUID : string;
  SlidingButton : boolean = false;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(public service : DashboardServiceService,private excelService:ExcelService,public dialog: MatDialog,public datepipe : DatePipe,private dashboard : LivedashboardComponent) {
    //set screenWidth on page load
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    window.onresize = () => {
      //set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    };
   }
  // FilterButtonClick(){
  //   this.screenWidth2 = ((this.screenWidth)*15)/100;
  //   if(this.SlidingButton == true){
  //     this.SlidingButton = false;
  //   }else{
  //     this.SlidingButton = true;
  //   }
  // }
  ngOnInit() {
    this.ResetFilters();
  }
  ResetFilters(){
    this.LoginUID = localStorage.getItem("UID");
    this.dashboard.ShowSpinnerHandler(true);
    this.service.LessonsLearntFiltersList().subscribe(data => {
      this.RegionList = data.Region;
      this.masterRegion = true;
      this.getSelectedRegion();
      this.StatusList = data.Status;
      this.masterStatus = false;
      for (var i = 0; i < this.StatusList.length; i++) {
        if(this.StatusList[i].Status == "Open"){
          this.StatusList[i].isSelected = true;
        }else{
          this.StatusList[i].isSelected = false;
        }
      }
      this.getSelectedStatus();
      this.Apply_disable = false;
      this.GetLessonsLearnt();
      this.dashboard.ShowSpinnerHandler(false);
    })
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(LessonsLearntdailog, {
      width: '400px',
      data: {Dailog_Comment: this.Dailog_Comment,Dailog_Client : this.Dailog_Client,Dailog_RevenueID : this.Dailog_RevenueID}
    });
    dialogRef.afterClosed().subscribe(result => {
      //this.Comment = result;
    });
  }
  ShowComment(Dailog_Client : string,Dailog_RevenueID : string,Dailog_Comment : string){
    this.Dailog_Client = Dailog_Client;
    this.Dailog_RevenueID = Dailog_RevenueID;
    this.Dailog_Comment = Dailog_Comment;
    this.openDialog();
  }
  GetLessonsLearnt(){
    this.dashboard.ShowSpinnerHandler(true);
    if(this.SelectedRegion == null || this.SelectedStatus == null){
      alert("Please select the all Fields");
      this.Apply_disable = false;
      this.dashboard.ShowSpinnerHandler(false);
    }else{
      this.Apply_disable = true;
      this.service.LessonsLearnt(this.SelectedStatus,this.SelectedRegion).subscribe(data => {
        if(data.code == 200){
          this.LLdata = data.Data;
          for(let i = 0;i < data.Data.length ;i++){
            if(this.LLdata[i].Date_feedback_raised == null){
              this.LLdata[i].Date_feedback_raised_c = null;
            }else{
              this.LLdata[i].Date_feedback_raised_c = this.datepipe.transform(this.LLdata[i].Date_feedback_raised, "MM-dd-yyyy");
            }
            if(this.LLdata[i].Go_Live_Date == null){
              this.LLdata[i].Go_Live_Date_c = null;
            }else{
              this.LLdata[i].Go_Live_Date_c = this.datepipe.transform(this.LLdata[i].Go_Live_Date, "MM-dd-yyyy");
            }
          }
          this.dataSource = new MatTableDataSource(this.LLdata);
          this.dataSource.sort = this.sort;
          //this.dataSource.sort = this.sort;
          this.dashboard.ShowSpinnerHandler(false);
        }else{
          alert("Something went wrong,Please try again later");
          this.dashboard.ShowSpinnerHandler(false);
        }
      })
    }
  }
  //Start of Region Methods
  checkUncheckRegion() {
    for (var i = 0; i < this.RegionList.length; i++) {
      this.RegionList[i].isSelected = this.masterRegion;
    }
    this.getSelectedRegion();
  }
  RegionSelected() {
    this.masterRegion = this.RegionList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedRegion();
  }
  getSelectedRegion(){
    this.Apply_disable = false;
    this.SelectedRegion = null;
    for(let i=0;i<this.RegionList.length;i++){
      if(this.RegionList[i].isSelected == true){
        if(this.SelectedRegion == null){
          if(this.RegionList[i].Region == null){
            this.SelectedRegion = "null";
          }else{
            this.SelectedRegion = this.RegionList[i].Region;
          }
        }else{
          this.SelectedRegion += ","+this.RegionList[i].Region;
        }
      }else{
      }
    }
  }
  ExportData(){
    this.dashboard.ShowSpinnerHandler(true);
    this.service.LessonsLearnt(this.SelectedStatus,this.SelectedRegion).subscribe(data =>{ 
      if(data.code == 200){
        this.LLdata = data.Data;
        for(let i = 0;i < data.Data.length ;i++){
          if(this.LLdata[i].Date_feedback_raised == null){
            this.LLdata[i].Date_feedback_raised_c = null;
          }else{
            this.LLdata[i].Date_feedback_raised_c = this.datepipe.transform(this.LLdata[i].Date_feedback_raised, "MM-dd-yyyy");
          }
          if(this.LLdata[i].Go_Live_Date == null){
            this.LLdata[i].Go_Live_Date_c = null;
          }else{
            this.LLdata[i].Go_Live_Date_c = this.datepipe.transform(this.LLdata[i].Go_Live_Date, "MM-dd-yyyy");
          }
        }
        const CustomizedData = this.LLdata.map(o => {
          return { 'iMeet Workspace Title': o.iMeet_Workspace_Title,
            'Record ID' : o.Record_ID,
            'Date feedback raised' : o.Date_feedback_raised_c,
            'Country Area of Responsibility' : o.Country_Area_of_Responsibility,
            'Region' : o.Region,
            'What was the event/issue/concern' : o.What_was_the_event_issue_concern,
            'Is there any specific recognition to a person group process relation' : o.Is_there_any_specific_recognition_to_a_person_group_process_rela,
            'Go Live Date' : o.Go_Live_Date_c,
            'Reason Type' : o.Reason_Type,
            'Created by Field' : o.Created_by_Field,
            'Leader' : o.Leader,
            'Reason Code Added by Leader' : o.Reason_Code__Added_by_Leader_,
            'What do you recommend to avoid this occurring again in future' : o.What_do_you_recommend___to_avoid_this_occurring_again_in_future,
            'Status By Leader' : o.Status__By_Leader_,
            'Action Taken By Leader' : o.Action_Taken__By_Leader_
          };
        });
        this.excelService.exportAsExcelFile(CustomizedData, 'LessonsLearnt');
      }else{
        alert("Something went wrong, Please try again later")
      }
      this.service.UsersUsageofReports(this.LoginUID,"Lessons Learnt","Export").subscribe(data =>{
      })
      this.dashboard.ShowSpinnerHandler(false);
    });
  }
  //End of Region Methods
  //Start of Status Methods
  checkUncheckStatus() {
    for (var i = 0; i < this.StatusList.length; i++) {
      this.StatusList[i].isSelected = this.masterStatus;
    }
    this.getSelectedStatus();
  }
  StatusSelected() {
    this.masterStatus = this.StatusList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedStatus();
  }
  getSelectedStatus(){
    this.Apply_disable = false;
    this.SelectedStatus = null;
    for(let i=0;i<this.StatusList.length;i++){
      if(this.StatusList[i].isSelected == true){
        if(this.SelectedStatus == null){
          if(this.StatusList[i].Status == null){
            this.SelectedStatus = "null";
          }else{
            this.SelectedStatus = this.StatusList[i].Status;
          }
        }else{
          this.SelectedStatus += ","+this.StatusList[i].Status;
        }
      }else{
      }
    }
  }
  //End of Status Methods
}

@Component({
  selector: 'app-lessonslearntdailog',
  templateUrl: './lessonslearntdailog.component.html',
  // styleUrls: ['./clrcommentdailog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LessonsLearntdailog {
  constructor(
    public dialogRef: MatDialogRef<LessonsLearntdailog>,
    @Inject(MAT_DIALOG_DATA) public data: LLDialogData) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}