import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardServiceService } from 'src/app/dashboard-service.service';
import { ExcelService } from 'src/app/excel.service';
import { FilterPipelineStatu, FilterProjectLevel, FilterProjectStatu, FilterStatu } from 'src/app/Models/AutomatedCLRFilters';
import { CLRCommentdailog } from '../automated-clr/automated-clr.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LivedashboardComponent } from '../livedashboard/livedashboard.component';

@Component({
  selector: 'app-resource-assignment',
  templateUrl: './resource-assignment.component.html',
  styleUrls: ['./resource-assignment.component.css']
})
export class ResourceAssignmentComponent implements OnInit {
  constructor(public datepipe : DatePipe,public service : DashboardServiceService,private excelService:ExcelService,public dialog: MatDialog,public dashboard : LivedashboardComponent) {
    //set screenWidth on page load
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    window.onresize = () => {
      //set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    }
  }
  FilteredCount;
  PipelineStatusList : FilterPipelineStatu[];
  ProjectStatusList : FilterProjectStatu[];
  ProjectLevelList : FilterProjectLevel[];
  RecordStatusList : FilterStatu[];
  dataSource;
  displayedColumns: string[] = ['Client','Line_Win_Probability','Opportunity_Owner','Region','Country','ImplementationType','OBTResellerDirect','Service_Configuration','GlobalProjectManager','RegionalProjectManager','LocalProjectManager','GlobalCISOBTLead','RegionalCISOBTLead','Pipeline_comments','DataDescription','Next_Step','RevenueVolumeUSD'];
  screenHeight;screenWidth;
  Apply_disable : boolean;
  SelectedProjectStatus : any;SelectedStatus : any;SelectedPipelineStatus : any;SelectedLevel : any;
  masterrecordstatus;masterprojectstatus;masterlevel;masterpipelinestatus;
  @ViewChild(MatSort) sort: MatSort;
  ngOnInit(): void {
    this.ResetFilters();
  }
  ResetFilters(){
    this.dashboard.ShowSpinnerHandler(true);
    this.service.ResourceAssignmentFilters().subscribe(data =>{
      console.log(data);
      if(data.code == 200){
        this.PipelineStatusList = data.FilterPipeline_status;
        this.masterpipelinestatus = true;
        this.getSelectedPipelineStatus();
        this.ProjectStatusList = data.FilterProjectStatus;
        this.masterprojectstatus = false;
      for (var i = 0; i < this.ProjectStatusList.length; i++) {
        if(this.ProjectStatusList[i].ProjectStatus == "P-Pipeline"){
          this.ProjectStatusList[i].isSelected = true;
        }
        else{
          this.ProjectStatusList[i].isSelected = false;
        }
      }
      this.getSelectedProjectStatus();
      this.RecordStatusList = data.FilterStatus;
      this.masterrecordstatus = true;
      this.getSelectedRecordStatus();
      this.ProjectLevelList = data.FilterProjectLevel;
      this.masterlevel = true;
      this.getSelectedProjectLevel();
      this.GetData();
      }
      this.dashboard.ShowSpinnerHandler(false);
    });
    this.Apply_disable = true;
  }
  isLoading;
  imageUrl : string = "assets/images/cwt.png";
  GetData(){
    this.dashboard.ShowSpinnerHandler(true);
    this.isLoading = true;
    this.service.ResourceAssignmentData(this.SelectedProjectStatus,this.SelectedLevel).subscribe(data => {
      for(let i = 0;i<data.Data.length;i++){
        if(data.Data[i].RevenueVolumeUSD == null){
          data.Data[i].RevenueVolume = "$0";
        }else{
          data.Data[i].RevenueVolume = Math.round(data.Data[i].RevenueVolumeUSD).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
      }
      this.dataSource = new MatTableDataSource(data.Data);
      this.dataSource.sort = this.sort;
      this.FilteredCount = this.dataSource.filteredData.length;
      this.dashboard.ShowSpinnerHandler(false);
      this.isLoading = false;
    },error => (this.isLoading = false))
  }
  Export(){
    this.dashboard.ShowSpinnerHandler(true);
    this.service.ResourceAssignmentData(this.SelectedProjectStatus,this.SelectedLevel).subscribe(data => {
      for(let i = 0;i<data.Data.length;i++){
        if(data.Data[i].RevenueVolumeUSD == null){
          data.Data[i].RevenueVolume = "$0";
        }else{
          data.Data[i].RevenueVolume = Math.round(data.Data[i].RevenueVolumeUSD).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
      }
      const CustomizedData = data.Data.map(o => {
        return {
          'Client' : o.Client,
          'Revenue ID' : o.RevenueID,
          'Line Win Probability' : o.Line_Win_Probability,
          'Opportunity Owner' : o.Opportunity_Owner,
          'Region' : o.Region,
          'Country' : o.Country,
          'Implementation Type' : o.ImplementationType,
          'OBT Reseller Direct' : o.OBTResellerDirect,
          'Service Configuration' : o.Service_Configuration,
          'Global Project Manager' : o.GlobalProjectManager,
          'Regional Project Manager' : o.RegionalProjectManager,
          'Local Project Manager' : o.LocalProjectManager,
          'Global Digital OBT Lead' : o.GlobalCISOBTLead,
          'Regional Digital OBT Lead' : o.RegionalCISOBTLead,
          'Pipeline comments' : o.Pipeline_comments,
          'CRM Description' : o.DataDescription,
          'Next Step' : o.Next_Step,
          'Revenue Volume USD' : o.RevenueVolumeUSD,
        };
      });
      //this.dataSource = this.CLRData;
      this.excelService.exportAsExcelFile(CustomizedData, 'Resource Assignment');
      this.dashboard.ShowSpinnerHandler(false);
      this.isLoading = false;
    })
  }
  Dailog_Comment : string;
  Dailog_RevenueID : string;
  Dailog_Client : string;
  ShowComment(Dailog_Client : string,Dailog_RevenueID : string,Dailog_Comment : string){
    this.Dailog_Client = Dailog_Client;
    this.Dailog_RevenueID = Dailog_RevenueID;
    this.Dailog_Comment = Dailog_Comment;
    this.openDialog();
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.FilteredCount = this.dataSource.filteredData.length;
  }
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
  checkUncheckRecordStatus(){
    for (var i = 0; i < this.RecordStatusList.length; i++) {
      this.RecordStatusList[i].isSelected = this.masterrecordstatus;
    }
    this.getSelectedRecordStatus();
  }
  RecordStatusSelected(){
    this.masterrecordstatus = this.RecordStatusList.every(function(item:any) {
      return item.isSelected == true;
    })
    this.getSelectedRecordStatus();
  }
  getSelectedRecordStatus(){
    this.Apply_disable = false;
    this.SelectedStatus = null;
    for(let i=0;i<this.RecordStatusList.length;i++){
      if(this.RecordStatusList[i].isSelected == true){
        if(this.SelectedStatus == null){
          if(this.RecordStatusList[i].Status == null || this.RecordStatusList[i].Status == ""){
            this.SelectedStatus = ",";
          }else{
            this.SelectedStatus = this.RecordStatusList[i].Status;
          }
        }else{
          this.SelectedStatus += ","+this.RecordStatusList[i].Status;
        }
      }else{
      }
    }
  }
  checkUncheckProjectLevel(){
    for (var i = 0; i < this.ProjectLevelList.length; i++) {
      this.ProjectLevelList[i].isSelected = this.masterlevel;
    }
    this.getSelectedProjectLevel();
  }
  ProjectLevelSelected(){
    this.masterlevel = this.ProjectLevelList.every(function(item:any) {
      return item.isSelected == true;
    })
    this.getSelectedProjectLevel();
  }
  getSelectedProjectLevel(){
    this.Apply_disable = false;
    this.SelectedLevel = null;
    for(let i=0;i<this.ProjectLevelList.length;i++){
      if(this.ProjectLevelList[i].isSelected == true){
        if(this.SelectedLevel == null){
          if(this.ProjectLevelList[i].ProjectLevel == null || this.ProjectLevelList[i].ProjectLevel == ""){
            this.SelectedLevel = ",";
          }else{
            this.SelectedLevel = this.ProjectLevelList[i].ProjectLevel;
          }
        }else{
          this.SelectedLevel += ","+this.ProjectLevelList[i].ProjectLevel;
        }
      }else{
      }
    }
  }
  checkUncheckProjectStatus(){
    for (var i = 0; i < this.ProjectStatusList.length; i++) {
      this.ProjectStatusList[i].isSelected = this.masterprojectstatus;
    }
    this.getSelectedProjectStatus();
  }
  ProjectStatusSelected(){
    this.masterprojectstatus = this.ProjectStatusList.every(function(item:any) {
      return item.isSelected == true;
    })
    this.getSelectedProjectStatus();
  }
  getSelectedProjectStatus(){
    this.Apply_disable = false;
    this.SelectedProjectStatus = null;
    for(let i=0;i<this.ProjectStatusList.length;i++){
      if(this.ProjectStatusList[i].isSelected == true){
        if(this.SelectedProjectStatus == null){
          if(this.ProjectStatusList[i].ProjectStatus == null || this.ProjectStatusList[i].ProjectStatus == ""){
            this.SelectedProjectStatus = ",";
          }else{
            this.SelectedProjectStatus = this.ProjectStatusList[i].ProjectStatus;
          }
        }else{
          this.SelectedProjectStatus += ","+this.ProjectStatusList[i].ProjectStatus;
        }
      }else{
      }
    }
  }
  checkUncheckPipelineStatus(){
    for (var i = 0; i < this.PipelineStatusList.length; i++) {
      this.PipelineStatusList[i].isSelected = this.masterpipelinestatus;
    }
    this.getSelectedPipelineStatus();
  }
  PipelineStatusSelected(){
    this.masterpipelinestatus = this.PipelineStatusList.every(function(item:any) {
      return item.isSelected == true;
    })
    this.getSelectedPipelineStatus();
  }
  getSelectedPipelineStatus(){
    this.Apply_disable = false;
    this.SelectedPipelineStatus = null;
    for(let i=0;i<this.PipelineStatusList.length;i++){
      if(this.PipelineStatusList[i].isSelected == true){
        if(this.SelectedPipelineStatus == null){
          if(this.PipelineStatusList[i].Pipeline_status == null || this.PipelineStatusList[i].Pipeline_status == ""){
            this.SelectedPipelineStatus = ",";
          }else{
            this.SelectedPipelineStatus = this.PipelineStatusList[i].Pipeline_status;
          }
        }else{
          this.SelectedPipelineStatus += ","+this.PipelineStatusList[i].Pipeline_status;
        }
      }else{
      }
    }
  }
}
