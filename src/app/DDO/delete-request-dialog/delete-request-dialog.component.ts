import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DdoServiceService } from 'src/app/ddo-service.service';
export interface DeleteRequestDialogData {
  Name : string;
  ID : string;
  Service : string;
}
@Component({
  selector: 'app-delete-request-dialog',
  templateUrl: './delete-request-dialog.component.html'
})
export class DeleteRequestDialogComponent implements OnInit {

  constructor(
    public datepipe : DatePipe,
    public service : DdoServiceService,
    public dialogRef: MatDialogRef<DeleteRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteRequestDialogData) {
    }
  ngOnInit(): void {
  }
  onNoClick(){
    this.dialogRef.close();
  }
  onYesClick(){
    if(this.data.Service == "ErrorsAllocated"){
      this.service.DeleteErrorAllocated(this.data.ID,this.data.Name).subscribe(data=>{
        if(data.code == 200){
          alert(data.message);
          this.dialogRef.close();
        }else{
          alert(data.message);
          this.dialogRef.close();
        }
      })
    }else if(this.data.Service == "GPNContact"){
      this.service.DeleteGPNContact(this.data.ID,this.data.Name).subscribe(data=>{
        if(data.code == 200){
          alert(data.message);
          this.dialogRef.close();
        }else{
          alert(data.message);
          this.dialogRef.close();
        }
      })
    }
  }
}
