import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LivedashboardComponent } from 'src/app/AfterLogin/livedashboard/livedashboard.component';
import { GPNContactData } from 'src/app/DDOModels/Response';
import { DdoServiceService } from 'src/app/ddo-service.service';
import { ExcelService } from 'src/app/excel.service';
import { DeleteRequestDialogComponent } from '../delete-request-dialog/delete-request-dialog.component';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-gpn-contact',
  templateUrl: './gpn-contact.component.html',
  styleUrls: ['./gpn-contact.component.css']
})
export class GpnContactComponent implements OnInit {
  
  constructor(public service : DdoServiceService,public dashboard : LivedashboardComponent,public dialog: MatDialog,public datepipe : DatePipe,public excelservice : ExcelService) {
    //set screenWidth on page load
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    window.onresize = () => {
      //set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    };
  }

  screenHeight;screenWidth;
  displayedColumns : string[] = ['Region','Type','Country','Groups','Glory_DL_DLCBR','DataSubmitFrequency','SendErrorReportFrequency','MainContactGroupEmailAddress','GroupName','InsertedBy','Inserted_On','actions'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataSource;
  ngOnInit(): void {
    this.ButtonName = "Save";
    this.dashboard.ShowSpinnerHandler(true);
    this.GetGPNContactData();
  }
  
  FilteredCount;
  @ViewChild(MatSort) sort: MatSort;
  GPNContactData : GPNContactData[];
  ShowForm : boolean = false;
  HeadingName;ButtonName;RecordNO;
  GetGPNContactData(){
    this.dashboard.ShowSpinnerHandler(true);
    this.service.GPNContactData().subscribe(data=>{
      console.log(data)
      if(data.Code == 200){
        for(let i = 0;i<data.GPNContactData.length;i++){
          if(data.GPNContactData[i].InsertedOn == null){
            data.GPNContactData[i].Inserted_On = "---";
          }else{
            data.GPNContactData[i].Inserted_On = this.datepipe.transform(data.GPNContactData[i].InsertedOn, "yyyy-MM-dd");
          }
        }
        this.GPNContactData = data.GPNContactData;
        this.dataSource = new MatTableDataSource(this.GPNContactData);console.log(data)
        this.FilteredCount = this.dataSource.filteredData.length;
        console.log(this.FilteredCount);
        this.dataSource.sort = this.sort;
      }
      this.dashboard.ShowSpinnerHandler(false);
    })
  }
  GPNId;
  Region = new FormControl('', [
      Validators.required,
    ]);
  Type = new FormControl('', [
      Validators.required,
    ]);
  Country = new FormControl('', [
      Validators.required,
    ]);
  Groups = new FormControl();
  Glory_DL_DLCBR = new FormControl('', [
      Validators.required,
    ]);
  DataSubmitFrequency = new FormControl('', [
      Validators.required,
    ]);
  SendErrorReportFrequency = new FormControl('', [
      Validators.required,
    ]);
  MainContactGroupEmailAddress = new FormControl('', [
      Validators.required,
    ]);
  GroupName = new FormControl();
  RowSelected(GPNId : number){
    for(let i= 0;i<this.GPNContactData.length;i++){
      if(GPNId == this.GPNContactData[i].GPNId){
        this.RecordNO = i;
      }else{}
    }
    this.ShowForm = true;
    this.ButtonName = "Update";
    this.GPNId = this.GPNContactData[this.RecordNO].GPNId ;
    this.Region.setValue(this.GPNContactData[this.RecordNO].Region);
    this.Type.setValue(this.GPNContactData[this.RecordNO].Type);
    this.Country.setValue(this.GPNContactData[this.RecordNO].Country);
    this.Groups.setValue(this.GPNContactData[this.RecordNO].Groups);
    this.GroupName.setValue(this.GPNContactData[this.RecordNO].GroupName);
    this.Glory_DL_DLCBR.setValue(this.GPNContactData[this.RecordNO].Glory_DL_DLCBR);
    this.DataSubmitFrequency.setValue(this.GPNContactData[this.RecordNO].DataSubmitFrequency);
    this.SendErrorReportFrequency.setValue(this.GPNContactData[this.RecordNO].SendErrorReportFrequency);
    this.MainContactGroupEmailAddress.setValue(this.GPNContactData[this.RecordNO].MainContactGroupEmailAddress);
  }
  Deleterow(GPNId : string){
    this.openDeleteDialog(GPNId);
  }
  openDeleteDialog(GPNId): void {
    const dialogRef = this.dialog.open(DeleteRequestDialogComponent, {
      data: {
        Name : localStorage.getItem("Username"),
        ID : GPNId,
        Service : "GPNContact"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.GetGPNContactData();
    });
  }
  NewRecord(){
    this.ButtonName = "Save";
    this.HeadingName = "Add Record";
    this.ShowForm = true;
    this.GPNId = "";
    this.Region.setValue("");
    this.Type.setValue("");
    this.Country.setValue("");
    this.Groups.setValue("");
    this.GroupName.setValue("");
    this.Glory_DL_DLCBR.setValue("");
    this.DataSubmitFrequency.setValue("");
    this.SendErrorReportFrequency.setValue("");
    this.MainContactGroupEmailAddress.setValue("");
  }
  OnCancelClick(){
    this.ShowForm = false;
    this.GPNId = "";
    this.Region.setValue("");
    this.Type.setValue("");
    this.Country.setValue("");
    this.GroupName.setValue("");
    this.Groups.setValue("");
    this.Glory_DL_DLCBR.setValue("");
    this.DataSubmitFrequency.setValue("");
    this.SendErrorReportFrequency.setValue("");
    this.MainContactGroupEmailAddress.setValue("");
  }
  OnSaveClick(){
    if(this.Region.value == "null" || this.Region.value == null){
      this.Region.setValue("");
    }
    if(this.Type.value == "null" || this.Type.value == null){
      this.Type.setValue("");
    }
    if(this.Country.value == "null" || this.Country.value  == null){
      this.Country.setValue("");
    }
    if(this.Groups.value == "null" || this.Groups.value  == null){
      this.Groups.setValue("");
    }
    if(this.GroupName.value == "null" || this.GroupName.value  == null){
      this.GroupName.setValue("");
    }
    if(this.Glory_DL_DLCBR.value == "null" || this.Glory_DL_DLCBR.value  == null){
      this.Glory_DL_DLCBR.setValue("");
    }
    if(this.DataSubmitFrequency.value  == "null" || this.DataSubmitFrequency.value  == null){
      this.DataSubmitFrequency.setValue("");
    }
    if(this.SendErrorReportFrequency.value  == "null" || this.SendErrorReportFrequency.value  == null){
      this.SendErrorReportFrequency.setValue("");
    }
    if(this.MainContactGroupEmailAddress.value  == "null" || this.MainContactGroupEmailAddress.value  == null){
      this.MainContactGroupEmailAddress.setValue("");
    }
    if(this.Region.value == "" ||  this.Type.value == "" || this.Country.value == "" || this.DataSubmitFrequency.value == "" || this.Glory_DL_DLCBR.value == "" || this.SendErrorReportFrequency.value == "" || this.MainContactGroupEmailAddress == null){
      alert("Please Fill all fields");
      this.Region.markAsTouched();
      this.Type.markAsTouched();
      this.Country.markAsTouched();
      this.Glory_DL_DLCBR.markAsTouched();
      this.DataSubmitFrequency.markAsTouched();
      this.SendErrorReportFrequency.markAsTouched();
      this.MainContactGroupEmailAddress.markAsTouched();
    }else{
      if(this.ButtonName == "Save"){
        this.service.GPNContactInsert(this.Region.value,this.Type.value,this.Country.value,this.Groups.value,this.Glory_DL_DLCBR.value,this.DataSubmitFrequency.value,this.SendErrorReportFrequency.value,
          this.MainContactGroupEmailAddress.value,this.GroupName.value,localStorage.getItem("UID")).subscribe(data=>{
            if(data.Code == 200){
              alert(data.Message);
              this.GetGPNContactData();
              this.OnCancelClick();
            }else{
              alert("Something Went Wrong Please Try Again later");
            }
        })
      }else{
        this.service.GPNContactUpdate(this.GPNId,this.Region.value,this.Type.value,this.Country.value,this.Groups.value,this.Glory_DL_DLCBR.value,this.DataSubmitFrequency.value,this.SendErrorReportFrequency.value,
          this.MainContactGroupEmailAddress.value,this.GroupName.value,localStorage.getItem("UID")).subscribe(data=>{
            if(data.Code == 200){
              alert(data.Message);
              this.GetGPNContactData();
              this.OnCancelClick();
            }else{
              alert("Something Went Wrong Please Try Again later");
            }
        })
      }
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.FilteredCount = this.dataSource.filteredData.length;
  }
  Export(){
    const CustomizedData = this.GPNContactData.map(o => {
      return {
        "Region" : o.Region,
        "Type" : o.Type,
        "Country" : o.Country,
        "Groups" : o.Groups,
        "Glory DL DLCBR" : o.Glory_DL_DLCBR,
        "Data Submit Frequency" : o.DataSubmitFrequency,
        "Send Error Report Frequency" : o.SendErrorReportFrequency,
        "Main Contact Group Email Id" : o.MainContactGroupEmailAddress,
        "GroupName" : o.GroupName,
        "Created By" : o.InsertedBy,
        "Created On" : o.Inserted_On,
        "Updated By" : o.UpdatedBy,
        "Updated On" : o.Updated_On,
      };
    });
    this.excelservice.exportAsExcelFile(CustomizedData, 'GPN Contact');
  }
}
