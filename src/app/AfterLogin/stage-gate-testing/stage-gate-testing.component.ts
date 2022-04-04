import { Component, OnInit } from '@angular/core';
import { DashboardServiceService } from '../../dashboard-service.service';
import { SGYear, SGMonth, SGTaskStatus, SGProjectStatus } from '../../Models/SGFilters';
import { DatePipe } from '@angular/common';
import { LivedashboardComponent } from '../livedashboard/livedashboard.component';
import { ExcelService } from 'src/app/excel.service';
import { SGData } from 'src/app/Models/SGResponse';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-stage-gate-testing',
  templateUrl: './stage-gate-testing.component.html',
  styleUrls: ['./stage-gate-testing.component.css']
})
export class StageGateTestingComponent implements OnInit {
  displayedColumns : string[] = ['Client', 'Task1','Task2','Task3','Task4','Task5','GrandTotal'];
  displayedColumns2 : string[] = ['Client', 'Task1','Task2','Task3','Task4','Task5','Task6','Task7','Task8','Task9','Task10','Task11','Task12','Task13','Task14','Task15','Task16','Task17','Task18','Task19','Task20','Task21','GrandTotal'];
  dataSource2;
  dataSource;
  Apply_disable : boolean;
  yearList : SGYear[];
  yearListSelected : SGYear[];
  monthList : SGMonth[];
  monthListSelected : SGMonth[];
  TaskStatus : SGTaskStatus[];
  TaskStatusListSelected : SGTaskStatus[];
  ProjectStatusList : SGProjectStatus[];
  ProjectStatusListSelected : SGProjectStatus[];
  SelectedYears : any;SelectedMonths : any;SelectedTaskstatus : any;SelectedProjectstatus : any;
  masteryear : boolean;mastermonth : boolean;masterTaskstatus : any;masterProjectstatus : any;
  screenWidth : number;
  screenHeight : number;
  CurrentYear;
  CurrentMonth;
  LoginUID : string;
  SGData : SGData[];
  constructor(public service : DashboardServiceService,private excelService:ExcelService,private dashboard : LivedashboardComponent,public datepipe : DatePipe) {
    //set screenWidth on page load
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    window.onresize = () => {
      //set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    };
  }
  ngOnInit() {
    this.ResetFilters();
  }
  ResetFilters(){
    this.LoginUID = localStorage.getItem("UID");
    this.dashboard.ShowSpinnerHandler(true);
    this.service.StageGateFiltersList().subscribe(data =>{
      this.yearList = data.Year;
      this.masteryear = false;
      this.CurrentYear = (new Date()).getFullYear();
      for (var i = 0; i < this.yearList.length; i++) {
        if(this.yearList[i].Year == this.CurrentYear){
          this.yearList[i].isSelected = true;
        }else{
          this.yearList[i].isSelected = false;
        }
      }
      this.getSelectedYear();
      this.monthList = data.Months;
      this.mastermonth = false;
      this.CurrentMonth = this.datepipe.transform(new Date(),"MMM");
      for (var i = 0; i < this.monthList.length; i++) {
        if(this.monthList[i].Month == this.CurrentMonth){
          this.monthList[i].isSelected = true;
        }else{
          this.monthList[i].isSelected = false;
        }
      }
      this.getSelectedMonth();
      this.TaskStatus = data.TaskStatus;
      this.masterTaskstatus = false;
      for (var i = 0; i < this.TaskStatus.length; i++) {
        if(this.TaskStatus[i].Task_Status == "todo" || this.TaskStatus[i].Task_Status == "inprogress"){
          this.TaskStatus[i].isSelected = true;
        }else{
          this.TaskStatus[i].isSelected = false;
        }
      }
      this.getSelectedStatus();
      this.ProjectStatusList = data.ProjectStatus;
      this.masterProjectstatus = true;
      this.getPSelectedStatus();
      this.SetGraph();
    });
    this.Apply_disable = true;
  }
  SetGraph(){
    if(this.SelectedMonths == null || this.SelectedYears == null || this.SelectedTaskstatus == null || this.SelectedProjectstatus == null){
      alert("Please Select all Filters");
    }else{
      this.dashboard.ShowSpinnerHandler(true);
      this.service.StageGateDataList1(this.SelectedYears,this.SelectedMonths,this.SelectedTaskstatus,this.SelectedProjectstatus).subscribe(data =>{
        this.dataSource = data.Data;
        this.dashboard.ShowSpinnerHandler(false);
      });
      this.dashboard.ShowSpinnerHandler(true);
      this.service.StageGateDataList2(this.SelectedYears,this.SelectedMonths,this.SelectedTaskstatus,this.SelectedProjectstatus).subscribe(data =>{
        this.dataSource2 = data.Data;
        this.dashboard.ShowSpinnerHandler(false);
      });
      this.Apply_disable = true;
    }
  }
  OOexportData(){
    if(this.SelectedMonths == null || this.SelectedYears == null || this.SelectedTaskstatus == null || this.SelectedProjectstatus == null){
      alert("Please Select all Filters");
    }else{
      this.dashboard.ShowSpinnerHandler(true);
      this.service.StageGateDataExport(this.SelectedYears,this.SelectedMonths,this.SelectedTaskstatus,this.SelectedProjectstatus,"OnlineOffline").subscribe(data =>{ 
        if(data.code == 200){
          this.SGData = data.Data;
          for(let i = 0;i < data.Data.length ;i++){
            if(this.SGData[i].Task_Start_Date == null){
              this.SGData[i].Task_Start_Date_c = null;
            }else{
              this.SGData[i].Task_Start_Date_c = this.datepipe.transform(this.SGData[i].Task_Start_Date, "MM-dd-yyyy");
            }
            if(this.SGData[i].Task_Due_Date == null){
              this.SGData[i].Task_Due_Date_c = null;
            }else{
              this.SGData[i].Task_Due_Date_c = this.datepipe.transform(this.SGData[i].Task_Due_Date, "MM-dd-yyyy");
            }
          }
          const CustomizedData = this.SGData.map(o => {
            return { 'Task Title': o.Task_Title,
              'Task Start Date' : o.Task_Start_Date_c,
              'Task Due Date' : o.Task_Due_Date_c,
              'Workspace Title' : o.Workspace_Title,
              'Task Assignee Full Name' : o.Task__Assignee__Full_Name,
              'Milestone Assignee Full Name' : o.Milestone__Assignee__Full_Name,
              'Milestone Assignee Reports to Full Name' : o.Milestone__Assignee__Reports_to__Full_Name,
              'Task Status' : o.Task_Status,
              'Milestone Assignee Country' : o.Milestone__Assignee__Country,
              'Month' : o.Month,
              'Year' : o.Year,
              'Milestone Project Status' : o.Milestone__Project_Status
            };
          });
          this.excelService.exportAsExcelFile(CustomizedData, 'StageGate-Offline/Online');
        }else{
          alert("Something went wrong, Please try again later")
        }
        this.service.UsersUsageofReports(this.LoginUID,"Stage Gate","Offline/Online Export").subscribe(data =>{
        })
        this.dashboard.ShowSpinnerHandler(false);
      });
    }
  }
  TTexportData(){
    if(this.SelectedMonths == null || this.SelectedYears == null || this.SelectedTaskstatus == null || this.SelectedProjectstatus == null){
      alert("Please Select all Filters");
    }else{
      this.dashboard.ShowSpinnerHandler(true);
      this.service.StageGateDataExport(this.SelectedYears,this.SelectedMonths,this.SelectedTaskstatus,this.SelectedProjectstatus,"TestingTask").subscribe(data =>{ 
        if(data.code == 200){
          this.SGData = data.Data;
          for(let i = 0;i < data.Data.length ;i++){
            if(this.SGData[i].Task_Start_Date == null){
              this.SGData[i].Task_Start_Date_c = null;
            }else{
              this.SGData[i].Task_Start_Date_c = this.datepipe.transform(this.SGData[i].Task_Start_Date, "MM-dd-yyyy");
            }
            if(this.SGData[i].Task_Due_Date == null){
              this.SGData[i].Task_Due_Date_c = null;
            }else{
              this.SGData[i].Task_Due_Date_c = this.datepipe.transform(this.SGData[i].Task_Due_Date, "MM-dd-yyyy");
            }
          }
          const CustomizedData = this.SGData.map(o => {
            return { 'Task Title': o.Task_Title,
              'Task Start Date' : o.Task_Start_Date_c,
              'Task Due Date' : o.Task_Due_Date_c,
              'Workspace Title' : o.Workspace_Title,
              'Task Assignee Full Name' : o.Task__Assignee__Full_Name,
              'Milestone Assignee Full Name' : o.Milestone__Assignee__Full_Name,
              'Milestone Assignee Reports to Full Name' : o.Milestone__Assignee__Reports_to__Full_Name,
              'Task Status' : o.Task_Status,
              'Milestone Assignee Country' : o.Milestone__Assignee__Country,
              'Month' : o.Month,
              'Year' : o.Year,
              'Milestone Project Status' : o.Milestone__Project_Status
            };
          });
          this.excelService.exportAsExcelFile(CustomizedData, 'StageGate-Testing Task');
        }else{
          alert("Something went wrong, Please try again later")
        }
        this.service.UsersUsageofReports(this.LoginUID,"Stage Gate","TestingTask Export").subscribe(data =>{
        })
        this.dashboard.ShowSpinnerHandler(false);
      });
    }
  }
  //Start of Year methods
  checkUncheckYears() {
    for (var i = 0; i < this.yearList.length; i++) {
      this.yearList[i].isSelected = this.masteryear;
    }
    this.getSelectedYear();
  }
  yearsSelected() {
    this.masteryear = this.yearList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedYear();
  }
  getSelectedYear(){
    this.Apply_disable = false;
    this.SelectedYears = null;
    for(let i=0;i<this.yearList.length;i++){
      if(this.yearList[i].isSelected == true){
        if(this.SelectedYears == null){
          this.SelectedYears = this.yearList[i].Year;
        }else{
          this.SelectedYears += ","+this.yearList[i].Year;
        }
      }else{
      }
    }
    this.yearListSelected = this.yearList.filter(s => s.isSelected == true);
  }
  deselectyear(val : string){
    for(let i=0;i<this.yearList.length;i++){
      if(this.yearList[i].Year == val){
        this.yearList[i].isSelected = false;
      }else{
      }
    }
    this.yearsSelected();
  }
  //End of Year Methods
  //Start of Month Methods
  checkUncheckMonths() {
    for (var i = 0; i < this.monthList.length; i++) {
      this.monthList[i].isSelected = this.mastermonth;
    }
    this.getSelectedMonth();
  }
  monthsSelected() {
    this.mastermonth = this.monthList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedMonth();
  }
  getSelectedMonth(){
    this.Apply_disable = false;
    this.SelectedMonths = null;
    for(let i=0;i<this.monthList.length;i++){
      if(this.monthList[i].isSelected == true){
        if(this.SelectedMonths == null){
          this.SelectedMonths = this.monthList[i].Month;
        }else{
          this.SelectedMonths += ","+this.monthList[i].Month;
        }
      }else{
      }
    }
    this.monthListSelected = this.monthList.filter(s => s.isSelected == true);
  }
  deselectmonth(val : string){
    for(let i=0;i<this.monthList.length;i++){
      if(this.monthList[i].Month == val){
        this.monthList[i].isSelected = false;
      }else{
      }
    }
    this.monthsSelected();
  }

  //End of Month Methods
  //Start of Status Methods
  checkUncheckStatus() {
    for (var i = 0; i < this.TaskStatus.length; i++) {
      this.TaskStatus[i].isSelected = this.masterTaskstatus;
    }
    this.getSelectedStatus();
  }
  statusSelected() {
    this.masterTaskstatus = this.TaskStatus.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedStatus();
  }
  getSelectedStatus(){
    this.Apply_disable = false;
    this.SelectedTaskstatus = null;
    for(let i=0;i<this.TaskStatus.length;i++){
      if(this.TaskStatus[i].isSelected == true){
        if(this.SelectedTaskstatus == null){
          this.SelectedTaskstatus = this.TaskStatus[i].Task_Status;
        }else{
          this.SelectedTaskstatus += ","+this.TaskStatus[i].Task_Status;
        }
      }else{
      }
    }
    this.TaskStatusListSelected = this.TaskStatus.filter(s => s.isSelected == true);
  }
  deselectstatus(val : string){
    for(let i=0;i<this.TaskStatus.length;i++){
      if(this.TaskStatus[i].Task_Status == val){
        this.TaskStatus[i].isSelected = false;
      }else{
      }
    }
    this.statusSelected();
  }
  //End of Status Methods
  //Start of Project Status Methods
  checkUncheckPStatus() {
    for (var i = 0; i < this.ProjectStatusList.length; i++) {
      this.ProjectStatusList[i].isSelected = this.masterProjectstatus;
    }
    this.getPSelectedStatus();
  }
  PstatusSelected() {
    this.masterProjectstatus = this.ProjectStatusList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getPSelectedStatus();
  }
  getPSelectedStatus(){
    this.Apply_disable = false;
    this.SelectedProjectstatus = null;
    for(let i=0;i<this.ProjectStatusList.length;i++){
      if(this.ProjectStatusList[i].isSelected == true){
        if(this.SelectedProjectstatus == null){
          this.SelectedProjectstatus = this.ProjectStatusList[i].Project_Status;
        }else{
          this.SelectedProjectstatus += ","+this.ProjectStatusList[i].Project_Status;
        }
      }else{
      }
    }
    this.ProjectStatusListSelected = this.ProjectStatusList.filter(s => s.isSelected == true);
  }
  deselectPstatus(val : string){
    for(let i=0;i<this.ProjectStatusList.length;i++){
      if(this.ProjectStatusList[i].Project_Status == val){
        this.ProjectStatusList[i].isSelected = false;
      }else{
      }
    }
    this.PstatusSelected();
  }
  //End of Project Status
}
