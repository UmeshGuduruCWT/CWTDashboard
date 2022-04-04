import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardServiceService } from 'src/app/dashboard-service.service';
import { ExcelService } from 'src/app/excel.service';
import { Chart } from 'chart.js';
import 'chartjs-plugin-labels';
import { FilterGlobalProjectManager, FilterLocalProjectManager, FilterProjectLevel, FilterQuarter, FilterRegion, FilterRegionalProjectManager, FilterYears } from 'src/app/Models/AutomatedCLRFilters';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { LivedashboardComponent } from '../../livedashboard/livedashboard.component';
import { FormControl } from '@angular/forms';
import { GlobalData } from 'src/app/Models/PerformanceResponce';
export interface lineGraphValues{
  x : number;
  y : string;
}
export class DialogData {
  Manager : string;
  Quarter : any;
  GOliveYear : string;
}
export class MyFilter {
  Leader : string;
  Manager : string;
  Region : string;
  Role : string;
  ProjectEffort_c : string;
  ClientCount : string;
  RevenueVolume : string;
}
@Component({
  selector: 'app-project-team-analysis',
  templateUrl: './project-team-analysis.component.html',
  styleUrls: ['./project-team-analysis.component.css'],
})
export class ProjectTeamAnalysisComponent implements OnInit {
  constructor(public datepipe : DatePipe,public dialog: MatDialog,public service : DashboardServiceService,private excelService:ExcelService,public dashboard : LivedashboardComponent) {
    //set screenWidth on page load
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    window.onresize = () => {
      //set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    };
  }
  dataSource_GM;
  // dataSource_RM;dataSource_LM;
  displayedColumns_GM: string[] = ['Leader','Manager','Region','Role','ProjectEffort_c','ClientCount','RevenueVolume'];
  displayedColumns_h : string[] = ['Leader_h','Manager_h','Region_h','Role_h','ProjectEffort_c_h','ClientCount_h','RevenueVolume_h'];
  // displayedColumns_RM: string[] = ['Leader_RM','Manager_RM','ClientCount_RM','RevenueVolume_RM'];
  // displayedColumns_LM: string[] = ['Leader_LM','Manager_LM','ClientCount_LM','RevenueVolume_LM'];
  screenWidth : number;
  screenHeight : number;
  RegionList : FilterRegion[];
  RegionListSelected : FilterRegion[];
  QuarterList : FilterQuarter[];
  QuarterListSelected : FilterQuarter[];
  LeaderList : FilterGlobalProjectManager[];
  LeaderListSelected : FilterGlobalProjectManager[];
  YearsList  : any = [];
  LevelList : FilterProjectLevel[];
  LevelListSelected : FilterProjectLevel[];
  Apply_disable : boolean;
  FilteredCount;
  SelectedRegion : any;SelectedQuarter : any;SelectedLeader : any;SelectedLevel : any;
  masterRegion;masterleader;masterquarter;masterLevel;
  Year= new FormControl();
  AverageRevenue;AverageCount;AverageEffort;
  TotalRevenue;TotalCount;TotalEffort;

  
  LeaderFilter = new FormControl();
  ManagerFilter = new FormControl();
  RegionFilter = new FormControl();
  RoleFilter = new FormControl();
  ProjectEffortFilter = new FormControl();
  ClientCountFilter = new FormControl();
  RevenueVolumeFilter = new FormControl();
  ngOnInit(): void {
    this.ResetFilters();
  }
  filteredValues : MyFilter = {
    Leader : '',
    Manager : '',
    Region : '',
    Role : '',
    ProjectEffort_c : '',
    ClientCount : '',
    RevenueVolume : '',};
  customFilterPredicate() {
    return (data: GlobalData, filter: string): boolean => {
      let searchString = JSON.parse(filter) as MyFilter;
      return (
        data.Leader.toString().trim().toLowerCase().indexOf(searchString.Leader.toLowerCase()) !== -1 &&
        data.Manager.toString().trim().toLowerCase().indexOf(searchString.Manager.toLowerCase()) !== -1 &&
        data.Region.toString().trim().toLowerCase().indexOf(searchString.Region.toLowerCase())!== -1 &&
        data.Role.toString().trim().toLowerCase().indexOf(searchString.Role.toLowerCase()) !== -1 &&
        data.ProjectEffort_c.toString().trim().toLowerCase().indexOf(searchString.ProjectEffort_c.toLowerCase()) !== -1 &&
        data.ClientCount.toString().trim().toLowerCase().indexOf(searchString.ClientCount.toLowerCase()) !== -1 &&
        data.RevenueVolume.toString().trim().toLowerCase().indexOf(searchString.RevenueVolume.toLowerCase()) !== -1
      )
    }
  }
  onFilterValueChange(){
    this.LeaderFilter.valueChanges.subscribe(value => {
      this.filteredValues["Leader"] = value;
      this.dataSource_GM.filter = JSON.stringify(this.filteredValues);
      this.FilteredCount = this.dataSource_GM.filteredData.length;
      this.TotalCount = this.dataSource_GM.filteredData.map(t => t.ClientCount).reduce((acc,value) => acc + value,0);
      this.TotalEffort = (Math.round(this.dataSource_GM.filteredData.map(t => t.ProjectEffort).reduce((acc,value) => acc + value,0) * 100) / 100).toFixed(2);
      this.TotalRevenue = this.dataSource_GM.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.AverageCount = (Math.round(this.dataSource_GM.filteredData.map(t => t.ClientCount).reduce((acc,value) => acc + value,0)/this.dataSource_GM.filteredData.length * 100) / 100).toFixed(2);
      this.AverageEffort = (Math.round(this.dataSource_GM.filteredData.map(t => t.ProjectEffort).reduce((acc,value) => acc + value,0)/this.dataSource_GM.filteredData.length * 100) / 100).toFixed(2);
      this.AverageRevenue = (this.dataSource_GM.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0)/this.dataSource_GM.filteredData.length).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
    });
    this.ManagerFilter.valueChanges.subscribe(value => {
      this.filteredValues["Manager"] = value;
      this.dataSource_GM.filter = JSON.stringify(this.filteredValues);
      this.FilteredCount = this.dataSource_GM.filteredData.length;
      this.TotalCount = this.dataSource_GM.filteredData.map(t => t.ClientCount).reduce((acc,value) => acc + value,0);
      this.TotalEffort = (Math.round(this.dataSource_GM.filteredData.map(t => t.ProjectEffort).reduce((acc,value) => acc + value,0) * 100) / 100).toFixed(2);
      this.TotalRevenue = this.dataSource_GM.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.AverageCount = (Math.round(this.dataSource_GM.filteredData.map(t => t.ClientCount).reduce((acc,value) => acc + value,0)/this.dataSource_GM.filteredData.length * 100) / 100).toFixed(2);
      this.AverageEffort = (Math.round(this.dataSource_GM.filteredData.map(t => t.ProjectEffort).reduce((acc,value) => acc + value,0)/this.dataSource_GM.filteredData.length * 100) / 100).toFixed(2);
      this.AverageRevenue = (this.dataSource_GM.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0)/this.dataSource_GM.filteredData.length).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
    });
    this.RegionFilter.valueChanges.subscribe(value => {
      this.filteredValues["Region"] = value;
      this.dataSource_GM.filter = JSON.stringify(this.filteredValues);
      this.FilteredCount = this.dataSource_GM.filteredData.length;
      this.TotalCount = this.dataSource_GM.filteredData.map(t => t.ClientCount).reduce((acc,value) => acc + value,0);
      this.TotalEffort = (Math.round(this.dataSource_GM.filteredData.map(t => t.ProjectEffort).reduce((acc,value) => acc + value,0) * 100) / 100).toFixed(2);
      this.TotalRevenue = this.dataSource_GM.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.AverageCount = (Math.round(this.dataSource_GM.filteredData.map(t => t.ClientCount).reduce((acc,value) => acc + value,0)/this.dataSource_GM.filteredData.length * 100) / 100).toFixed(2);
      this.AverageEffort = (Math.round(this.dataSource_GM.filteredData.map(t => t.ProjectEffort).reduce((acc,value) => acc + value,0)/this.dataSource_GM.filteredData.length * 100) / 100).toFixed(2);
      this.AverageRevenue = (this.dataSource_GM.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0)/this.dataSource_GM.filteredData.length).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
    });
    this.RoleFilter.valueChanges.subscribe(value => {
      this.filteredValues["Role"] = value;
      this.dataSource_GM.filter = JSON.stringify(this.filteredValues);
      this.FilteredCount = this.dataSource_GM.filteredData.length;
      this.TotalCount = this.dataSource_GM.filteredData.map(t => t.ClientCount).reduce((acc,value) => acc + value,0);
      this.TotalEffort = (Math.round(this.dataSource_GM.filteredData.map(t => t.ProjectEffort).reduce((acc,value) => acc + value,0) * 100) / 100).toFixed(2);
      this.TotalRevenue = this.dataSource_GM.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.AverageCount = (Math.round(this.dataSource_GM.filteredData.map(t => t.ClientCount).reduce((acc,value) => acc + value,0)/this.dataSource_GM.filteredData.length * 100) / 100).toFixed(2);
      this.AverageEffort = (Math.round(this.dataSource_GM.filteredData.map(t => t.ProjectEffort).reduce((acc,value) => acc + value,0)/this.dataSource_GM.filteredData.length * 100) / 100).toFixed(2);
      this.AverageRevenue = (this.dataSource_GM.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0)/this.dataSource_GM.filteredData.length).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
    });
    this.ProjectEffortFilter.valueChanges.subscribe(value => {
      this.filteredValues["ProjectEffort_c"] = value;
      this.dataSource_GM.filter = JSON.stringify(this.filteredValues);
      this.FilteredCount = this.dataSource_GM.filteredData.length;
      this.TotalCount = this.dataSource_GM.filteredData.map(t => t.ClientCount).reduce((acc,value) => acc + value,0);
      this.TotalEffort = (Math.round(this.dataSource_GM.filteredData.map(t => t.ProjectEffort).reduce((acc,value) => acc + value,0) * 100) / 100).toFixed(2);
      this.TotalRevenue = this.dataSource_GM.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.AverageCount = (Math.round(this.dataSource_GM.filteredData.map(t => t.ClientCount).reduce((acc,value) => acc + value,0)/this.dataSource_GM.filteredData.length * 100) / 100).toFixed(2);
      this.AverageEffort = (Math.round(this.dataSource_GM.filteredData.map(t => t.ProjectEffort).reduce((acc,value) => acc + value,0)/this.dataSource_GM.filteredData.length * 100) / 100).toFixed(2);
      this.AverageRevenue = (this.dataSource_GM.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0)/this.dataSource_GM.filteredData.length).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
    });
    this.ClientCountFilter.valueChanges.subscribe(value => {
      this.filteredValues["ClientCount"] = value;
      this.dataSource_GM.filter = JSON.stringify(this.filteredValues);
      this.FilteredCount = this.dataSource_GM.filteredData.length;
      this.TotalCount = this.dataSource_GM.filteredData.map(t => t.ClientCount).reduce((acc,value) => acc + value,0);
      this.TotalEffort = (Math.round(this.dataSource_GM.filteredData.map(t => t.ProjectEffort).reduce((acc,value) => acc + value,0) * 100) / 100).toFixed(2);
      this.TotalRevenue = this.dataSource_GM.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.AverageCount = (Math.round(this.dataSource_GM.filteredData.map(t => t.ClientCount).reduce((acc,value) => acc + value,0)/this.dataSource_GM.filteredData.length * 100) / 100).toFixed(2);
      this.AverageEffort = (Math.round(this.dataSource_GM.filteredData.map(t => t.ProjectEffort).reduce((acc,value) => acc + value,0)/this.dataSource_GM.filteredData.length * 100) / 100).toFixed(2);
      this.AverageRevenue = (this.dataSource_GM.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0)/this.dataSource_GM.filteredData.length).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
    });
    this.RevenueVolumeFilter.valueChanges.subscribe(value => {
      this.filteredValues["RevenueVolume"] = value;
      this.dataSource_GM.filter = JSON.stringify(this.filteredValues);
      this.FilteredCount = this.dataSource_GM.filteredData.length;
      this.TotalCount = this.dataSource_GM.filteredData.map(t => t.ClientCount).reduce((acc,value) => acc + value,0);
      this.TotalEffort = (Math.round(this.dataSource_GM.filteredData.map(t => t.ProjectEffort).reduce((acc,value) => acc + value,0) * 100) / 100).toFixed(2);
      this.TotalRevenue = this.dataSource_GM.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.AverageCount = (Math.round(this.dataSource_GM.filteredData.map(t => t.ClientCount).reduce((acc,value) => acc + value,0)/this.dataSource_GM.filteredData.length * 100) / 100).toFixed(2);
      this.AverageEffort = (Math.round(this.dataSource_GM.filteredData.map(t => t.ProjectEffort).reduce((acc,value) => acc + value,0)/this.dataSource_GM.filteredData.length * 100) / 100).toFixed(2);
      this.AverageRevenue = (this.dataSource_GM.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0)/this.dataSource_GM.filteredData.length).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
    });
    this.dataSource_GM.filterPredicate = this.customFilterPredicate();
    // this.dataSource.paginator = this.paginator;
    this.dataSource_GM.sort = this.GMSort;
  }
  ResetFilters(){
    this.dashboard.ShowSpinnerHandler(true);
    this.service.ProjectTeamPerformanceFilters().subscribe(data =>{
      if(data.code == 200){
        this.RegionList = data.FilterRegion;
        this.masterRegion = true;
        this.getSelectedRegion();
        this.QuarterList = data.FilterQuarter;
        this.masterquarter = true;
        this.getSelectedQuarter();
        this.LeaderList = data.FilterGlobalProjectManager;
        this.masterleader = true;
        this.getSelectedleader();
        this.LevelList = data.FilterProjectLevel;
        this.masterLevel = true;
        this.getSelectedLevel();
        data.FilterYears.forEach(item => {
          this.YearsList.push(item.Year);
        })
        var CurrentYear = (new Date()).getFullYear();
        this.Year.setValue(CurrentYear+"");
        this.SetGraph();
        this.dashboard.ShowSpinnerHandler(false);
      }
    });
    this.Apply_disable = true;
  }
  MangerProjectDetails(Manager : string,Leader : string){
    // this.service.P_ManagerWisePerformanceData(this.SelectedQuarter,Manager,this.Year.value).subscribe(data => {
      const dialogRef = this.dialog.open(ManagerPojectDetails, {
        // width: '600px',
        data: {
          Manager : Manager,
          Quarter : this.SelectedQuarter,
          GOliveYear : this.Year.value,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        //this.LoadingMonthlyTotalRevenue();
      });
    // })
  }
  CVchart : any;
  @ViewChild('GMSort') GMSort: MatSort;
  @ViewChild('RMSort') RMSort: MatSort;
  @ViewChild('LMSort') LMSort: MatSort;
  
  G_Managers : any = [];
  G_ProjectCounts  : any [];
  G_Volume : any = [];
  linegraphvalues : lineGraphValues[];
  SetGraph(){
    this.Year.setValue(this.Year.value);
    this.G_Managers = [];
    this.G_ProjectCounts = [];
    this.G_Volume = [];
    this.linegraphvalues = [];
    this.dashboard.ShowSpinnerHandler(true);
    if(this.SelectedLeader == null || this.SelectedQuarter == null || this.SelectedRegion == null || this.SelectedLevel == null || this.Year.value == null){
      alert("Please select all filters");
    }else{
      this.service.GetProjectTeamPerformance(this.SelectedQuarter,this.SelectedRegion,this.SelectedLeader,this.SelectedLevel,this.Year.value).subscribe(data =>{
        if(data.code == 200){
          for(let i = 0;i<data.GlobalManager.length;i++){
            if(data.GlobalManager[i].RevenueVolume == null){
              data.GlobalManager[i].RevenueVolumeUSD = "$0";
            }else{
              data.GlobalManager[i].RevenueVolumeUSD = Math.round(data.GlobalManager[i].RevenueVolume).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
            }
            if(data.GlobalManager[i].ProjectEffort == null){
              data.GlobalManager[i].ProjectEffort_c = "0";
            }else{
              data.GlobalManager[i].ProjectEffort_c = (Math.round(data.GlobalManager[i].ProjectEffort * 100) / 100).toFixed(2);
            }
          }
          // for(let i = 0;i<data.RegionalManager.length;i++){
          //   if(data.RegionalManager[i].RevenueVolume_RM == null){
          //     data.RegionalManager[i].RevenueVolumeUSD = "$0";
          //   }else{
          //     data.RegionalManager[i].RevenueVolumeUSD = Math.round(data.RegionalManager[i].RevenueVolume_RM).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
          //   }
          // }
          // for(let i = 0;i<data.LocalManager.length;i++){
          //   if(data.LocalManager[i].RevenueVolume_LM == null){
          //     data.LocalManager[i].RevenueVolumeUSD = "$0";
          //   }else{
          //     data.LocalManager[i].RevenueVolumeUSD = Math.round(data.LocalManager[i].RevenueVolume_LM).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
          //   }
          // }
          // data.GlobalManager.forEach(item =>{
          //   this.G_Managers.push(item.Manager);
          //   this.G_ProjectCounts.push(item.ClientCount);
          //   this.G_Volume.push(item.RevenueVolume);
          //   this.linegraphvalues.push({x : item.RevenueVolume,y :item.Manager})
          // })
          this.dataSource_GM = new MatTableDataSource(data.GlobalManager);
          this.dataSource_GM.sort = this.GMSort;
          this.onFilterValueChange();
          this.FilteredCount = this.dataSource_GM.filteredData.length;
          this.TotalCount = this.dataSource_GM.filteredData.map(t => t.ClientCount).reduce((acc,value) => acc + value,0);
          this.TotalEffort = (Math.round(this.dataSource_GM.filteredData.map(t => t.ProjectEffort).reduce((acc,value) => acc + value,0) * 100) / 100).toFixed(2);
          this.TotalRevenue = this.dataSource_GM.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
          this.AverageCount = (Math.round(this.dataSource_GM.filteredData.map(t => t.ClientCount).reduce((acc,value) => acc + value,0)/this.dataSource_GM.filteredData.length * 100) / 100).toFixed(2);
          this.AverageEffort = (Math.round(this.dataSource_GM.filteredData.map(t => t.ProjectEffort).reduce((acc,value) => acc + value,0)/this.dataSource_GM.filteredData.length * 100) / 100).toFixed(2);
          this.AverageRevenue = (this.dataSource_GM.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0)/this.dataSource_GM.filteredData.length).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
          // this.dataSource_RM = new MatTableDataSource(data.RegionalManager);
          // this.dataSource_RM.sort = this.RMSort;
          // this.dataSource_LM = new MatTableDataSource(data.LocalManager);
          // this.dataSource_LM.sort = this.LMSort;
          // if(this.CVchart != undefined){
          //   this.CVchart.destroy();
          // }
          // this.CVchart = new Chart('CVcanvas', {
          //   type : 'horizontalBar',
          //   data : {
          //     //labels : this.Months,
          //     labels : this.G_Managers,
          //     datasets: [{
          //       indexAxis: 'y',
          //       label : "Revenue Total Volume USD",
          //       data: this.linegraphvalues,
          //       backgroundColor : "rgb(253, 180, 92)",
          //       borderColor : "rgb(253, 180, 92)",
          //       fill : false,
          //       // type : 'bar',
          //       lineTension: 0,
          //       // type : 'horizontalline',
          //       type : 'line',
          //       xAxisID: 'A',
          //     },{
          //       indexAxis: 'y',
          //       label : " Project Count",
          //       data: this.G_ProjectCounts,
          //       backgroundColor : "rgb(70, 191, 189)",
          //       // fill : false,
          //       type : 'horizontalBar',
          //       xAxisID: 'B',
          //     }]
          //   },
          //   options: {
          //     // Elements options apply to all of the options unless overridden in a dataset
          //     // In this case, we are setting the border of each horizontal bar to be 2px wide
          //     responsive: true,
          //     maintainAspectRatio: false,
          //     // barSizeRatio:0.2,
          //     // aspectRatio : 1,
          //     bezierCurve: false,
          //     hover: {
          //       mode: 'index',
          //       intersect: false
          //     },
          //     legend: {
          //       display: true,
          //       position : 'bottom',
          //       fullWidth : true,
          //       labels: {
          //           fontColor: '#000000',
          //           fontSize :  13,
          //           padding : 10,
          //           fontStyle : 'bold',
          //           fontFamily : 'Arial',
          //       }
          //     },
          //     tooltips: {
          //       callbacks: {
          //         label: function(tooltipItems, data) {
          //           if(tooltipItems.datasetIndex === 1){
          //             return " Project Count : " + 
          //             Math.round(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]);
          //           }else if(tooltipItems.datasetIndex === 0){
          //             return " Revenue Volume : " + 
          //             Math.round(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index].x).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
          //           }
          //         }
          //       }
          //     },
          //     title: {
          //       display: true,
          //       text: ' '
          //     },
          //     scales: {
          //       y: {
          //          type: 'category',
          //          axis: 'x'
          //       },
          //       xAxes: [
          //         {
          //         id: 'A',
          //         type: 'linear',
          //         position: 'top',
          //         // stacked: true,
          //         ticks: {
          //           fontSize : 11,
          //           fontStyle : 'bold',
          //           fontColor : '#000000',
          //           fontFamily : 'Arial',
          //           callback: function(label, index, labels) {
          //             if(label == 0) {
          //               return 0;
          //             }
          //             else
          //             {
          //               // hundreds
          //               if(label <= 999){
          //                 return label;
          //               }
          //               // thousands
          //               else if(label >= 1000 && label <= 999999){
          //                 return (label / 1000) + 'K';
          //               }
          //               // millions
          //               else if(label >= 1000000 && label <= 999999999){
          //                 return (label / 1000000) + 'M';
          //               }
          //               // billions
          //               else if(label >= 1000000000 && label <= 999999999999){
          //                 return (label / 1000000000) + 'B';
          //               }
          //               else
          //                 return label;
          //             }
          //           }
          //         },
          //         gridLines: {
          //           color: "rgba(0, 0, 0, 0)",
          //         },
          //         scaleLabel: {
          //           display: true,
          //           labelString: 'Revenue Total Volume USD',
          //           fontSize : 13,
          //           fontStyle : 'bold',
          //           fontColor : '#000000',
          //           fontFamily : 'Arial',
          //         }
          //       },{
          //         id: 'B',
          //         // barPercentage: 0.4,
          //         // barThickness: 50,
          //         type: 'linear',
          //         position: 'bottom',
          //         ticks: {
          //           fontSize : 11,
          //           fontStyle : 'bold',
          //           fontColor : '#000000',
          //           fontFamily : 'Arial',
          //         },
          //         gridLines: {
          //           color: "rgba(0, 0, 0, 0)",
          //         },
          //         scaleLabel: {
          //           display: true,
          //           labelString: 'Projects Count',
          //           fontSize : 13,
          //           fontStyle : 'bold',
          //           fontColor : '#000000',
          //           fontFamily : 'Arial',
          //         }
          //       }],
          //       yAxes: [{
          //         ticks: {
          //           fontSize : 11,
          //           fontStyle : 'bold',
          //           fontColor : '#000000',
          //           fontFamily : 'Arial',
          //         },gridLines: {
          //           color: "rgba(0, 0, 0, 0)",
          //         }
          //       }],
          //     },
          //   },
          //   // options: Options2,
          // })
        }else{
        }
        this.dashboard.ShowSpinnerHandler(false);
      })
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
  checkUncheckquarter(){
    for (var i = 0; i < this.QuarterList.length; i++) {
      this.QuarterList[i].isSelected = this.masterquarter;
    }
    this.getSelectedQuarter();
  }
  quarterSelected(){
    this.masterquarter = this.QuarterList.every(function(item:any) {
      return item.isSelected == true;
    })
    this.getSelectedQuarter();
  }
  getSelectedQuarter(){
    this.Apply_disable = false;
    this.SelectedQuarter = null;
    for(let i=0;i<this.QuarterList.length;i++){
      if(this.QuarterList[i].isSelected == true){
        if(this.SelectedQuarter == null){
          if(this.QuarterList[i].Quarter == null || this.QuarterList[i].Quarter == ""){
            this.SelectedQuarter = ",";
          }else{
            this.SelectedQuarter = this.QuarterList[i].Quarter;
          }
        }else{
          this.SelectedQuarter += ","+this.QuarterList[i].Quarter;
        }
      }else{
      }
    }
  }
  checkUncheckleader(){
    for (var i = 0; i < this.LeaderList.length; i++) {
      this.LeaderList[i].isSelected = this.masterleader;
    }
    this.getSelectedleader();
  }
  leaderSelected(){
    this.masterleader = this.LeaderList.every(function(item:any) {
      return item.isSelected == true;
    })
    this.getSelectedleader();
  }
  getSelectedleader(){
    this.Apply_disable = false;
    this.SelectedLeader = null;
    for(let i=0;i<this.LeaderList.length;i++){
      if(this.LeaderList[i].isSelected == true){
        if(this.SelectedLeader == null){
          if(this.LeaderList[i].GlobalProjectManager == null || this.LeaderList[i].GlobalProjectManager == ""){
            this.SelectedLeader = ",";
          }else{
            this.SelectedLeader = this.LeaderList[i].GlobalProjectManager;
          }
        }else{
          this.SelectedLeader += ","+this.LeaderList[i].GlobalProjectManager;
        }
      }else{
      }
    }
  }
  checkUnchecklevel(){
    for (var i = 0; i < this.LevelList.length; i++) {
      this.LevelList[i].isSelected = this.masterLevel;
    }
    this.getSelectedLevel();
  }
  levelSelected(){
    this.masterLevel = this.LevelList.every(function(item:any) {
      return item.isSelected == true;
    })
    this.getSelectedLevel();
  }
  getSelectedLevel(){
    this.Apply_disable = false;
    this.SelectedLevel = null;
    for(let i=0;i<this.LevelList.length;i++){
      if(this.LevelList[i].isSelected == true){
        if(this.SelectedLevel == null){
          if(this.LevelList[i].ProjectLevel == null || this.LevelList[i].ProjectLevel == ""){
            this.SelectedLevel = ",";
          }else{
            this.SelectedLevel = this.LevelList[i].ProjectLevel;
          }
        }else{
          this.SelectedLevel += ","+this.LevelList[i].ProjectLevel;
        }
      }else{
      }
    }
  }
}

@Component({
  selector: 'app-managerpojectdetails',
  templateUrl: './managerpojectdetails.component.html',
  styleUrls: ['./managerpojectdetails.component.css']
})
export class ManagerPojectDetails {
  constructor(
    public datepipe : DatePipe,
    public service : DashboardServiceService,
    public dialogRef: MatDialogRef<ManagerPojectDetails>,
    private excelService:ExcelService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    window.onresize = () => {
      //set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    };
    }
    screenHeight;screenWidth
  // @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatSort) sort: MatSort;
  dataSource;
  FilteredCount;
  displayedColumns: any[] = ['Client','RevenueVolume','Region','ProjectEffort','GlobalProjectManager','RegionalProjectManager','AssigneeFullName','Golive','ProjectStatus','ProjectLevel'];
  ClrData;
  ngOnInit() {
    this.service.P_ManagerWisePerformanceData(this.data.Quarter+"",this.data.Manager,this.data.GOliveYear).subscribe(data => {
      if(data.code == 200){
        for(let i = 0;i<data.Data.length;i++){
          if(data.Data[i].RevenueVolumeUSD == null){
            data.Data[i].RevenueVolume = "$0";
          }else{
            data.Data[i].RevenueVolume = Math.round(data.Data[i].RevenueVolumeUSD).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
          }
          if(data.Data[i].GoLiveDate == null){
            data.Data[i].Golive = "---";
          }else{
            data.Data[i].Golive = this.datepipe.transform(data.Data[i].GoLiveDate, "yyyy-MMM-dd");
          }
        }
        this.dataSource = new MatTableDataSource(data.Data);
        this.dataSource.sort = this.sort;
      }
    })
  }
}