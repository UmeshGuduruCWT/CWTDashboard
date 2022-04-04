import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardServiceService } from 'src/app/dashboard-service.service';
import { ExcelService } from 'src/app/excel.service';
import { FilterLineWinProbability, FilterOwnerShip, FilterRegion, FilterYears } from 'src/app/Models/AutomatedCLRFilters';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LivedashboardComponent } from '../livedashboard/livedashboard.component';

@Component({
  selector: 'app-prioritization',
  templateUrl: './prioritization.component.html',
  styleUrls: ['./prioritization.component.css']
})
export class PrioritizationComponent implements OnInit {

  constructor(public datepipe : DatePipe,public dialog: MatDialog,public service : DashboardServiceService,private excelService:ExcelService,public dashboard : DashboardComponent) {
    //set screenWidth on page load
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    window.onresize = () => {
      //set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    };
  }
  screenWidth;screenHeight;
  masterLineWin;masterownerShip;masterRegion;masterYearMonth;
  
  RegionList : FilterRegion[];
  RegionListSelected : FilterRegion[];
  YearMonthList : FilterYears[];
  YearMonthListSelected : FilterYears[];
  
  OwnerShipList : FilterOwnerShip[];
  OwnerShipListSelected : FilterOwnerShip[];
  LineWinList : FilterLineWinProbability[];
  LineWinListSelected : FilterLineWinProbability[];
  SelectedRegion;SelectedYearMonth;SelectedOwnerShip;SelectedLineWin;
  displayedColumns : string[] = ['ProjectStatus','RevenueVolume'];dataSource;
  Apply_disable : boolean;
  ngOnInit(): void {
    this.ResetFilters();
  }
  TotalRevenueVolume;
  
  @ViewChild('GMSort') GMSort: MatSort;
  ResetFilters(){
    this.dashboard.ShowSpinnerHandler(true);
    this.service.PrioritizationFilters().subscribe(data =>{
      if(data.code == 200){
        this.RegionList = data.FilterRegion;
        this.masterRegion = true;
        this.getSelectedRegion();
        this.YearMonthList = data.FilterYears;
        this.masterYearMonth = true;
        this.getSelectedYearMonth();
        this.OwnerShipList = data.FilterOwnerShip;
        this.masterownerShip = true;
        this.getSelectedownership();
        this.LineWinList = data.FilterLine_Win_Probability;
        this.masterLineWin = true;
        this.getSelectedLineWin();
        this.SetGraph();
        this.dashboard.ShowSpinnerHandler(false);
      }
    });
    this.Apply_disable = true;
  }
  SetGraph(){
    console.log(this.SelectedOwnerShip);
    console.log(this.SelectedRegion);
    console.log(this.SelectedYearMonth);
    console.log(this.SelectedLineWin);
    this.dashboard.ShowSpinnerHandler(true);
    if(this.SelectedOwnerShip == null || this.SelectedRegion == null || this.SelectedYearMonth == null || this.SelectedLineWin == null){
      alert("Please select all filters");
    }else{
      this.service.PrioritizationData(this.SelectedYearMonth,this.SelectedRegion,this.SelectedLineWin,this.SelectedOwnerShip).subscribe(data =>{
        if(data.code == 200){
          for(let i = 0;i<data.GlobalManager.length;i++){
            if(data.GlobalManager[i].RevenueVolume == null){
              data.GlobalManager[i].RevenueVolumeUSD = "$0";
            }else{
              data.GlobalManager[i].RevenueVolumeUSD = Math.round(data.GlobalManager[i].RevenueVolume).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
            }
          }
          this.dataSource = new MatTableDataSource(data.GlobalManager);
          this.dataSource.sort = this.GMSort;
          this.TotalRevenueVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
        }
      });
    }
  }
  checkUncheckRegion(){
    for (var i = 0; i < this.RegionList.length; i++) {
      this.RegionList[i].isSelected = this.masterRegion;
    }
    this.getSelectedRegion();
  }
  regionSelected(){
    this.masterRegion = this.RegionList.every(function(item:any) {
      return item.isSelected == true;
    })
    this.getSelectedRegion();
  }
  getSelectedRegion(){
    this.Apply_disable = false;
    this.SelectedRegion = null;
    for(let i=0;i<this.RegionList.length;i++){
      if(this.RegionList[i].isSelected == true){
        if(this.SelectedRegion == null){
          if(this.RegionList[i].Region == null || this.RegionList[i].Region == ""){
            this.SelectedRegion = ",";
          }else{
            this.SelectedRegion = this.RegionList[i].Region;
          }
        }else{
          this.SelectedRegion += ","+this.RegionList[i].Region;
        }
      }else{
      }
    }
  }
  checkUncheckYearMonth(){
    for (var i = 0; i < this.YearMonthList.length; i++) {
      this.YearMonthList[i].isSelected = this.masterYearMonth;
    }
    this.getSelectedYearMonth();
  }
  YearMonthSelected(){
    this.masterYearMonth = this.YearMonthList.every(function(item:any) {
      return item.isSelected == true;
    })
    this.getSelectedYearMonth();
  }
  getSelectedYearMonth(){
    this.Apply_disable = false;
    this.SelectedYearMonth = null;
    for(let i=0;i<this.YearMonthList.length;i++){
      if(this.YearMonthList[i].isSelected == true){
        if(this.SelectedYearMonth == null){
          if(this.YearMonthList[i].Year == null || this.YearMonthList[i].Year == ""){
            this.SelectedYearMonth = ",";
          }else{
            this.SelectedYearMonth = this.YearMonthList[i].Year;
          }
        }else{
          this.SelectedYearMonth += ","+this.YearMonthList[i].Year;
        }
      }else{
      }
    }
  }
  checkUncheckownerShip(){
    for (var i = 0; i < this.OwnerShipList.length; i++) {
      this.OwnerShipList[i].isSelected = this.masterownerShip;
    }
    this.getSelectedownership();
  }
  ownerShipSelected(){
    this.masterownerShip = this.OwnerShipList.every(function(item:any) {
      return item.isSelected == true;
    })
    this.getSelectedownership();
  }
  getSelectedownership(){
    this.Apply_disable = false;
    this.SelectedOwnerShip = null;
    for(let i=0;i<this.OwnerShipList.length;i++){
      if(this.OwnerShipList[i].isSelected == true){
        if(this.SelectedOwnerShip == null){
          if(this.OwnerShipList[i].OwnerShip == null || this.OwnerShipList[i].OwnerShip == ""){
            this.SelectedOwnerShip = ",";
          }else{
            this.SelectedOwnerShip = this.OwnerShipList[i].OwnerShip;
          }
        }else{
          this.SelectedOwnerShip += ","+this.OwnerShipList[i].OwnerShip;
        }
      }else{
      }
    }
  }
  checkUncheckLineWin(){
    for (var i = 0; i < this.LineWinList.length; i++) {
      this.LineWinList[i].isSelected = this.masterLineWin;
    }
    this.getSelectedLineWin();
  }
  LineWinSelected(){
    this.masterLineWin = this.LineWinList.every(function(item:any) {
      return item.isSelected == true;
    })
    this.getSelectedLineWin();
  }
  getSelectedLineWin(){
    this.Apply_disable = false;
    this.SelectedLineWin = null;
    for(let i=0;i<this.LineWinList.length;i++){
      if(this.LineWinList[i].isSelected == true){
        if(this.SelectedLineWin == null){
          if(this.LineWinList[i].Line_Win_Probability == null){
            this.SelectedLineWin = ",";
          }else{
            this.SelectedLineWin = this.LineWinList[i].Line_Win_Probability;
          }
        }else{
          this.SelectedLineWin += ","+this.LineWinList[i].Line_Win_Probability;
        }
      }else{
      }
    }
  }
}
