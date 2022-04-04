import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardServiceService } from 'src/app/dashboard-service.service';
import { LivedashboardComponent } from '../livedashboard/livedashboard.component';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {
  displayedColumns : string[] = ['ConfigID', 'ProjectType','Duration','Status','actions'];
  dataSource;
  constructor(
    public service : DashboardServiceService,public dashboard : LivedashboardComponent,public dialog: MatDialog,public datepipe : DatePipe) { 
      //set screenWidth on page load
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      window.onresize = () => {
        //set screenWidth on screen size change
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
      };
  }
  HeaderText : string = "Add Config";
  ProjectType : string;
  Record_Status : string = "Active";
  ConfigID : number;
  Duration : number;
  screenWidth : number;
  screenHeight : number;
  NgIfStatus : boolean = true;
  NgIfbutton : boolean = false;
  ngOnInit(): void {
    this.GetData();
  }
  ButtonName : string = "Save";
  OnSaveClick(){
    if(this.ProjectType == "" || this.ProjectType == null || this.Duration == null || this.Record_Status == null || this.Record_Status == ""){
      alert("Please fill all fields");
    }else{
      if(this.ButtonName == "Save"){
        this.dashboard.ShowSpinnerHandler(true);
        this.service.ConfigInsert(this.ProjectType,this.Duration+"",this.Record_Status,localStorage.getItem("UID")).subscribe(data=>{
          if(data.code == 200){
            alert(data.message);
            this.GetData();
            this.OnCancelClick();
          }else{
            alert(data.message);
          }
          this.dashboard.ShowSpinnerHandler(false);
        })
      }else if(this.ButtonName == "Update"){
        this.dashboard.ShowSpinnerHandler(true);
        this.service.ConfigUpdate(this.ConfigID+"",this.ProjectType,this.Duration+"",this.Record_Status,localStorage.getItem("UID")).subscribe(data=>{
          if(data.code == 200){
            alert(data.message);
            this.GetData();
            this.OnCancelClick();
          }else{
            alert(data.message);
          }
          this.dashboard.ShowSpinnerHandler(true);
        })
      }else{
      }
    }
  }
  OnCancelClick(){
    this.Record_Status = "Active";
    this.ProjectType = "";
    this.ButtonName = "Save";
    this.HeaderText = "Add Config";
    this.ConfigID = null;
    this.Duration = null;
    this.NgIfStatus = true;
    this.NgIfbutton = false;
  }
  GetData(){
    this.dashboard.ShowSpinnerHandler(true);
    this.service.ConfigData().subscribe(data=>{
      if(data.code == 200){
        this.dataSource = new MatTableDataSource(data.Data);
      }
      this.dashboard.ShowSpinnerHandler(false);
    })
  }
  openDialog(ID,ProjectType): void {
    let p_data : ConfigDeleteDailogData = {
      ConfigId : ID,
      Name : localStorage.getItem("Username"),
      ProjectType : ProjectType,
    }
    const dialogRef = this.dialog.open(ConfigDeleteDialog, {
      data: p_data
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.SelectionType == "Delete"){
        this.GetData();
      }else{
      }
    });
  }
  DeleteUser(ID : string,ProjectType : string){
    this.openDialog(ID,ProjectType);
  }
  RowSelected(ID : number,ProjectType : string,Duration : number,Status : string){
    this.HeaderText = "Update Config";
    this.ProjectType = ProjectType;
    this.Duration = Duration;
    this.Record_Status = Status;
    this.ConfigID = ID;
    this.ButtonName = "Update";
    this.NgIfStatus = false;
    this.NgIfbutton = true;
  }
}
export interface ConfigDeleteDailogData {
  ConfigId : string;
  Name : string;
  ProjectType : string;
}
@Component({
  selector: 'app-configdeletedailog',
  templateUrl: './configdeletedailog.component.html'
})
export class ConfigDeleteDialog {
  constructor(
    public datepipe : DatePipe,
    public service : DashboardServiceService,
    public dialogRef: MatDialogRef<ConfigDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ConfigDeleteDailogData) {
    }
  ngOnInit() {
  }
  onYesClick(){
    this.service.ConfigDelete(this.data.ConfigId,localStorage.getItem("UID")).subscribe(data=>{
      if(data.code == 200){
        alert(data.message);
        this.dialogRef.close({SelectionType : 'Delete'});
      }else{
        alert(data.message);
        this.dialogRef.close({SelectionType : 'Cancel'});
      }
    })
  }
  onNoClick(){
    this.dialogRef.close({SelectionType : 'Cancel'});
  }
}