import { Component, OnInit, Inject } from '@angular/core';
import { CHData } from 'src/app/Models/CapacityHierarchy';
import { DashboardServiceService } from 'src/app/dashboard-service.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ExcelService } from 'src/app/excel.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { LivedashboardComponent } from '../livedashboard/livedashboard.component';
export interface DialogData {
  Dailog_Client : string;
  Dailog_Status : string;
  Dailog_Comment : string;
}
export interface ParsingData {
  Status : string;
  HID : number;
  Region : string;
  Level : string;
  PLevel : string;
  Leader : string;
  Manager : string;
  WorkShedule : string;
  ProjectLevel : string;
  Monday : number;
  Tuesday : number;
  Wednesday : number;
  Thursday : number;
  Friday : number;
  WorkingDays : number;
  TargetedUtilization : number;
}
@Component({
  selector: 'app-capacity-hierarchy',
  templateUrl: './capacity-hierarchy.component.html',
  styleUrls: ['./capacity-hierarchy.component.css'],
})
export class CapacityHierarchyComponent implements OnInit {
  dataSource;
  HierarchyData : CHData[];
  displayedColumns: string[] = ['Region','ProjectLevel','Leader','Manager','Level','WorkShedule','Monday','Tuesday','Wednesday','Thursday','Friday','WorkingDays','TargetedUtilization','actions'];
  constructor(public service : DashboardServiceService,public dialog: MatDialog,public dashboard : LivedashboardComponent,public excelservice : ExcelService) {
    // set screenWidth on page load
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    window.onresize = () => {
      // set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    };
  }
  
  columnsToDisplay: string[] = this.displayedColumns.slice();
  // columnsToDisplay_h: string[] = this.displayedColumns_h.slice();
  screenWidth : number;
  screenHeight  : number;
  AddNewDisplay : boolean = false;
  ngOnInit(): void {
    this.dashboard.ShowSpinnerHandler(true);
    this.service.UserReportAccess(localStorage.getItem("UID")).subscribe(data=>{
      if(data.code == 200){
        if(data.Data[0].C_HierarchyEdits == true){
          this.AddNewDisplay = true;
        }else{
          this.AddNewDisplay = false;
          this.columnsToDisplay.pop();
        }
      }
      this.dashboard.ShowSpinnerHandler(false);
    })
    this.GetHierarchy();
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  DisplayConfigData : boolean = false;
  ConfigData(){
    if(this.DisplayConfigData == true){
      this.DisplayConfigData = false;
    }else{
      this.DisplayConfigData = true;
    }
  }
  openDeleteDialog(HId,Username): void {
    const dialogRef = this.dialog.open(DeleteUserDailog, {
      data: {
        Name : localStorage.getItem("Username"),
        SelectedUser : Username,
        SelectedHID : HId,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.GetHierarchy();
    });
  }
  DeleteUser(SelectedHID : string,Username : string){
    this.openDeleteDialog(SelectedHID,Username);
  }
  GetHierarchy(){
    this.dashboard.ShowSpinnerHandler(true);
    this.service.GetCapacityHierarchy().subscribe(data =>{
      if(data.code == 200){
        this.HierarchyData = data.Data;
        this.dataSource = new MatTableDataSource(this.HierarchyData);
      }else{
        this.dataSource = null;
      }
      this.dashboard.ShowSpinnerHandler(false);
    });
  }
  RowSelected(j,HID : number,Region : string,Level : string,PLevel : string,Leader : string,Manager : string,WorkShedule : string,ProjectLevel : string,Monday : number,Tuesday : number,Wednesday : number,Thursday : number,Friday : number,WorkingDays : number,TargetedUtilization : number)
  {
    let p_data : ParsingData = {
      Status : "Update",
      HID : HID,
      Region : Region,
      Level : Level,
      PLevel : PLevel,
      Leader : Leader,
      Manager : Manager,
      WorkShedule : WorkShedule,
      ProjectLevel : ProjectLevel,
      Monday : Monday,
      Tuesday : Tuesday,
      Wednesday : Wednesday,
      Thursday : Thursday,
      Friday : Friday,
      WorkingDays : WorkingDays,
      TargetedUtilization : TargetedUtilization,
    }
    const dialogRef = this.dialog.open(CapacityHierarchyDailog, {
      width: '1000px',
      data : p_data
    });
    dialogRef.afterClosed().subscribe(result => {
      this.GetHierarchy();
    });
  }
  openDialog(): void {
    let p_data : ParsingData = {
      Status : "Save",
      HID : 0,
      Region : "",
      Level : "",
      PLevel : "",
      Leader : "",
      Manager : "",
      WorkShedule : "",
      ProjectLevel : "",
      Monday : 0,
      Tuesday : 0,
      Wednesday : 0,
      Thursday : 0,
      Friday : 0,
      WorkingDays : 0,
      TargetedUtilization : 0
    }
    const dialogRef = this.dialog.open(CapacityHierarchyDailog, {
      width: '1000px',
      data : p_data
      //data: {Dailog_Comment: "a",Dailog_Client : "b",Dailog_Status : "c"}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.GetHierarchy();
    });
  }
  AddManager(){
    this.openDialog();
  }
  exportHierarchy(){
    this.GetHierarchy();
    this.excelservice.exportAsExcelFile(this.dataSource.data, 'Capacity Hierarchy');
  }
}
@Component({
  selector: 'app-capacity-hierarchydailog',
  templateUrl: './capacity-hierarchydailog.component.html',
  styleUrls: ['./capacity-hierarchydailog.component.css']
})
export class CapacityHierarchyDailog {
  HID : number;
  HeaderText : string;
  ButtonText : string;
  SelectedRegion;
  Monday = new FormControl();
  Tuesday = new FormControl();
  Wednesday = new FormControl();
  Thursday = new FormControl();
  Friday = new FormControl();
  CPLevel;iMeetPLevel;
  CountryDisabled : boolean = true;
  ImplementationLevel;
  date = new Date();
  workingdays;Shedule;Manager;Leader;TargetedUtilization : number;
  constructor(
    public datepipe : DatePipe,
    public service : DashboardServiceService,
    public dialogRef: MatDialogRef<CapacityHierarchyDailog>,
    @Inject(MAT_DIALOG_DATA) public data: ParsingData) {
      if(this.data.Status == "Save"){
        this.HeaderText = "Add Manager";
        this.ButtonText = "Save";
        this.Monday.setValue(0);
        this.Tuesday.setValue(0);
        this.Wednesday.setValue(0);
        this.Thursday.setValue(0);
        this.Friday.setValue(0);
        this.workingdays = 0;
      }else{
        this.HeaderText = "Update Manager";
        this.ButtonText = "Update";
        this.HID = data.HID;
        this.SelectedRegion = data.Region;
        this.iMeetPLevel = data.PLevel;
        this.CPLevel = data.ProjectLevel;
        this.Leader = data.Leader;
        this.Manager = data.Manager;
        this.Shedule = data.WorkShedule;
        this.ImplementationLevel = data.Level;
        this.Monday.setValue(data.Monday);
        this.Tuesday.setValue(data.Tuesday);
        this.Wednesday.setValue(data.Wednesday);
        this.Thursday.setValue(data.Thursday);
        this.Friday.setValue(data.Friday);
        this.workingdays = data.WorkingDays;
        this.TargetedUtilization = data.TargetedUtilization;
        if(this.iMeetPLevel == "Global"){
          this.CountryDisabled = true;
        }else if(this.iMeetPLevel == "Regional"){
          this.CountryDisabled = true;
        }else{
          this.CountryDisabled = false;
        }
      }
    }
  SaveData(){
    // alert(this.SelectedRegion+","+this.CPLevel+","+this.iMeetPLevel+","+this.Monday+","+this.Tuesday+","+this.Wednesday+","+this.Thursday+","+this.Friday);
    if(this.Monday.value == null || this.Tuesday.value  == null ||this.Wednesday.value  == null || this.Thursday.value  == null || this.Friday.value  == null || this.SelectedRegion == null || this.Leader == null || this.iMeetPLevel == null || this.CPLevel == null || this.workingdays == null || this.Shedule == null || this.Manager == null || this.ImplementationLevel == null || this.TargetedUtilization == null){
      alert("Please Fill all Fields");
    }else{
      if(this.Monday.value > 1 || this.Monday.value < 0){
        alert("Monday cannot be Greater thatn 1");
      }else{
        if(this.Tuesday.value > 1 || this.Tuesday.value < 0){
          alert("Tuesday cannot be Greater thatn 1");
        }
        else{
          if(this.Wednesday.value > 1 || this.Wednesday.value < 0){
            alert("Wednesday cannot be Greater thatn 1");
          }
          else{
            if(this.Thursday.value > 1 || this.Thursday.value < 0){
              alert("Thursday cannot be Greater thatn 1");
            }
            else{
              if(this.Friday.value > 1 || this.Friday.value < 0){
                alert("Friday cannot be Greater thatn 1");
              }
              else{
                var Todaydate = this.date.getDate();
                if(this.ButtonText == "Save"){
                  this.service.AddingCapacityHierarchy(this.SelectedRegion,this.ImplementationLevel,this.Leader,this.Manager,this.CPLevel,this.iMeetPLevel,this.Shedule,this.workingdays,this.Monday.value,this.Tuesday.value ,this.Wednesday.value ,this.Thursday.value ,this.Friday.value,localStorage.getItem("UID"),this.TargetedUtilization).subscribe(data =>{
                    if(data.code == 200){
                      alert("Added Succesfully");
                      this.dialogRef.close();
                    }else{
                      alert("Something went wrong please try again later.");
                      this.dialogRef.close();
                    }
                  })
                }
                else{
                  this.service.UpdateCapacityHierarchy(this.HID,this.SelectedRegion,this.ImplementationLevel,this.Leader,this.Manager,this.CPLevel,this.iMeetPLevel,this.Shedule,this.workingdays,this.Monday.value,this.Tuesday.value ,this.Wednesday.value ,this.Thursday.value ,this.Friday.value,localStorage.getItem("UID"),this.TargetedUtilization).subscribe(data =>{
                    if(data.code == 200){
                      alert("Updated Succesfully");
                      this.dialogRef.close();
                    }else{
                      alert("Something went wrong please try again later");
                      this.dialogRef.close();
                    }
                  })
                }
              }
            }
          }
        }
      }
    }
  }
  ngOnInit(): void {
    this.Monday.valueChanges.subscribe(value => {
      if(value == null){
        this.workingdays = 0 + this.Tuesday.value + this.Wednesday.value + this.Thursday.value + this.Friday.value;
      }
      else{
        this.workingdays = value + this.Tuesday.value + this.Wednesday.value + this.Thursday.value + this.Friday.value;
      }
    });
    this.Tuesday.valueChanges.subscribe(value => {
      if(value == null){
        this.workingdays = 0 + this.Monday.value + this.Wednesday.value + this.Thursday.value + this.Friday.value;
      }
      else{
        this.workingdays = value + this.Monday.value + this.Wednesday.value + this.Thursday.value + this.Friday.value;
      }
    });
    this.Wednesday.valueChanges.subscribe(value => {
      if(value == null){
        this.workingdays = 0 + this.Tuesday.value + this.Monday.value + this.Thursday.value + this.Friday.value;
      }
      else{
        this.workingdays = value + this.Tuesday.value + this.Monday.value + this.Thursday.value + this.Friday.value;
      }
    });
    this.Thursday.valueChanges.subscribe(value => {
      if(value == null){
        this.workingdays = 0 + this.Tuesday.value + this.Wednesday.value + this.Monday.value + this.Friday.value;
      }
      else{
        this.workingdays = value + this.Tuesday.value + this.Wednesday.value + this.Monday.value + this.Friday.value;
      }
    });
    this.Friday.valueChanges.subscribe(value => {
      if(value == null){
        this.workingdays = 0 + this.Tuesday.value + this.Wednesday.value + this.Thursday.value + this.Monday.value;
      }
      else{
        this.workingdays = value + this.Tuesday.value + this.Wednesday.value + this.Thursday.value + this.Monday.value;
      }
    });
  }
  LevelChanged(){
    if(this.iMeetPLevel == "Global"){
      this.CPLevel = this.iMeetPLevel;
      this.CountryDisabled = true;
    }else if(this.iMeetPLevel == "Regional"){
      this.CPLevel = this.iMeetPLevel;
      this.CountryDisabled = true;
    }else{
      this.CPLevel = "";
      this.CountryDisabled = false;
    }
  }
}
export interface CHDeleteUserDailog {
  Name : string;
  SelectedUser : string;
  SelectedHID : string;
}
@Component({
  selector: 'app-deleteuserdailog',
  templateUrl: './deleteuserdailog.component.html'
})
export class DeleteUserDailog {
  constructor(
    public datepipe : DatePipe,
    public service : DashboardServiceService,
    public dialogRef: MatDialogRef<DeleteUserDailog>,
    @Inject(MAT_DIALOG_DATA) public data: CHDeleteUserDailog) {
    }
  ngOnInit() {
  }
  onYesClick(){
    this.service.DeleteUserFromCapacityHierarchy(this.data.SelectedHID,localStorage.getItem("UID")).subscribe(data=>{
      if(data.code == 200){
        alert(data.message);
        this.dialogRef.close();
      }else{
        alert(data.message);
        this.dialogRef.close();
      }
    })
  }
  onNoClick(){
    this.dialogRef.close();
  }
}