import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { Data, Router } from '@angular/router';
import { DashboardServiceService } from 'src/app/dashboard-service.service';
import { SC_Data } from 'src/app/Models/SteeringCommittee';
import { CLRCommentdailog } from '../automated-clr/automated-clr.component';

@Component({
  selector: 'app-steering-committee',
  templateUrl: './steering-committee.component.html',
  styleUrls: ['./steering-committee.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SteeringCommitteeComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(public service : DashboardServiceService,public dialog: MatDialog,public datepipe : DatePipe,private router : Router) {
    //set screenWidth on page load
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    window.onresize = () => {
      //set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    };
  }
  SteeringCommitteeSelectedData : SC_Data[];
  SC_Data : SC_Data[];
  sc_datasource;
  screenWidth : number;
  screenHeight : number;
  expandedElement: Data | null;
  matSortActiveColumn : string = "RecordStatus";
  displaycolumns = ["expand","RecordStatus","ClientName","ClientType","ProjectLead","ProjectStatus","ProjectTrend","TotalBusineesVolume","NewBusinessVolume","Region","Country","CurrentState","CompletedKeyDeliverables","ScheduledKeyDeliverables","AdditionalNotes","InsertedBy","InsertedDate","LastUpdatedDate","actions"]
  wavescolumns = ["Waves","Region","Country","Scope","GoLiveDate","Status","InsertedBy","InsertedDate","LastUpdatedDate"];
  RiskGapColumns = ["Risks","RisksGaps","MitigationPlan","SteeringCommitteeSupportNeed","DueDate","Owner","Status","InsertedBy","InsertedDate","LastUpdatedDate"];
  ngOnInit(): void {
    this.GetData();
  }
  GetData(){
    this.service.SteeringCommitteeData().subscribe(data => {
      for(let i = 0;i<data.Data.length;i++){
        if(data.Data[i].TotalBusineesVolume == null){
          data.Data[i].TotalBusineesVolume_text = "$0";
        }else{
          data.Data[i].TotalBusineesVolume_text = Math.round(data.Data[i].TotalBusineesVolume).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
        }
        if(data.Data[i].NewBusinessVolume == null){
          data.Data[i].NewBusinessVolume_text = "$0";
        }else{
          data.Data[i].NewBusinessVolume_text = Math.round(data.Data[i].NewBusinessVolume).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
        }
        if(data.Data[i].InsertedDate == null){
          data.Data[i].InsertedDate_text = "---";
        }else{
          data.Data[i].InsertedDate_text = this.datepipe.transform(data.Data[i].InsertedDate, "yyyy-MM-dd");
        }
        if(data.Data[i].LastUpdatedDate == null){
          data.Data[i].LastUpdatedDate_text = "---";
        }else{
          data.Data[i].LastUpdatedDate_text = this.datepipe.transform(data.Data[i].LastUpdatedDate, "yyyy-MM-dd");
        }
        for(let j = 0;j<data.Data[i].Waves.length;j++){
          if(data.Data[i].Waves[j].LastUpdatedDate == null){
            data.Data[i].Waves[j].LastUpdatedDate_text = "---";
          }else{
            data.Data[i].Waves[j].LastUpdatedDate_text = this.datepipe.transform(data.Data[i].Waves[j].LastUpdatedDate, "yyyy-MM-dd");
          }
          if(data.Data[i].Waves[j].InsertedDate == null){
            data.Data[i].Waves[j].InsertedDate_text = "---";
          }else{
            data.Data[i].Waves[j].InsertedDate_text = this.datepipe.transform(data.Data[i].Waves[j].InsertedDate, "yyyy-MM-dd");
          }
          if(data.Data[i].Waves[j].GoLiveDate == null){
            data.Data[i].Waves[j].GoLiveDate_text = "---";
          }else{
            data.Data[i].Waves[j].GoLiveDate_text = this.datepipe.transform(data.Data[i].Waves[j].GoLiveDate, "yyyy-MM-dd");
          }
          data.Data[i].Waves[j].Waves = "Wave-"+(j+1);
        }
        for(let k = 0;k<data.Data[i].RiskGaps.length;k++){
          if(data.Data[i].RiskGaps[k].LastUpdatedDate == null){
            data.Data[i].RiskGaps[k].LastUpdatedDate_text = "---";
          }else{
            data.Data[i].RiskGaps[k].LastUpdatedDate_text = this.datepipe.transform(data.Data[i].RiskGaps[k].LastUpdatedDate, "yyyy-MM-dd");
          }
          if(data.Data[i].RiskGaps[k].InsertedDate == null){
            data.Data[i].RiskGaps[k].InsertedDate_text = "---";
          }else{
            data.Data[i].RiskGaps[k].InsertedDate_text = this.datepipe.transform(data.Data[i].RiskGaps[k].InsertedDate, "yyyy-MM-dd");
          }
          if(data.Data[i].RiskGaps[k].DueDate == null){
            data.Data[i].RiskGaps[k].DueDate_text = "---";
          }else{
            data.Data[i].RiskGaps[k].DueDate_text = this.datepipe.transform(data.Data[i].RiskGaps[k].DueDate, "yyyy-MM-dd");
          }
          data.Data[i].RiskGaps[k].Risks = "Risk-"+(k+1);
        }
      }
      this.SC_Data = data.Data;
      this.sc_datasource = new MatTableDataSource(data.Data);
      this.sc_datasource.sort = this.sort;
    })
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(CLRCommentdailog, {
      data: {Dailog_Comment: this.Dailog_Comment,Dailog_Client : this.Dailog_Client,Dailog_RevenueID : this.Dailog_RevenueID}
    });
    dialogRef.afterClosed().subscribe(result => {
      //this.Comment = result;
      // this.GetData();
    });
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
  ShowForm : boolean = false;
  AddNewSteeringCommittee(){
    this.ShowForm = true;
    this.SteeringCommitteeSelectedData = [];
    var sc_data : SC_Data = {
      SCID : 1,
      Action : "Save",
      RecordStatus : "",
      ClientName : "",
      ClientType : "",
      ProjectLead : "",
      ProjectStatus : "",
      ProjectTrend : "",
      TotalBusineesVolume : 0,
      NewBusinessVolume : 0,
      Region : "",
      Country : "",
      CurrentState : "",
      CompletedKeyDeliverables : "",
      ScheduledKeyDeliverables : "",
      AdditionalNotes : "",
      Waves : [],
      RiskGaps : [],
    }
    this.SteeringCommitteeSelectedData.push(sc_data)
  }
  RecievedOutput(value :any){
    if(value[0].SelectionType == "Cancel"){
      this.ShowForm = false;
    }else if(value[0].SelectionType == "Updated" || value[0].SelectionType == "Inserted"){
      this.ShowForm = false;
      this.GetData();
    }
  }
  RowSelected(ClientName : string,SCID : number){
    this.SteeringCommitteeSelectedData = [];
    const result = this.SC_Data.filter((obj) => {
      return obj.SCID.toString().search(SCID+"") > -1 
    });
    this.SteeringCommitteeSelectedData = result;
    this.SteeringCommitteeSelectedData[0].Action = "Update";
    this.ShowForm = true;
  }
  RowSelecteddelete(ClientName : string,SCID : string){
    let d_data : SCDeleteData = {
      Client_Name : ClientName,
      SC_ID : SCID
    }
    const dialogRef = this.dialog.open(DeleteSteeringCommitteeDailog, {
      // width: '1000px',
      data : d_data
    });
    dialogRef.afterClosed().subscribe(result => {
      this.GetData();
    });
  }
}

export interface SCDeleteData {
  Client_Name : string;
  SC_ID : string;
}
@Component({
  selector: 'app-deletesteeringcommittee',
  templateUrl: './deletesteeringcommittee.component.html'
})
export class DeleteSteeringCommitteeDailog {
  constructor(
    public datepipe : DatePipe,
    public service : DashboardServiceService,
    public dialogRef: MatDialogRef<DeleteSteeringCommitteeDailog>,
    @Inject(MAT_DIALOG_DATA) public data: SCDeleteData) {
      this.SCID = data.SC_ID;
      this.ClientName = data.Client_Name;
    }
    SCID;
    UserLoggedIn : string = localStorage.getItem("Username");
    ClientName;
  ngOnInit() {
  }
  onYesClick(){
    this.service.DeleteSCData(this.SCID,localStorage.getItem("UID")).subscribe(data=>{
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