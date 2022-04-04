import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardServiceService } from '../../dashboard-service.service';
import { Chart } from 'chart.js';
import { ProjectStatus, CriticalOverDue, GroupName, ProjectLevel, Region, Country } from '../../Models/CtoFilters';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort} from '@angular/material/sort';
import { ExcelService } from '../../excel.service';
import { LivedashboardComponent } from '../livedashboard/livedashboard.component';
import { DatePipe } from '@angular/common';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-critical-tasks-over-due',
  templateUrl: './critical-tasks-over-due.component.html',
  styleUrls: ['./critical-tasks-over-due.component.css']
})

export class CriticalTasksOverDueComponent implements OnInit {
  //SelectedStatus : any; SelectedOverDue : any; 
  SelectedGroupName : any; SelectedLevel : any; SelectedRegions : any;
  //masterstatus : boolean; masteroverdue : boolean;
  mastergname : boolean; masterlevel  :boolean; masterregion : boolean; 
  //mastercountry : boolean; SelectedCountry : any;
  // statusList : ProjectStatus[];
  // statusListSelected : ProjectStatus[];
  // overdueList : CriticalOverDue[];
  // overdueListSelected : CriticalOverDue[];
  groupnameList : GroupName[];
  groupnameListSelected : GroupName[];
  levelList : ProjectLevel[];
  levelListSelected : ProjectLevel[];
  regionList : Region[];
  regionListSelected : Region[];
  //countryList : Country[];
  Apply_disable : boolean;
  dataSource;
  Rcanvas : any;
  GNcanvas : any;
  ProjectStatus : any = [];
  ProjectCount : any = [];
  GroupNameCount : any = [];
  GroupNames : any = [];
  screenWidth : number;
  screenHeight : number;
  LoginUID : string;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['Workspace_Title', 'Milestone_Title_Country___Est_Go_Live_Date','Task_Title','Milestone__Project_Status','Milestone__Region','Workspace__Project_Level','Group_Name','Milestone_Due_Date','Task_Overdue'];
  constructor(public datepipe : DatePipe,public service : DashboardServiceService, public dashboard : LivedashboardComponent, private excelService:ExcelService) {
    //set screenWidth on page load
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    window.onresize = () => {
      //set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    };
   }
  ngOnInit() {
    this.ResetFilters();
  }
  ResetFilters(){
    this.LoginUID = localStorage.getItem("UID");
    this.dashboard.ShowSpinnerHandler(true);
    this.service.CriticalTaskFiltersList().subscribe(data =>{
      if(data.code == 200){
        this.groupnameList = data.GroupName;
        this.mastergname = true;
        this.getSelectedGName();
        this.levelList = data.ProjectLevel;
        this.masterlevel = true;
        this.getSelectedLevels();
        this.regionList = data.Region;
        this.masterregion = true;
        this.getSelectedRegion();
        this.SetGraph();
      }
    });
    this.Apply_disable = true;
  }
  SetGraph(){
    if(this.SelectedGroupName == null || this.SelectedLevel == null || this.SelectedRegions == null){
      alert("Please Select all Filters");
    }else{
      this.dashboard.ShowSpinnerHandler(true);
      this.ProjectStatus = [];
      this.ProjectCount = [];
      this.GroupNameCount = [];
      this.GroupNames = [];
      this.service.CriticalTaskOverDue(this.SelectedGroupName,this.SelectedLevel,this.SelectedRegions).subscribe(data =>{
        this.Apply_disable = true;
        if(data.code == 200){
          this.dataSource = new MatTableDataSource(data.Data);
          this.dataSource.sort = this.sort;
        }else{
          this.dataSource = null;
        }
        this.dashboard.ShowSpinnerHandler(false);
      })
      this.dashboard.ShowSpinnerHandler(true);
      this.service.RegionWiseCount(this.SelectedGroupName,this.SelectedLevel,this.SelectedRegions).subscribe(data =>{
        this.Apply_disable = true;
        var Options = {
          legend: {
            display: true,
            position : 'bottom' as 'bottom',
            fullWidth : true,
            labels: {
                fontColor: '#000000',
                fontSize :  10,
                padding : 10,
                fontStyle : 'normal',
                fontFamily : 'Arial',
            }
          },
          title: {
            display: true,
            text: ' '
          },
          hover: {
            mode: 'index' as 'index',
            intersect: false
          },
          responsive : true,
          scales: {
            xAxes: [{
              ticks: {
                fontSize : 10,
                fontStyle : 'normal',
                fontColor : '#000000',
                fontFamily : 'Arial',
                // autoSkip: false,
                // maxRotation: 0,
                // minRotation: 0
              },
              gridLines: {
                color: "rgba(0, 0, 0, 0)",
              }
            }],
            yAxes: [{
              ticks: {
                beginAtZero:true,
                // max:700,
                fontSize : 10,
                fontStyle : 'bold',
                fontColor : '#000000',
                fontFamily : 'Arial',
              },
              gridLines: {
                color: "rgba(0, 0, 0, 0)",
              }
            }]
          },
          plugins: {
            labels: {
              render: 'value',
              fontColor: '#3B3B3B',
              textMargin: 6,
              arc: false,
              fontSize: 10,
              fontStyle: 'bold',
              fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            }
          },
          tooltips: {
            mode: 'index' as 'index',
            intersect: false,
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.yLabel;
              }
            }
          },
        }
        if(data.code == 200){
          data.Data.forEach( item =>{
            this.ProjectCount.push(item.ProjectsCount);
            this.ProjectStatus.push(item.Milestone__Region);
          })
          if(this.ProjectStatus != null && this.ProjectCount != null){
            if(this.Rcanvas != undefined){
              this.Rcanvas.destroy();
            }
            this.Rcanvas = new Chart('Rcanvas', {
              type : 'bar',
              data : {
                labels : this.ProjectStatus,
                //labels : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                datasets: [{
                  label: "Total Count By Region ("+Math.round(data.Data.map(t => t.ProjectsCount).reduce((acc,value) => acc + value,0))+")",
                  backgroundColor : 'rgba(93, 173, 226,1)',
                  borderColor : 'rgba(244, 246, 246 ,1)',
                  hoverBackgroundColor : 'rgba(93, 173, 226 ,0.6)',
                  borderWidth: 2,
                  data: this.ProjectCount,
                  fill: false,
                }]
              },
              options: Options,
            })
          }
        }else{
        }
        this.dashboard.ShowSpinnerHandler(false);
      });
      this.service.GroupNameCountCTO(this.SelectedGroupName,this.SelectedLevel,this.SelectedRegions).subscribe(data =>{
        this.Apply_disable = true;
        var Options = {
          legend: {
            display: true,
            position : 'bottom' as 'bottom',
            fullWidth : true,
            labels: {
                fontColor: '#000000',
                fontSize :  10,
                padding : 10,
                fontStyle : 'normal',
                fontFamily : 'Arial',
            }
          },
          title: {
            display: true,
            text: ' '
          },
          hover: {
            mode: 'index' as 'index',
            intersect: false
          },
          responsive : true,
          scales: {
            xAxes: [{
              ticks: {
                fontSize : 10,
                fontStyle : 'normal',
                fontColor : '#000000',
                fontFamily : 'Arial',
                // autoSkip: false,
                // maxRotation: 0,
                // minRotation: 0
              },
              gridLines: {
                color: "rgba(0, 0, 0, 0)",
              }
            }],
            yAxes: [{
              ticks: {
                beginAtZero:true,
                // max:700,
                fontSize : 10,
                fontStyle : 'bold',
                fontColor : '#000000',
                fontFamily : 'Arial',
              },
              gridLines: {
                color: "rgba(0, 0, 0, 0)",
              }
            }]
          },
          // scales: {
          //   yAxes: [{
          //     scaleLabel: {
          //         display: true,
          //         labelString: 'Projects Count',
          //         fontSize : 10,
          //         fontStyle : 'normal',
          //         fontColor : '#000000',
          //         fontFamily : 'Arial',
          //     }
          //   }]
          // },
          plugins: {
            labels: {
              render: 'value',
              fontColor: '#3B3B3B',
              textMargin: 6,
              arc: false,
              fontSize: 10,
              fontStyle: 'bold',
              fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            }
          },
          tooltips: {
            mode: 'index' as 'index',
            intersect: false,
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.yLabel;
              }
            }
          },
        }
        if(data.code == 200){
          data.Data.forEach( item =>{
            this.GroupNameCount.push(item.ProjectsCount);
            this.GroupNames.push(item.Group_Name);
          })
          if(this.GroupNames != null && this.GroupNameCount != null){
            if(this.GNcanvas != undefined){
              this.GNcanvas.destroy();
            }
            this.GNcanvas = new Chart('GNcanvas', {
              type : 'bar',
              data : {
                labels : this.GroupNames,
                //labels : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                datasets: [{
                  label: "Total Count By Group Names ("+Math.round(data.Data.map(t => t.ProjectsCount).reduce((acc,value) => acc + value,0))+")",
                  backgroundColor : 'rgba(23, 32, 42 ,1)',
                  borderColor : 'rgba(229, 231, 233 ,1)',
                  hoverBackgroundColor : 'rgba(23, 32, 42 ,0.6)',
                  borderWidth: 2,
                  data: this.GroupNameCount,
                  fill: false,
                }]
              },
              options: Options,
            })
          }
        }else{
        }
      });
    }
  }
  exportData(){
    this.dashboard.ShowSpinnerHandler(true);
    this.service.CriticalTaskOverDue(this.SelectedGroupName,this.SelectedLevel,this.SelectedRegions).subscribe(data =>{
      if(data.code == 200){
        for(let i=0;i < data.Data.length;i++){
          if(data.Data[i].Estimated_Go_Live == null){
            data.Data[i].Estimated_Go_Live_c = null;
          }else{
            data.Data[i].Estimated_Go_Live_c = this.datepipe.transform(data.Data[i].Estimated_Go_Live,"MM-dd-yyyy");
          }
          if(data.Data[i].Milestone_Due_Date == null){
            data.Data[i].Milestone_Due_Date_c = null;
          }else{
            data.Data[i].Milestone_Due_Date_c = this.datepipe.transform(data.Data[i].Milestone_Due_Date,"MM-dd-yyyy");
          }
          if(data.Data[i].Task_Start_Date == null){
            data.Data[i].Task_Start_Date_c = null;
          }else{
            data.Data[i].Task_Start_Date_c = this.datepipe.transform(data.Data[i].Task_Start_Date,"MM-dd-yyyy");
          }
          if(data.Data[i].Task_Due_Date == null){
            data.Data[i].Task_Due_Date_c = null;
          }else{
            data.Data[i].Task_Due_Date_c = this.datepipe.transform(data.Data[i].Task_Due_Date,"MM-dd-yyyy");
          }
        }
        const CustomizedData = data.Data.map(o => {
          return {
            'Milestone Title Country Est Go Live Date' : o.Milestone_Title_Country___Est_Go_Live_Date,
            'Critical Overdue' : o.Critical_Overdue,
            'Estimated Go Live' : o.Estimated_Go_Live_c,
            'Workspace Title' : o.Workspace_Title,
            'Milestone Project Status' : o.Milestone__Project_Status,
            'Group Name' : o.Group_Name,
            'Milestone Region' : o.Milestone__Region,
            'Milestone Country' : o.Milestone__Country,
            'Milestone Title' : o.Milestone_Title,
            'Milestone Assignee Full Name' : o.Milestone__Assignee__Full_Name,
            'Milestone Due Date' : o.Milestone_Due_Date_c,
            'Milestone Country Status' : o.Milestone__Country_Status,
            'Task List Title' : o.Task_List_Title,
            'Task Title' : o.Task_Title,
            'Task Assignee Full Name' : o.Task__Assignee__Full_Name,
            'Task Status' : o.Task_Status,
            'Task Overdue' : o.Task_Overdue,
            'Task Start Date' : o.Task_Start_Date_c,
            'Task Due Date' : o.Task_Due_Date_c,
            'Workspace Project Level' : o.Workspace__Project_Level,
          };
        });
        this.excelService.exportAsExcelFile(CustomizedData, 'Critical Task Overdue');
      }else{
        alert("Something Went wrong, Please Try again later");
      }
      this.service.UsersUsageofReports(this.LoginUID,"Critical Task Overdue","Export").subscribe(data =>{
      })
      this.dashboard.ShowSpinnerHandler(false);
    });
  }
  //Start of Status methods
  // checkUncheckStatus() {
  //   for (var i = 0; i < this.statusList.length; i++) {
  //     this.statusList[i].isSelected = this.masterstatus;
  //   }
  //   this.getSelectedstatus();
  // }
  // statusSelected() {
  //   this.masterstatus = this.statusList.every(function(item:any) {
  //       return item.isSelected == true;
  //   })
  //   this.getSelectedstatus();
  // }
  // getSelectedstatus(){
  //   this.Apply_disable = false;
  //   this.SelectedStatus = null;
  //   for(let i=0;i<this.statusList.length;i++){
  //     if(this.statusList[i].isSelected == true){
  //       if(this.SelectedStatus == null){
  //         this.SelectedStatus = this.statusList[i].Milestone__Project_Status;
  //       }else{
  //         this.SelectedStatus += ","+this.statusList[i].Milestone__Project_Status;
  //       }
  //     }else{
  //     }
  //   }
  //   this.statusListSelected = this.statusList.filter(s => s.isSelected == true);
  // }
  // deselectStatus(val : string){
  //   for(let i=0;i<this.statusList.length;i++){
  //     if(this.statusList[i].Milestone__Project_Status == val){
  //       this.statusList[i].isSelected = false;
  //     }else{
  //     }
  //   }
  //   this.statusSelected();
  // }
  // //End of Status Methods
  // //Start of overdue Methods
  // checkUncheckOverDue() {
  //   for (var i = 0; i < this.overdueList.length; i++) {
  //     this.overdueList[i].isSelected = this.masteroverdue;
  //   }
  //   this.getSelectedOverDue();
  // }
  // overdueSelected() {
  //   this.masteroverdue = this.overdueList.every(function(item:any) {
  //       return item.isSelected == true;
  //   })
  //   this.getSelectedOverDue();
  // }
  // getSelectedOverDue(){
  //   this.Apply_disable = false;
  //   this.SelectedOverDue = null;
  //   for(let i=0;i<this.overdueList.length;i++){
  //     if(this.overdueList[i].isSelected == true){
  //       if(this.SelectedOverDue == null){
  //         this.SelectedOverDue = this.overdueList[i].Critical_Overdue;
  //       }else{
  //         this.SelectedOverDue += ","+this.overdueList[i].Critical_Overdue;
  //       }
  //     }else{
  //     }
  //   }
  //   this.overdueListSelected = this.overdueList.filter(s => s.isSelected == true);
  // }
  // deselectOverDue(val : number){
  //   for(let i=0;i<this.overdueList.length;i++){
  //     if(this.overdueList[i].Critical_Overdue == val){
  //       this.overdueList[i].isSelected = false;
  //     }else{
  //     }
  //   }
  //   this.overdueSelected();
  // }
  //End of overdue Methods
  //Start of GroupName Methods
  checkUncheckGName() {
    for (var i = 0; i < this.groupnameList.length; i++) {
      this.groupnameList[i].isSelected = this.mastergname;
    }
    this.getSelectedGName();
  }
  gnameSelected() {
    this.mastergname = this.groupnameList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedGName();
  }
  getSelectedGName(){
    this.Apply_disable = false;
    this.SelectedGroupName = null;
    for(let i=0;i<this.groupnameList.length;i++){
      if(this.groupnameList[i].isSelected == true){
        if(this.SelectedGroupName == null){
          this.SelectedGroupName = this.groupnameList[i].Group_Name;
        }else{
          this.SelectedGroupName += ","+this.groupnameList[i].Group_Name;
        }
      }else{
      }
    }
    this.groupnameListSelected = this.groupnameList.filter(s => s.isSelected == true);
  }
  deselectgname(val : string){
    for(let i=0;i<this.groupnameList.length;i++){
      if(this.groupnameList[i].Group_Name == val){
        this.groupnameList[i].isSelected = false;
      }else{
      }
    }
    this.gnameSelected();
  }
  //End of GroupName Methods
  //Start of Level Methods
  checkUncheckLevel() {
    for (var i = 0; i < this.levelList.length; i++) {
      this.levelList[i].isSelected = this.masterlevel;
    }
    this.getSelectedLevels();
  }
  levelSelected() {
    this.masterlevel = this.levelList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedLevels();
  }
  getSelectedLevels(){
    this.Apply_disable = false;
    this.SelectedLevel = null;
    for(let i=0;i<this.levelList.length;i++){
      if(this.levelList[i].isSelected == true){
        if(this.SelectedLevel == null){
          this.SelectedLevel = this.levelList[i].Workspace__Project_Level;
        }else{
          this.SelectedLevel += ","+this.levelList[i].Workspace__Project_Level;
        }
      }else{
      }
    }
    this.levelListSelected = this.levelList.filter(s => s.isSelected == true);
  }
  deselectLevel(val : string){
    for(let i=0;i<this.levelList.length;i++){
      if(this.levelList[i].Workspace__Project_Level == val){
        this.levelList[i].isSelected = false;
      }else{
      }
    }
    this.levelSelected();
  }
  //End of Level Methods
  //Start of Region Methods
  checkUncheckRegion() {
    for (var i = 0; i < this.regionList.length; i++) {
      this.regionList[i].isSelected = this.masterregion;
    }
    this.getSelectedRegion();
  }
  regionSelected() {
    this.masterregion = this.regionList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedRegion();
  }
  getSelectedRegion(){
    this.Apply_disable = false;
    this.SelectedRegions = null;
    for(let i=0;i<this.regionList.length;i++){
      if(this.regionList[i].isSelected == true){
        if(this.SelectedRegions == null){
          this.SelectedRegions = this.regionList[i].Milestone__Region;
        }else{
          this.SelectedRegions += ","+this.regionList[i].Milestone__Region;
        }
      }else{
      }
    }
    this.regionListSelected = this.regionList.filter(s => s.isSelected == true);
  }
  deselectRegion(val : string){
    for(let i=0;i<this.regionList.length;i++){
      if(this.regionList[i].Milestone__Region == val){
        this.regionList[i].isSelected = false;
      }else{
      }
    }
    this.regionSelected();
  }
  //End of Region Methods
  //Start of Quarter Methods
  // checkUncheckCountry() {
  //   for (var i = 0; i < this.countryList.length; i++) {
  //     this.countryList[i].isSelected = this.mastercountry;
  //   }
  //   this.getSelectedCountry();
  // }
  // countrySelected() {
  //   this.mastercountry = this.countryList.every(function(item:any) {
  //       return item.isSelected == true;
  //   })
  //   this.getSelectedCountry();
  // }
  // getSelectedCountry(){
  //   this.SelectedCountry = null;
  //   for(let i=0;i<this.countryList.length;i++){
  //     if(this.countryList[i].isSelected == true){
  //       if(this.SelectedCountry == null){
  //         this.SelectedCountry = this.countryList[i].Milestone__Country;
  //       }else{
  //         this.SelectedCountry += ","+this.countryList[i].Milestone__Country;
  //       }
  //     }else{
  //     }
  //   }
  // }
  //End of Quarter Methods
}