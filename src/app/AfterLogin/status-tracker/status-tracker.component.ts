import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DashboardServiceService } from 'src/app/dashboard-service.service';
import { ExcelService } from 'src/app/excel.service';
import { LivedashboardComponent } from '../livedashboard/livedashboard.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-status-tracker',
  templateUrl: './status-tracker.component.html',
  styleUrls: ['./status-tracker.component.css']
})
export class StatusTrackerComponent implements OnInit {

  constructor(public datepipe : DatePipe,public service : DashboardServiceService,private excelService:ExcelService,public dialog: MatDialog,public dashboard : DashboardComponent) {
    //set screenWidth on page load
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    window.onresize = () => {
      //set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    }
  }
  dataSource;
  displayedColumns: string[] = ['Client','RevenueID','Country','Region','NewValue','OldValue','UpdatedDate'];
  screenHeight;screenWidth;
  @ViewChild(MatSort) sort: MatSort;
  ngOnInit(): void {
    this.service.CLRActivityData().subscribe(data => {
      if(data.code == 200){
        for(let i = 0;i<data.Data.length;i++){
          if(data.Data[i].UpdatedDate == null){
            data.Data[i].UpdatedDate_text = "---";
          }else{
            data.Data[i].UpdatedDate_text = this.datepipe.transform(data.Data[i].UpdatedDate, "yyyy-MM-dd");
          }
        }
        this.dataSource = new MatTableDataSource(data.Data);
        this.dataSource.sort = this.sort;
      }
    })
  }
  FilteredCount;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.FilteredCount = this.dataSource.filteredData.length;
  }
}
