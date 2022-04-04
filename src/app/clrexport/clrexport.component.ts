import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableFilter } from 'mat-table-filter';
import * as xlsx from 'xlsx';
import { LivedashboardComponent } from '../AfterLogin/livedashboard/livedashboard.component';
import { DashboardServiceService } from '../dashboard-service.service';
import { ExcelService } from '../excel.service';
import { VolumeCountCycleTime } from '../Models/Responce';
@Component({
  selector: 'app-clrexport',
  templateUrl: './clrexport.component.html',
  styleUrls: ['./clrexport.component.css']
})
export class CLRExportComponent implements OnInit {
  dataSource_VCtPc;
  displayedColumns_VCTPC: string[] = ['GoLiveMonth', 'Revenue_Total_Volume','ProjectsCount','AvgCycleTime'];
  displayedColumns_VCTPCheader: string[] = ['GoLiveMonthh', 'Revenue_Total_Volumeh','ProjectsCounth','AvgCycleTimeh'];
  VolumeCountCycleTime : VolumeCountCycleTime[];
  ChartRevenueTotalVolume : any;
  ChartProjectCount : any;
  ChartAvgCycleTime : any;
  filterEntity: VolumeCountCycleTime;
  filterType: MatTableFilter;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(public service : DashboardServiceService,public dialog: MatDialog, public dashboard : LivedashboardComponent,private excelService:ExcelService) {}
  ngOnInit() {
    this.service.TestingSortPagination().subscribe(data => {
      console.log(data);
      this.VolumeCountCycleTime = data.VolumeCountCycleTime;
      // this.dataSource_VCtPc = data.VolumeCountCycleTime;
      this.ChartProjectCount = Math.round(data.VolumeCountCycleTime.map(t => t.ProjectsCount).reduce((acc,value) => acc + value,0));
      this.ChartRevenueTotalVolume = Math.round(data.VolumeCountCycleTime.map(t => t.Revenue_Total_Volume_USD).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.ChartAvgCycleTime = Math.round(data.VolumeCountCycleTime.map(t => t.Average).reduce((acc,value) => acc + value,0)/12);
      for(let i =0; i<data.VolumeCountCycleTime.length; i++){
        if(this.VolumeCountCycleTime[i].Average <= 0)
        {
          this.VolumeCountCycleTime[i].AvgCycleTime = '0';
        }else{
          this.VolumeCountCycleTime[i].AvgCycleTime = (Math.round(this.VolumeCountCycleTime[i].Average)).toFixed(0);
        }
        if(this.VolumeCountCycleTime[i].Revenue_Total_Volume_USD > 0){
          this.VolumeCountCycleTime[i].Revenue_Total_Volume = this.VolumeCountCycleTime[i].Revenue_Total_Volume_USD.toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
        }else{
          this.VolumeCountCycleTime[i].Revenue_Total_Volume = "$0";
        }
      }
      this.filterEntity = new VolumeCountCycleTime();
      this.filterType = MatTableFilter.ANYWHERE;
      this.dataSource_VCtPc = new MatTableDataSource(this.VolumeCountCycleTime);
        // this.dataSource_VCtPc.sort = this.sort;
      this.dashboard.ShowSpinnerHandler(false);
    });
  }
  ngAfterViewInit() {
    this.dataSource_VCtPc.paginator = this.paginator;
    this.dataSource_VCtPc.sort = this.sort;
  }
}