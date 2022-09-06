import { Component, Inject, OnInit, Optional, ViewChild, ViewEncapsulation } from '@angular/core';
import { DashboardServiceService } from 'src/app/dashboard-service.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { Data } from 'src/app/Models/Responce';
import { DatePipe } from '@angular/common';
import { ExcelService } from 'src/app/excel.service';
import { FormControl } from '@angular/forms';
import { Level, WorkingDay, WorkShedule, Leader, Region, CHFilter } from 'src/app/Models/CHFilter';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TrackerCommentdailog } from '../tracker/tracker.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LivedashboardComponent } from '../livedashboard/livedashboard.component';
export class MyFilter {
  Region : string;
  Level : string;
  ProjectLevel : string;
  Leader : string;
  Manager : string;
  WorkShedule : string;
  WorkingDays : string;
  Comments : string;
}
export interface ResourceDialogData {
  Dailog_ID : number;
  Dailog_Comment : string;
}
@Component({
  selector: 'app-resource-utilization',
  templateUrl: './resource-utilization.component.html',
  styleUrls: ['./resource-utilization.component.css']
})
export class ResourceUtilizationComponent implements OnInit {
  dataSource;PdataSource;
  ResUtilData : Data[];
  ProspectData : Data[];
  date = new Date();
  Levels = new FormControl();
  Regions = new FormControl();
  Leaders = new FormControl();
  Workshedules = new FormControl();
  WorkingDays = new FormControl();
  ProjectStatusFilter = new FormControl();
  LevelList : Level[];
  RegionList : Region[];
  LeaderList : Leader[];
  WorkSheduleList : WorkShedule[];
  WorkingDaysList : WorkingDay[];
  masterProjectStatus : boolean;
  ProjectStatusList : any = [];
  // masterregion : boolean;masterlevel : boolean;masterleader : boolean;mastershedule : boolean;masterdays : boolean;
  // SelectedLevel;SelectedRegion;SelectedLeader;SelectedShedule;Selecteddays;
  filterData : CHFilter[];
  GLOBAL_Rc;LOCAL_RC;APACR_RC;NORAMR_RC;LATAMR_RC;EMEAR_RC;
  GLOBAL_Rc_D;LOCAL_RC_D;APACR_RC_D;NORAMR_RC_D;LATAMR_RC_D;EMEAR_RC_D;
  Global_Count;Local_Count;APACR_Count;NORAMR_Count;LATAMR_Count;EMEAR_Count;
  Global_Count_D;Local_Count_D;APACR_Count_D;NORAMR_Count_D;LATAMR_Count_D;EMEAR_Count_D;
  C1stweek;C2ndweek;C3rdweek;C4thweek;C5thweek;C6thweek;C7thweek;C8thweek;C9thweek;C10thweek;C11thweek;C12thweek;
  c13thweek;c14thweek;c15thweek;c16thweek;c17thweek;c18thweek;c19thweek;c20thweek;c21thweek;c22thweek;c23thweek;c24thweek;
  displayedColumns: string[] = ['Region','ProjectLevel','Level','Leader','Manager','WorkingDays','Comments','RelativeCapacity','TargetedUtilization','CapacityAvailable','TUWorkingDays','CapacityAvailableTUWorkingDays','AvgUtil','C1stweek','C2ndweek','C3rdweek','C4thweek','C5thweek','C6thweek','C7thweek','C8thweek','C9thweek','C10thweek','C11thweek','C12thweek','c13thweek','c14thweek','c15thweek','c16thweek','c17thweek','c18thweek','c19thweek','c20thweek','c21thweek','c22thweek','c23thweek','c24thweek'];
  displayedColumns_h : string[] = ['Region_h','ProjectLevel_h','Level_h','Leader_h','Manager_h','WorkingDays_h','Comments_h','RelativeCapacity_h','TargetedUtilization_h','CapacityAvailable_h','TUWorkingDays_h','CapacityAvailableTUWorkingDays_h','AvgUtil_h','C1stweek_h'];
  //PdisplayedColumns: string[] = ['Region','Leader','Manager','Client_Name','PAvgUtil','C1stweek','C2ndweek','C3rdweek','C4thweek','C5thweek','C6thweek','C7thweek','C8thweek','C9thweek','C10thweek','C11thweek','C12thweek'];
  constructor(public service : DashboardServiceService,public dialog: MatDialog,public dashboard : LivedashboardComponent,public datepipe : DatePipe,public excelservice : ExcelService) {
    // set screenWidth on page load
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    window.onresize = () => {
      // set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    };
  }
  filteredValues : MyFilter = {
    Region : '',
    Level : '',
    ProjectLevel : '',
    Leader : '',
    Manager : '',
    WorkShedule : '',
    WorkingDays : '',Comments : ''};
  RegionFilter = new FormControl();
  LevelFilter = new FormControl();
  ProjectLevelFilter = new FormControl();
  LeaderFilter = new FormControl();
  ManagerFilter = new FormControl();
  WorkSheduleFilter = new FormControl();
  WorkingDaysFilter = new FormControl();
  CommentsFilter = new FormControl();

  @ViewChild(MatSort) sort: MatSort;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  ngAfterViewInit() {
  }
  screenWidth : number;
  screenHeight  : number;
  customFilterPredicate() {
    return (data: Data, filter: string): boolean => {
      let searchString = JSON.parse(filter) as MyFilter;
      return (
        data.Region.toString().trim().toLowerCase().indexOf(searchString.Region.toLowerCase()) !== -1 &&
        data.Level.toString().trim().toLowerCase().indexOf(searchString.Level.toLowerCase()) !== -1 &&
        data.ProjectLevel.toString().trim().toLowerCase().indexOf(searchString.ProjectLevel.toLowerCase())!== -1 &&
        data.Leader.toString().trim().toLowerCase().indexOf(searchString.Leader.toLowerCase()) !== -1 &&
        data.Manager.toString().trim().toLowerCase().indexOf(searchString.Manager.toLowerCase()) !== -1 &&
        data.WorkShedule.toString().trim().toLowerCase().indexOf(searchString.WorkShedule.toLowerCase()) !== -1 &&
        data.WorkingDays.toString().trim().toLowerCase().indexOf(searchString.WorkingDays.toLowerCase()) !== -1 &&
        data.Comments.toString().trim().toLowerCase().indexOf(searchString.Comments.toLowerCase()) !== -1
      )
    }
  }
  FilteredVolume;FilteredCount;
  onFilterValueChange(){
    this.RegionFilter.valueChanges.subscribe(value => {
      this.filteredValues["Region"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      // this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.LevelFilter.valueChanges.subscribe(value => {
      this.filteredValues["Level"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      // this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.ProjectLevelFilter.valueChanges.subscribe(value => {
      this.filteredValues["ProjectLevel"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      // this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.LeaderFilter.valueChanges.subscribe(value => {
      this.filteredValues["Leader"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      // this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.ManagerFilter.valueChanges.subscribe(value => {
      this.filteredValues["Manager"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      // this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.WorkSheduleFilter.valueChanges.subscribe(value => {
      this.filteredValues["WorkShedule"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      // this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.WorkingDaysFilter.valueChanges.subscribe(value => {
      this.filteredValues["WorkingDays"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      // this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.CommentsFilter.valueChanges.subscribe(value => {
      this.filteredValues["Comments"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      // this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.dataSource.filterPredicate = this.customFilterPredicate();
    // this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit(): void {
    var day = this.date.getDay();
    var diff = this.date.getDate() - day + (day == 0 ? -6:1);
    this.C1stweek = this.datepipe.transform(this.date.setDate(diff), "dd-MMM-yyyy");
    this.C2ndweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.C3rdweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.C4thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.C5thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.C6thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.C7thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.C8thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.C9thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.C10thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.C11thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.C12thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.c13thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.c14thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.c15thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.c16thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.c17thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.c18thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.c19thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.c20thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.c21thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.c22thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.c23thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.c24thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    
    // this.service.CapacityHierarchyFilters().subscribe(data =>{
    //   this.LevelList = data.Level;
    //   this.SelectedLevel = this.LevelList.map(
    //     data => data.Level
    //   );
    //   this.masterlevel = true;
    //   this.RegionList = data.Region;
    //   this.SelectedRegion = this.RegionList.map(
    //     data => data.Region
    //   );
    //   this.masterregion = true;
    //   this.LeaderList = data.Leader;
    //   this.SelectedLeader = this.LeaderList.map(
    //     data => data.Leader
    //   );
    //   this.masterleader = true;
    //   this.WorkingDaysList = data.WorkingDays;
    //   this.Selecteddays = this.WorkingDaysList.map(
    //     data => data.WorkingDays
    //   );
    //   this.masterdays = true;
    //   this.GetResUtil();
    //   //this.WorkSheduleList = data.WorkShedule;
    // })
    this.ProjectStatusList = ["A-Active/Date Confirmed","HP-High Potential","N-Active/No Date Confirmed","P-Pipeline"];
    this.ProjectStatusFilter.setValue(["A-Active/Date Confirmed","HP-High Potential","N-Active/No Date Confirmed","P-Pipeline"]);
    this.masterProjectStatus = true;
    this.P_statuslists = this.ProjectStatusList;
    this.DisableButton = true;
    this.getSelectedProjectStatus();
    // data.FilterProjectStatus.forEach(item =>{
    //   this.ProjectStatusList.push(item.ProjectStatus);
    // })
    this.GetResUtil();
  }
  P_statuslists : any;
  DisableButton : boolean = true;
  applyFilter(){
    this.GetResUtil();
    this.P_statuslists = this.ProjectStatusFilter.value;
    this.DisableButton = true;
  }
  GetResUtil(){
    this.dashboard.ShowSpinnerHandler(true);
    this.service.ResourceUtilization(this.SelectedStatus).subscribe(data =>{
      if(data.code == 200){
        this.ResUtilData = data.Data;
        this.Global_Count = this.ResUtilData.filter(item => item.ProjectLevel === 'Global' && item.Level != 'Digital').length;
        this.Global_Count_D = this.ResUtilData.filter(item => item.ProjectLevel === 'Global' && item.Level === 'Digital').length;
        this.GLOBAL_Rc = this.ResUtilData.filter(item => item.ProjectLevel === 'Global' && item.Level != 'Digital').reduce((sum,current) => sum + current.AvgUtil, 0);
        this.GLOBAL_Rc_D = this.ResUtilData.filter(item => item.ProjectLevel === 'Global' && item.Level === 'Digital').reduce((sum,current) => sum + current.AvgUtil, 0);
        this.Local_Count = this.ResUtilData.filter(item => item.ProjectLevel != 'Global' && item.ProjectLevel != "Regional" && item.Level != 'Digital').length;
        this.Local_Count_D = this.ResUtilData.filter(item => item.ProjectLevel != 'Global' && item.ProjectLevel != "Regional" && item.Level === 'Digital').length;
        this.LOCAL_RC = this.ResUtilData.filter(item => item.ProjectLevel != 'Global' && item.ProjectLevel != "Regional" && item.Level != 'Digital').reduce((sum,current) => sum + current.AvgUtil, 0);
        this.LOCAL_RC_D = this.ResUtilData.filter(item => item.ProjectLevel != 'Global' && item.ProjectLevel != "Regional" && item.Level === 'Digital').reduce((sum,current) => sum + current.AvgUtil, 0);
        this.APACR_Count = this.ResUtilData.filter(item => item.ProjectLevel === 'Regional' && item.Region === 'APAC' && item.Level != 'Digital').length;
        this.APACR_Count_D = this.ResUtilData.filter(item => item.ProjectLevel === 'Regional' && item.Region === 'APAC' && item.Level === 'Digital').length;
        this.APACR_RC = this.ResUtilData.filter(item => item.ProjectLevel === 'Regional' && item.Region === 'APAC' && item.Level != 'Digital').reduce((sum,current) => sum + current.AvgUtil, 0);
        this.APACR_RC_D = this.ResUtilData.filter(item => item.ProjectLevel === 'Regional' && item.Region === 'APAC' && item.Level === 'Digital').reduce((sum,current) => sum + current.AvgUtil, 0);
        this.EMEAR_Count = this.ResUtilData.filter(item => item.ProjectLevel === 'Regional' && item.Region === 'EMEA' && item.Level != 'Digital').length;
        this.EMEAR_Count_D = this.ResUtilData.filter(item => item.ProjectLevel === 'Regional' && item.Region === 'EMEA' && item.Level === 'Digital').length;
        this.EMEAR_RC = this.ResUtilData.filter(item => item.ProjectLevel === 'Regional' && item.Region === 'EMEA' && item.Level != 'Digital').reduce((sum,current) => sum + current.AvgUtil, 0);
        this.EMEAR_RC_D = this.ResUtilData.filter(item => item.ProjectLevel === 'Regional' && item.Region === 'EMEA' && item.Level === 'Digital').reduce((sum,current) => sum + current.AvgUtil, 0);
        this.LATAMR_Count = this.ResUtilData.filter(item => item.ProjectLevel === 'Regional' && item.Region === 'LATAM' && item.Level != 'Digital').length;
        this.LATAMR_Count_D = this.ResUtilData.filter(item => item.ProjectLevel === 'Regional' && item.Region === 'LATAM' && item.Level === 'Digital').length;
        this.LATAMR_RC = this.ResUtilData.filter(item => item.ProjectLevel === 'Regional' && item.Region === 'LATAM' && item.Level != 'Digital').reduce((sum,current) => sum + current.AvgUtil, 0);
        this.LATAMR_RC_D = this.ResUtilData.filter(item => item.ProjectLevel === 'Regional' && item.Region === 'LATAM' && item.Level === 'Digital').reduce((sum,current) => sum + current.AvgUtil, 0);
        this.NORAMR_Count = this.ResUtilData.filter(item => item.ProjectLevel === 'Regional' && item.Region === 'NORAM' && item.Level != 'Digital').length;
        this.NORAMR_Count_D = this.ResUtilData.filter(item => item.ProjectLevel === 'Regional' && item.Region === 'NORAM' && item.Level === 'Digital').length;
        this.NORAMR_RC = this.ResUtilData.filter(item => item.ProjectLevel === 'Regional' && item.Region === 'NORAM' && item.Level != 'Digital').reduce((sum,current) => sum + current.AvgUtil, 0);
        this.NORAMR_RC_D = this.ResUtilData.filter(item => item.ProjectLevel === 'Regional' && item.Region === 'NORAM' && item.Level === 'Digital').reduce((sum,current) => sum + current.AvgUtil, 0);
        for(let i = 0;i<data.Data.length;i++){
          this.ResUtilData[i].C1stweek = Math.round(this.ResUtilData[i].C1stweek);
          this.ResUtilData[i].C2ndweek = Math.round(this.ResUtilData[i].C2ndweek);
          this.ResUtilData[i].C3rdweek = Math.round(this.ResUtilData[i].C3rdweek);
          this.ResUtilData[i].C4thweek = Math.round(this.ResUtilData[i].C4thweek);
          this.ResUtilData[i].C5thweek = Math.round(this.ResUtilData[i].C5thweek);
          this.ResUtilData[i].C6thweek = Math.round(this.ResUtilData[i].C6thweek);
          this.ResUtilData[i].C7thweek = Math.round(this.ResUtilData[i].C7thweek);
          this.ResUtilData[i].C8thweek = Math.round(this.ResUtilData[i].C8thweek);
          this.ResUtilData[i].C9thweek = Math.round(this.ResUtilData[i].C9thweek);
          this.ResUtilData[i].C10thweek = Math.round(this.ResUtilData[i].C10thweek);
          this.ResUtilData[i].C11thweek = Math.round(this.ResUtilData[i].C11thweek);
          this.ResUtilData[i].C12thweek = Math.round(this.ResUtilData[i].C12thweek);
          this.ResUtilData[i].c13thweek = Math.round(this.ResUtilData[i].c13thweek);
          this.ResUtilData[i].c14thweek = Math.round(this.ResUtilData[i].c14thweek);
          this.ResUtilData[i].c15thweek = Math.round(this.ResUtilData[i].c15thweek);
          this.ResUtilData[i].c16thweek = Math.round(this.ResUtilData[i].c16thweek);
          this.ResUtilData[i].c17thweek = Math.round(this.ResUtilData[i].c17thweek);
          this.ResUtilData[i].c18thweek = Math.round(this.ResUtilData[i].c18thweek);
          this.ResUtilData[i].c19thweek = Math.round(this.ResUtilData[i].c19thweek);
          this.ResUtilData[i].c20thweek = Math.round(this.ResUtilData[i].c20thweek);
          this.ResUtilData[i].c21thweek = Math.round(this.ResUtilData[i].c21thweek);
          this.ResUtilData[i].c22thweek = Math.round(this.ResUtilData[i].c22thweek);
          this.ResUtilData[i].c23thweek = Math.round(this.ResUtilData[i].c23thweek);
          this.ResUtilData[i].c24thweek = Math.round(this.ResUtilData[i].c24thweek);
          this.ResUtilData[i].AvgUtil = parseFloat(this.ResUtilData[i].AvgUtil.toFixed(2));
          this.ResUtilData[i].TargetedUtilization = this.ResUtilData[i].TargetedUtilization ?? 0;
          this.ResUtilData[i].TUWorkingDays = parseFloat(this.ResUtilData[i].TUWorkingDays.toFixed(2));
          this.ResUtilData[i].CapacityAvailable = parseFloat((this.ResUtilData[i].CapacityAvailable).toFixed(2));
          this.ResUtilData[i].CapacityAvailableTUWorkingDays = parseFloat((this.ResUtilData[i].CapacityAvailableTUWorkingDays).toFixed(2));
          if(this.ResUtilData[i].CapacityAvailable >= 0){
            this.ResUtilData[i].CATUColor = "Green";
          }else{
            this.ResUtilData[i].CATUColor = "Red";
          }
          if(this.ResUtilData[i].CapacityAvailableTUWorkingDays >= 0){
            this.ResUtilData[i].CATUWDColor = "Green";
          }else{
            this.ResUtilData[i].CATUWDColor = "Red";
          }
          if(this.ResUtilData[i].ProjectLevel == "Global" && this.ResUtilData[i].Level != "Digital"){
            this.ResUtilData[i].RelativeCapacity = (this.ResUtilData[i].AvgUtil/(this.GLOBAL_Rc/this.Global_Count)).toFixed(2);
          }else if(this.ResUtilData[i].ProjectLevel == "Global" && this.ResUtilData[i].Level == "Digital"){
            this.ResUtilData[i].RelativeCapacity = (this.ResUtilData[i].AvgUtil/(this.GLOBAL_Rc_D/this.Global_Count_D)).toFixed(2);
          }else if(this.ResUtilData[i].ProjectLevel == "Regional" && this.ResUtilData[i].Region == "APAC" && this.ResUtilData[i].Level != "Digital"){
            this.ResUtilData[i].RelativeCapacity = (this.ResUtilData[i].AvgUtil/(this.APACR_RC/this.APACR_Count)).toFixed(2);
          }else if(this.ResUtilData[i].ProjectLevel == "Regional" && this.ResUtilData[i].Region == "APAC" && this.ResUtilData[i].Level == "Digital"){
            this.ResUtilData[i].RelativeCapacity = (this.ResUtilData[i].AvgUtil/(this.APACR_RC_D/this.APACR_Count_D)).toFixed(2);
          }else if(this.ResUtilData[i].ProjectLevel == "Regional" && this.ResUtilData[i].Region == "LATAM" && this.ResUtilData[i].Level != "Digital"){
            this.ResUtilData[i].RelativeCapacity = (this.ResUtilData[i].AvgUtil/(this.LATAMR_RC/this.LATAMR_Count)).toFixed(2);
          }else if(this.ResUtilData[i].ProjectLevel == "Regional" && this.ResUtilData[i].Region == "LATAM" && this.ResUtilData[i].Level == "Digital"){
            this.ResUtilData[i].RelativeCapacity = (this.ResUtilData[i].AvgUtil/(this.LATAMR_RC_D/this.LATAMR_Count_D)).toFixed(2);
          }else if(this.ResUtilData[i].ProjectLevel == "Regional" && this.ResUtilData[i].Region == "NORAM" && this.ResUtilData[i].Level != "Digital"){
            this.ResUtilData[i].RelativeCapacity = (this.ResUtilData[i].AvgUtil/(this.NORAMR_RC/this.NORAMR_Count)).toFixed(2);
          }else if(this.ResUtilData[i].ProjectLevel == "Regional" && this.ResUtilData[i].Region == "NORAM" && this.ResUtilData[i].Level == "Digital"){
            this.ResUtilData[i].RelativeCapacity = (this.ResUtilData[i].AvgUtil/(this.NORAMR_RC_D/this.NORAMR_Count_D)).toFixed(2);
          }else if(this.ResUtilData[i].ProjectLevel == "Regional" && this.ResUtilData[i].Region == "EMEA" && this.ResUtilData[i].Level != "Digital"){
            this.ResUtilData[i].RelativeCapacity = (this.ResUtilData[i].AvgUtil/(this.EMEAR_RC/this.EMEAR_Count)).toFixed(2);
          }else if(this.ResUtilData[i].ProjectLevel == "Regional" && this.ResUtilData[i].Region == "EMEA" && this.ResUtilData[i].Level == "Digital"){
            this.ResUtilData[i].RelativeCapacity = (this.ResUtilData[i].AvgUtil/(this.EMEAR_RC_D/this.EMEAR_Count_D)).toFixed(2);
          }else if(this.ResUtilData[i].ProjectLevel != "Global" && this.ResUtilData[i].ProjectLevel != "Regional" && this.ResUtilData[i].Level != "Digital"){
            this.ResUtilData[i].RelativeCapacity = (this.ResUtilData[i].AvgUtil/(this.LOCAL_RC/this.Local_Count)).toFixed(2);
          }else if(this.ResUtilData[i].ProjectLevel != "Global" && this.ResUtilData[i].ProjectLevel != "Regional" && this.ResUtilData[i].Level == "Digital"){
            this.ResUtilData[i].RelativeCapacity = (this.ResUtilData[i].AvgUtil/(this.LOCAL_RC_D/this.Local_Count_D)).toFixed(2);
          }else{
            this.ResUtilData[i].RelativeCapacity = 0;
          }
          if(this.ResUtilData[i].RelativeCapacity == 0){
            this.ResUtilData[i].RCColor = "white";
          }else if(this.ResUtilData[i].RelativeCapacity > 1.2){
            this.ResUtilData[i].RCColor = "Red";
          }else if(this.ResUtilData[i].RelativeCapacity > 0 && this.ResUtilData[i].RelativeCapacity <0.8){
            this.ResUtilData[i].RCColor = "Yellow";
          }else if(this.ResUtilData[i].RelativeCapacity >= 0.8 && this.ResUtilData[i].RelativeCapacity <=1.2){
            this.ResUtilData[i].RCColor = "Green";
          }
        }
        this.dataSource = null;
        this.dataSource = new MatTableDataSource(this.ResUtilData);
        this.onFilterValueChange();
        this.FilteredCount = this.dataSource.filteredData.length;
        this.dashboard.ShowSpinnerHandler(false);
      }else{
        this.dataSource = null;
        this.dashboard.ShowSpinnerHandler(false);
      }
    });
  }
  checkUncheckProjectStatus(){
    if(this.masterProjectStatus == true){
      this.ProjectStatusFilter.setValue(this.ProjectStatusList);
    }else{
      this.ProjectStatusFilter.setValue("");
    }
    this.getSelectedProjectStatus();
  }
  onProjectStatuschange(){
    if(this.ProjectStatusList.length == this.ProjectStatusFilter.value.length){
      this.masterProjectStatus = true;
    }else{
      this.masterProjectStatus = false;
    }
    
    this.getSelectedProjectStatus();
  }
  SelectedStatus : string = "";
  getSelectedProjectStatus(){
    var count = 0;
    if(this.P_statuslists.length == this.ProjectStatusFilter.value.length){
      for(let i = 0;i< this.P_statuslists.length;i++){
        if(this.ProjectStatusFilter.value.includes(this.P_statuslists[i])){
          count++;
        }
      }
      if(this.P_statuslists.length == count){
        this.DisableButton = true;
      }else{
        this.DisableButton = false;
      }
    }else{
      this.DisableButton = false;
    }
    this.SelectedStatus = null;
    for(let i=0;i<this.ProjectStatusFilter.value.length;i++){
      if(this.SelectedStatus == null){
        if(this.ProjectStatusFilter.value[i] == null || this.ProjectStatusFilter.value[i] == ""){
          this.SelectedStatus = "";
        }else{
          this.SelectedStatus = this.ProjectStatusFilter.value[i];
        }
      }else{
        this.SelectedStatus += ","+this.ProjectStatusFilter.value[i];
      }
    }
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(TrackerCommentdailog, {
      // width: '400px',
      data: {
        Dailog_Comment: this.Dailog_Comment,
        Dailog_Client : this.Dailog_Client,
        Dailog_RevenueID : this.Dailog_RevenueID
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      //this.Comment = result;
      // this.GetData();
    });
  }
  Dailog_Comment : string;
  Dailog_RevenueID : string;
  Dailog_Client : string;
  OpenComment(HierarchyID : number,comment : string){
    let data: ResourceDialogData ={
      Dailog_ID: HierarchyID,
      Dailog_Comment : comment
    }
    const dialogRef = this.dialog.open(ResourceComment, {
      // width: '400px',
      data : data
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.SelectionType == "Update"){
        for(let i = 0;i<this.dataSource.data.length;i++){
          if(this.dataSource.data[i].HierarchyID == result.HierarchyID){
            if(result.Comments == null || result.Comments == undefined){
            }else{
              this.dataSource.data[i].Comments = result.Comments;
            }
            break;
          }
        }
      }
    });
  }
  ShowComment(Dailog_Client : string,Dailog_RevenueID : string,Dailog_Comment : string){
    this.Dailog_Client = Dailog_Client;
    this.Dailog_RevenueID = Dailog_RevenueID;
    if(this.Dailog_Client == "Relative Capacity"){
      this.Dailog_Comment = "Relative Capacity is the Average Utilization of the resource for next four weeks divided by Average utilization of all resources available in that pool."+'\n';
      this.Dailog_Comment += "(For Eg: Lets say 'John Doe' has a Avg. Utilization of 15 and is part of the 'Global' Pool consisting of 5 resources where other four Global Manager have Avg. Utilization of 6, 11, 14, 7. So Relative Capacity of 'John Doe would be 15 divided by 9.5 (average of 6, 11, 14, 7) = 1.57. What this tells us is that 'John Doe' has more projects than her capacity and leades needs to route her work to other available resoures)." + '\n' + '\n';
      this.Dailog_Comment += "Legend :" + '\n';
      this.Dailog_Comment += "========" + '\n';
      this.Dailog_Comment += "0.1 to 0.8 - Under utilized and can manage more projects" + '\n';
      this.Dailog_Comment += "0.8 to 1.2 - Optimally utilized" + '\n';
      this.Dailog_Comment += "1.2 and above - Over utilized and needs to direct projects to other resources";
    }else if(this.Dailog_Client == "Targeted Utilization"){
      this.Dailog_Comment = "Targeted Utilization is the minimum number of projects that a resource can handle in a month."+'\n'+'\n';
      this.Dailog_Comment += "Global PM's - 30" + '\n';
      this.Dailog_Comment += "Regional PM's - 20" + '\n';
      this.Dailog_Comment += "Local PM's - 5" + '\n' + '\n';
      this.Dailog_Comment += "Global Digital - 50" + '\n';
      this.Dailog_Comment += "Regional Digital - 35" + '\n';
      this.Dailog_Comment += "Local Digital - 25";
    }else if(this.Dailog_Client == "Capacity Available"){
      this.Dailog_Comment = "Capacity Available is Target Utilization minus Average Utilization of the resource for next four weeks."+'\n';
      this.Dailog_Comment += "(For Eg: 'Jane Doe' has Target Utilization of 30 as she is part of Global Project Manager pool and her Avg. Utilization is 20. S0 30-20 would be 10. What this tells us is that 'Jane Doe' has a capacity of taking additional 10 projects to meet her threshold of 30).";
    }else if(this.Dailog_Client == "Targeted Utilization (Considering Working Days of Resource)"){
      this.Dailog_Comment = "Its same as Targeted Utilization but taking into consideration - the working days of the resource"+'\n';
    }else if(this.Dailog_Client == "Capacity Available (Considering Working Days of Resource)"){
      this.Dailog_Comment = "Its same as Capacity Available but taking into consideration - the working days of the resource"+'\n';
    }else if(this.Dailog_Client == "Average Utilization for Next 4 Weeks"){
      this.Dailog_Comment = "This is the average capacity of how many projects a resource is handing for upcoming 4 weeks."+'\n'+'\n';
      this.Dailog_Comment += "For Eg :"+'\n';
      this.Dailog_Comment += "========"+'\n';
      this.Dailog_Comment += "'John Doe' is handling 24, 16, 20, 24 projects for each upcoming week. The average project at a time for next month would be 24+16+20+24 divided by 4 which equals to 21.";
    }else{
      this.Dailog_Comment = Dailog_Comment;
    }
    this.openDialog();
  }
  exportResUtil(){
    const CustomizedData = this.dataSource.filteredData.map(o => {
      return {
        'Region' : o.Region,
        'Project Level' : o.ProjectLevel,
        'Leader' : o.Leader,
        'Manager' : o.Manager,
        'Manager Level' : o.Level,
        'Working Days' : o.WorkingDays,
        'Comments' : o.Comments,
        'Relative Capacity' : o.RelativeCapacity,
        'Targeted Utilization' : o.TargetedUtilization,
        'Capacity Available' : o.CapacityAvailable,
        'Targeted Utilization Working Days' : o.TUWorkingDays,
        'Capacity Available Targeted Utilization for Working Days' : o.CapacityAvailableTUWorkingDays,
        'Average of First 4 Weeks' : o.AvgUtil,
        [this.C1stweek] : o.C1stweek,
        [this.C2ndweek] : o.C2ndweek,
        [this.C3rdweek] : o.C3rdweek,
        [this.C4thweek] : o.C4thweek,
        [this.C5thweek] : o.C5thweek,
        [this.C6thweek] : o.C6thweek,
        [this.C7thweek] : o.C7thweek,
        [this.C8thweek] : o.C8thweek,
        [this.C9thweek] : o.C9thweek,
        [this.C10thweek] : o.C10thweek,
        [this.C11thweek] : o.C11thweek,
        [this.C12thweek] : o.C12thweek,
        [this.c13thweek] : o.c13thweek,
        [this.c14thweek] : o.c14thweek,
        [this.c15thweek] : o.c15thweek,
        [this.c16thweek] : o.c16thweek,
        [this.c17thweek] : o.c17thweek,
        [this.c18thweek] : o.c18thweek,
        [this.c19thweek] : o.c19thweek,
        [this.c20thweek] : o.c20thweek,
        [this.c21thweek] : o.c21thweek,
        [this.c22thweek] : o.c22thweek,
        [this.c23thweek] : o.c23thweek,
        [this.c24thweek] : o.c24thweek,
      };
    });
    this.excelservice.exportAsExcelFile(CustomizedData, 'ResourceUtilization');
  }
  // checkUncheckLevel(){
  //   if(this.masterlevel == true){
  //     this.SelectedLevel = null;
  //     this.SelectedLevel = this.LevelList.map(
  //       data => data.Level
  //     );
  //   }else{
  //     this.SelectedLevel = null;
  //   }
  // }
  // checkUncheckRegion(){
  //   if(this.masterregion == true){
  //     this.SelectedRegion = null;
  //     this.SelectedRegion = this.RegionList.map(
  //       data => data.Region
  //     );
  //   }else{
  //     this.SelectedRegion = null;
  //   }
  // }
  // checkUncheckLeader(){
  //   if(this.masterleader == true){
  //     this.SelectedLeader = null;
  //     this.SelectedLeader = this.LeaderList.map(
  //       data => data.Leader
  //     );
  //   }else{
  //     this.SelectedLeader = null;
  //   }
  // }
  // checkUncheckshedule(){
  //   if(this.mastershedule == true){
  //     this.SelectedShedule = null;
  //     this.SelectedShedule = this.WorkSheduleList.map(
  //       data => data.WorkShedule
  //     );
  //   }else{
  //     this.SelectedShedule = null;
  //   }
  // }
  // checkUncheckworkdays(){
  //   if(this.masterdays == true){
  //     this.Selecteddays = null;
  //     this.Selecteddays = this.WorkingDaysList.map(
  //       data => data.WorkingDays
  //     );
  //   }else{
  //     this.Selecteddays = null;
  //   }
  // }
}

@Component({
  selector: 'app-resource-comment',
  templateUrl: './resource-comment.component.html',
  styleUrls: ['./resource-comment.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ResourceComment {
  constructor(
    public datepipe : DatePipe,
    public service : DashboardServiceService,
    public dialogRef: MatDialogRef<ResourceComment>,
    @Inject(MAT_DIALOG_DATA) public data: ResourceDialogData) {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      window.onresize = () => {
        // set screenWidth on screen size change
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
      };
      this.HierarchyID = data.Dailog_ID;
      this.Comments = data.Dailog_Comment;
    }
    screenWidth
    screenHeight
    HierarchyID;
    Comments;
    Comment;
    DisableButton : boolean = true;
  @ViewChild(MatSort) sort: MatSort;
  OnCloseClick(): void {
    this.dialogRef.close({SelectionType : 'Cancel'});
  }
  ngOnInit(){
    this.Comment = this.Comments;
  }
  onCommentChanged(){
    if(this.Comments == this.Comment){
      this.DisableButton = true;
    }else{
      this.DisableButton = false;
    }
  }
  UpdateComment(){
    if(this.DisableButton == false){
      this.service.UpdateHierarchyComment(this.HierarchyID,this.Comments).subscribe(data =>{
        if(data.code == 200){
          this.dialogRef.close({SelectionType : 'Update',HierarchyID : this.HierarchyID,Comments : this.Comments});
        }else{
          alert(data.message)
        }
      })
    }
  }
}