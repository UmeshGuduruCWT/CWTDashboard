import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DashboardServiceService } from 'src/app/dashboard-service.service';
import { UsageData, UsersReport } from 'src/app/Models/UsersUsageofReports';
import { LivedashboardComponent } from '../livedashboard/livedashboard.component';
export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}
@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  cols : number = 15;
  LoginUID : string;
  colors = ["#2471A3","#2E86C1","#17A589","#138D75","#229954","#28B463","#D4AC0D","#D68910","#D68910","#D68910","#839192","#839192","#2E4053","#884EA0","#CB4335","#A93226"]
  displayedColumns : string[] = ['UID','Progress','Count'];
  dataSource;
  tiles: Tile[] = [
    {text: 'One', cols: 2, rows: 1, color: 'lightblue'},
    {text: 'Two', cols: 5, rows: 1, color: 'lightgreen'},
    {text: 'Three', cols: 3, rows: 1, color: 'lightpink'},
    {text: 'Four', cols: 5, rows: 1, color: '#DDBDF1'},
  ];
  UsageData : UsageData[];
  ReportData : UsersReport[];
  TotalClicks;TotalUsers;
  constructor(private service : DashboardServiceService,public dialog: MatDialog,public datepipe : DatePipe,private dashboard : LivedashboardComponent) { }
  ngOnInit(): void {
    this.LoginUID = localStorage.getItem("UID");
    this.service.UserDetails(this.LoginUID).subscribe(data =>{
    })
    this.dashboard.ShowSpinnerHandler(true);
    this.service.UsersUsageTracking().subscribe(data => {
      if(data.code == 200){
        this.UsageData = data.Data;
        this.TotalClicks = Math.round(data.Data.map(t => t.Count).reduce((acc,value) => acc + value,0));
        this.TotalUsers = data.Data.length;
        for(let i = 0;i < data.Data.length;i++){
          if(this.UsageData[i].Count == null || this.UsageData[i].Count == 0){
            this.UsageData[i].Progress = 0;
          }else{
            this.UsageData[i].Progress = Math.round((this.UsageData[i].Count/this.TotalClicks)*100);
          }
          if(this.UsageData[i].LastUsedOn == null){
            this.UsageData[i].LastLogin = "---";
          }else{
            this.UsageData[i].LastLogin = this.datepipe.transform(this.UsageData[i].LastUsedOn,"MMM-d-y, h:mm a") + " IST";
          }
          for(let j = 0;j< data.Data[i].Reports.length;j++){
            this.UsageData[i].Reports[j].color = this.colors[j];
            if(this.UsageData[i].Reports[j].LastUsedOn == null){
              this.UsageData[i].Reports[j].LastUsed = "---";
            }else{
              this.UsageData[i].Reports[j].LastUsed = this.datepipe.transform(this.UsageData[i].Reports[j].LastUsedOn,"MMM-d-y, h:mm a") + " IST";
            }
            for(let k = 0;k < data.Data[i].Reports[j].Types.length;k++){
              this.UsageData[i].Reports[j].Types[k].color = this.colors[k];
              if(this.UsageData[i].Reports[j].Types[k].LastUsedOn == null){
                this.UsageData[i].Reports[j].Types[k].LastUsed = "---";
              }else{
                this.UsageData[i].Reports[j].Types[k].LastUsed = this.datepipe.transform(this.UsageData[i].Reports[j].Types[k].LastUsedOn,"MMM-d-y, h:mm a") + " IST";
              }
            }
          }
        }
        this.dataSource = this.UsageData;
        this.dashboard.ShowSpinnerHandler(false);
      }else{
        this.dashboard.ShowSpinnerHandler(false);
      }
    })
  }
  reportData(userindex : number,Reportindex : number,ReportName : string){
    for(let i = 0; i < this.UsageData.length;i++){
      if(i == userindex){
        this.UsageData[i].show = true;
      }else{
        this.UsageData[i].show = false;
      }
    }
    this.ReportData = [];
    this.ReportData.push(this.UsageData[userindex].Reports[Reportindex]);
  }
}