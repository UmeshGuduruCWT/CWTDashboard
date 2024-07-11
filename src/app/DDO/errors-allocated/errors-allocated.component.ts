import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LivedashboardComponent } from 'src/app/AfterLogin/livedashboard/livedashboard.component';
import { ErrorsAllocatedData } from 'src/app/DDOModels/Response';
import { DdoServiceService } from 'src/app/ddo-service.service';
import { ExcelService } from 'src/app/excel.service';
import { DeleteRequestDialogComponent } from '../delete-request-dialog/delete-request-dialog.component';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-errors-allocated',
  templateUrl: './errors-allocated.component.html',
  styleUrls: ['./errors-allocated.component.css']
})
export class ErrorsAllocatedComponent implements OnInit {

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
  displayedColumns : string[] = ['Con','NewOwner','AverageCount','Type','Comments','InsertedBy','Inserted_On','actions'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataSource;
  ngOnInit(): void {
    this.ButtonName = "Save";
    this.dashboard.ShowSpinnerHandler(true);
    this.GetErrorsAllocatedData();
  }
  
  FilteredCount;
  @ViewChild(MatSort) sort: MatSort;
  ErrorsAllocatedData : ErrorsAllocatedData[];
  GetErrorsAllocatedData(){
    this.dashboard.ShowSpinnerHandler(true);
    this.service.ErrorsAllocatedData().subscribe(data=>{
      if(data.code == 200){
        console.log(data)
        for(let i = 0;i<data.ErrorsAllocatedData.length;i++){
          if(data.ErrorsAllocatedData[i].InsertedOn == null){
            data.ErrorsAllocatedData[i].Inserted_On = "---";
          }else{
            data.ErrorsAllocatedData[i].Inserted_On = this.datepipe.transform(data.ErrorsAllocatedData[i].InsertedOn, "yyyy-MM-dd");
          }
        }
        this.ErrorsAllocatedData = data.ErrorsAllocatedData;
        this.dataSource = new MatTableDataSource(data.ErrorsAllocatedData);
        this.FilteredCount = this.dataSource.filteredData.length;
        this.dataSource.sort = this.sort;
      }
      this.dashboard.ShowSpinnerHandler(false);
    })
  }
  
  ShowForm : boolean = false;
  HeadingName;ButtonName;RecordNO;
  RowSelected(ErrorAllocatedID : number){
    for(let i= 0;i<this.ErrorsAllocatedData.length;i++){
      if(ErrorAllocatedID == this.ErrorsAllocatedData[i].ErrorAllocatedID){
        this.RecordNO = i;
      }else{}
    }
    this.ShowForm = true;
    this.ButtonName = "Update";
    this.ErrorAllocatedID = this.ErrorsAllocatedData[this.RecordNO].ErrorAllocatedID;
    this.Con.setValue(this.ErrorsAllocatedData[this.RecordNO].Con);
    this.Owner.setValue(this.ErrorsAllocatedData[this.RecordNO].Owner);
    this.NewOwner.setValue(this.ErrorsAllocatedData[this.RecordNO].NewOwner);
    this.AverageCount.setValue(this.ErrorsAllocatedData[this.RecordNO].AverageCount);
    this.Type.setValue(this.ErrorsAllocatedData[this.RecordNO].Type);
    this.Comments.setValue(this.ErrorsAllocatedData[this.RecordNO].Comments);
    console.log(ErrorAllocatedID);
  }
  ErrorAllocatedID;
  Con = new FormControl('', [
    Validators.required,
  ]);
  Owner = new FormControl('', [
    Validators.required,
  ]);
  NewOwner = new FormControl('', [
    Validators.required,
  ]);
  AverageCount = new FormControl();
  Type = new FormControl();
  Comments = new FormControl();
  Deleterow(ErrorAllocatedID : string){
    this.openDeleteDialog(ErrorAllocatedID);
  }
  openDeleteDialog(ErrorAllocatedID): void {
    const dialogRef = this.dialog.open(DeleteRequestDialogComponent, {
      data: {
        Name : localStorage.getItem("Username"),
        ID : ErrorAllocatedID,
        Service : "ErrorsAllocated"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.GetErrorsAllocatedData();
    });
  }
  NewRecord(){
    this.ButtonName = "Save";
    this.HeadingName = "Add Record";
    this.ShowForm = true;
    this.ErrorAllocatedID = "";
    this.Con.setValue("");
    this.Owner.setValue("");
    this.NewOwner.setValue("");
    this.AverageCount.setValue("");
    this.Type.setValue("");
    this.Comments.setValue("");
  }
  OnCancelClick(){
    this.ShowForm = false;
    this.ErrorAllocatedID = "";
    this.Con.setValue("");
    this.Owner.setValue("");
    this.NewOwner.setValue("");
    this.AverageCount.setValue("");
    this.Type.setValue("");
    this.Comments.setValue("");
  }
  OnSaveClick(){
    if(this.Con.value == "null" || this.Con.value == null){
      this.Con.setValue("");
    }
    if(this.Owner.value == "null" || this.Owner.value  == null){
      this.Owner.setValue("");
    }
    if(this.NewOwner.value == "null" || this.NewOwner.value  == null){
      this.NewOwner.setValue("");
    }
    if(this.AverageCount.value == "null" || this.AverageCount.value  == null){
      this.AverageCount.setValue("");
    }
    if(this.Type.value == "null" || this.Type.value == null){
      this.Type.setValue("");
    }
    if(this.Comments.value  == "null" || this.Comments.value  == null){
      this.Comments.setValue("");
    }
    if(this.Con.value == "" ||  this.Owner.value == "" || this.NewOwner.value == ""){
      alert("Please Fill all fields");
      this.Con.markAsTouched();
      this.Owner.markAsTouched();
      this.NewOwner.markAsTouched();
    }else{
      if(this.ButtonName == "Save"){
        this.service.ErrorAllocatedInsert(this.Con.value,this.Owner.value,this.NewOwner.value,this.AverageCount.value,this.Type.value,this.Comments.value,localStorage.getItem("UID")).subscribe(data=>{
            if(data.code == 200){
              alert(data.message);
              this.GetErrorsAllocatedData();
              this.OnCancelClick();
            }else{
              alert("Something Went Wrong Please Try Again later");
            }
        })
      }else{
        this.service.ErrorAllocatedUpdate(this.ErrorAllocatedID,this.Con.value,this.Owner.value,this.NewOwner.value,this.AverageCount.value,this.Type.value,this.Comments.value,localStorage.getItem("UID")).subscribe(data=>{
            if(data.code == 200){
              alert(data.message);
              this.GetErrorsAllocatedData();
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
    const CustomizedData = this.ErrorsAllocatedData.map(o => {
      return {
        "Con" : o.Con,
        "Owner" : o.Owner,
        "New Owner" : o.NewOwner,
        "Average Count" : o.AverageCount,
        "Type" : o.Type,
        "Created By" : o.InsertedBy,
        "Created On" : o.Inserted_On,
        "Updated By" : o.UpdatedBy,
        "Updated On" : o.Updated_On,
      };
    });
    this.excelservice.exportAsExcelFile(CustomizedData, 'Errors Allocated');
  }
}
