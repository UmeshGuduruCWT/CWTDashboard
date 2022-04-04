import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DashboardServiceService } from '../../dashboard-service.service';
import { Year, ProjectLevel, Region, MilestoneStatus } from '../../Models/Filters';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FormControl } from '@angular/forms';
import { CM_Year, CM_ProjectLevel, CM_Region, CM_ProjectStatus, CM_Quarter } from '../../Models/CMFilters';
import { ExcelService } from '../../excel.service';
@Component({
  selector: 'app-capacity-management',
  templateUrl: './capacity-management.component.html',
  styleUrls: ['./capacity-management.component.css']
})
export class CapacityManagementComponent implements OnInit {
  // displayedColumns_CBYC : any[] = ['Client', 'iMeet_Milestone___Project_Status','May1st','May2nd','May3rd','May4th','June1st','June2nd','June3rd','June4th','July1st','July2nd','July3rd','July4th','July5th','August1st','August2nd','August3rd','August4th','September1st','September2nd','September3rd','September4th','September5th','October1st','October2nd','October3rd','October4th','Novomber1st','November2nd','November3rd','November4th','December1st','December2nd','December3rd','December4th','December5th'];
  // displayedColumns_CBYR : any[] = ['Region__Opportunity_','Client', 'iMeet_Milestone___Project_Status','May1st','May2nd','May3rd','May4th','June1st','June2nd','June3rd','June4th','July1st','July2nd','July3rd','July4th','July5th','August1st','August2nd','August3rd','August4th','September1st','September2nd','September3rd','September4th','September5th','October1st','October2nd','October3rd','October4th','Novomber1st','November2nd','November3rd','November4th','December1st','December2nd','December3rd','December4th','December5th'];
  // displayedColumns_CBYGPL : any[] = ['Global_PL_Leader','Client', 'iMeet_Milestone___Project_Status','May1st','May2nd','May3rd','May4th','June1st','June2nd','June3rd','June4th','July1st','July2nd','July3rd','July4th','July5th','August1st','August2nd','August3rd','August4th','September1st','September2nd','September3rd','September4th','September5th','October1st','October2nd','October3rd','October4th','Novomber1st','November2nd','November3rd','November4th','December1st','December2nd','December3rd','December4th','December5th'];
  // displayedColumns_CBYRPL : any[] = ['Regional_PL_Leader','Client', 'iMeet_Milestone___Project_Status','May1st','May2nd','May3rd','May4th','June1st','June2nd','June3rd','June4th','July1st','July2nd','July3rd','July4th','July5th','August1st','August2nd','August3rd','August4th','September1st','September2nd','September3rd','September4th','September5th','October1st','October2nd','October3rd','October4th','Novomber1st','November2nd','November3rd','November4th','December1st','December2nd','December3rd','December4th','December5th'];
  // displayedColumns_CBYLPL : any[] = ['Local_PL_Leader','Client', 'iMeet_Milestone___Project_Status','May1st','May2nd','May3rd','May4th','June1st','June2nd','June3rd','June4th','July1st','July2nd','July3rd','July4th','July5th','August1st','August2nd','August3rd','August4th','September1st','September2nd','September3rd','September4th','September5th','October1st','October2nd','October3rd','October4th','Novomber1st','November2nd','November3rd','November4th','December1st','December2nd','December3rd','December4th','December5th'];
  displayedColumns_CBYC : any[] = ['Client', 'iMeet_Milestone___Project_Status','Jan1st20','Jan2nd20','Jan3rd20','Jan4th20','Feb1st20','Feb2nd20','Feb3rd20','Feb4th20','Mar1st20','Mar2nd20','Mar3rd20','Mar4th20','Mar5th20']
  displayedColumns_CBYR : any[] = ['Region__Opportunity_','Client', 'iMeet_Milestone___Project_Status','Jan1st20','Jan2nd20','Jan3rd20','Jan4th20','Feb1st20','Feb2nd20','Feb3rd20','Feb4th20','Mar1st20','Mar2nd20','Mar3rd20','Mar4th20','Mar5th20'];
  displayedColumns_CBYGPL : any[] = ['Global_PL_Leader','Client', 'iMeet_Milestone___Project_Status','Jan1st20','Jan2nd20','Jan3rd20','Jan4th20','Feb1st20','Feb2nd20','Feb3rd20','Feb4th20','Mar1st20','Mar2nd20','Mar3rd20','Mar4th20','Mar5th20']
  displayedColumns_CBYRPL : any[] = ['Regional_PL_Leader','Client', 'iMeet_Milestone___Project_Status','Jan1st20','Jan2nd20','Jan3rd20','Jan4th20','Feb1st20','Feb2nd20','Feb3rd20','Feb4th20','Mar1st20','Mar2nd20','Mar3rd20','Mar4th20','Mar5th20']
  displayedColumns_CBYLPL : any[] = ['Local_PL_Leader','Client', 'iMeet_Milestone___Project_Status','Jan1st20','Jan2nd20','Jan3rd20','Jan4th20','Feb1st20','Feb2nd20','Feb3rd20','Feb4th20','Mar1st20','Mar2nd20','Mar3rd20','Mar4th20','Mar5th20']
  dataSource_CBYC;
  dataSource_CBYR;
  dataSource_CBYGPL;
  dataSource_CBYRPL;
  dataSource_CBYLPL;
  background : 'green';
  CurrentYear;
  Apply_disable : boolean;
  screenWidth : number;screenHeight  : number;
  SumofMay1st;SumofMay2nd;SumofMay3rd;SumofMay4th;
  SumofJune1st;SumofJune2nd;SumofJune3rd;SumofJune4th;
  SumofJuly1st;SumofJuly2nd;SumofJuly3rd;SumofJuly4th;SumofJuly5th;
  SumofAugust1st;SumofAugust2nd;SumofAugust3rd;SumofAugust4th;
  SumofSeptember1st;SumofSeptember2nd;SumofSeptember3rd;SumofSeptember4th;SumofSeptember5th;
  SumofOctober1st;SumofOctober2nd;SumofOctober3rd;SumofOctober4th;
  SumofNovomber1st;SumofNovember2nd;SumofNovember3rd;SumofNovember4th;
  SumofDecember1st;SumofDecember2nd;SumofDecember3rd;SumofDecember4th;SumofDecember5th;
  SumofJan1st;SumofJan2nd;SumofJan3rd;SumofJan4th;SumofFeb1st;SumofFeb2nd;SumofFeb3rd;SumofFeb4th;SumofMar1st;SumofMar2nd;SumofMar3rd;SumofMar4th;SumofMar5th;
  SumofApr1st;SumofApr2nd;SumofApr3rd;SumofApr4th;SumofMay1st20;SumofJun1st;SumofJun2nd;SumofJun3rd;SumofJun4th;SumofJun5th;
  SumofJul1st;SumofJul2nd;SumofJul3rd;SumofJul4th;SumofAug1st;SumofAug2nd;SumofAug3rd;SumofAug4th;SumofAug5th;SumofSep1st;SumofSep2nd;SumofSep3rd;SumofSep4th;
  SumofOct1st;SumofOct2nd;SumofOct3rd;SumofOct4th;SumofNov1st;SumofNov2nd;SumofNov3rd;SumofNov4th;SumofNov5th;SumofDec1st;SumofDec2nd;SumofDec3rd;SumofDec4th;
  SelectedYears : any;SelectedLevels : any;SelectedRegions : any;SelectedMilestonestatus : any;SelectedQuarter : any;
  yearList : CM_Year[];levelList : CM_ProjectLevel[]; regionList : CM_Region[]; MilestonestatusList : CM_ProjectStatus[];
  quarteList : CM_Quarter[];
  masteryear : boolean;masterquarter : boolean;masterlevel : boolean;masterregion : boolean;masterMilestonestatus : boolean;
  GlobalPL;RegionalPL;LocalPL;GlobalPM;RegionalPM;
  SelectedGlobalPL = [];SelectedRegionalPL =[];SelectedLocalPL=[];SelectedGlobalPM=[];SelectedRegionalPM=[];;
  GlobalPLSelected;RegionalPLSelected;LocalPLSelected;GlobalPMSelected;RegionalPMSelected;
  GlobalPLs = new FormControl();
  RegionalPLs = new FormControl();
  LocalPLs = new FormControl();
  GlobalPMs = new FormControl();
  RegionalPMs = new FormControl();
  constructor(public service : DashboardServiceService,public dashboard : DashboardComponent,public excelService : ExcelService) {
    // set screenWidth on page load
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    window.onresize = () => {
      // set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    };
  }
  ngOnInit() {
    this.dashboard.ShowSpinnerHandler(true);
    this.service.CapacityFiltersList().subscribe(data =>{
      this.yearList = data.Years;
      this.masteryear = false;
      this.CurrentYear = (new Date()).getFullYear();
      for (var i = 0; i < this.yearList.length; i++) {
        if(this.yearList[i].Go_Live_Year == this.CurrentYear){
          this.yearList[i].isSelected = true;
        }else{
          this.yearList[i].isSelected = false;
        }
      }
      this.getSelectedYear();
      this.quarteList = data.Quarter;
      this.masterquarter = false;
      for (var i = 0; i < this.quarteList.length; i++) {
        if(this.quarteList[i].Quarter == 'Qtr 1'){
          this.quarteList[i].isSelected = true;
        }else{
          this.quarteList[i].isSelected = false;
        }
      }
      this.getSelectedQuarter();
      this.GlobalPL = data.GlobalPL;
      this.SelectedGlobalPL = [];
      this.GlobalPL.forEach( item =>{
        this.SelectedGlobalPL.push(item.Global_PL_Leader);
      })
      this.RegionalPL = data.RegionalPL;
      this.SelectedRegionalPL = [];
      this.RegionalPL.forEach( item =>{
        this.SelectedRegionalPL.push(item.Regional_PL_Leader);
      })
      this.LocalPL = data.LocalPL;
      this.SelectedLocalPL = [];
      this.LocalPL.forEach( item =>{
        this.SelectedLocalPL.push(item.Local_PL_Leader);
      })
      this.GlobalPM = data.GlobalPM;
      this.SelectedGlobalPM = [];
      this.GlobalPM.forEach( item =>{
        this.SelectedGlobalPM.push(item.Global_Project_Manager);
      })
      this.RegionalPM = data.RegionalPM;
      this.SelectedRegionalPM = [];
      this.RegionalPM.forEach( item =>{
        this.SelectedRegionalPM.push(item.Regional_Project_Manager);
      })
      this.levelList = data.ProjectLevel;
      this.masterlevel = true;
      this.getSelectedLevels();
      this.regionList = data.Region;
      this.masterregion = true;
      this.getSelectedRegion();
      this.MilestonestatusList = data.ProjectStatus;
      this.masterMilestonestatus = false;
      for (var i = 0; i < this.MilestonestatusList.length; i++) {
        if(this.MilestonestatusList[i].iMeet_Milestone___Project_Status == "A-Active/Date Confirmed" || this.MilestonestatusList[i].iMeet_Milestone___Project_Status == "N-Active/No Date Confirmed"){
          this.MilestonestatusList[i].isSelected = true;
        }else{
          this.MilestonestatusList[i].isSelected = false;
        }
      }
      this.getSelectedMilestoneStatus();
      this.GetAlldata();
    });
    this.Apply_disable = true;
  }
  FiltersSelected(){
    this.GlobalPLSelected = null;
    this.RegionalPLSelected = null;
    this.LocalPLSelected = null;
    this.GlobalPMSelected = null;
    this.RegionalPMSelected = null;
    for(let i = 0; i< this.SelectedGlobalPL.length;i++){
      if(this.GlobalPLSelected == null){
        if(this.SelectedGlobalPL[i] == null){
          this.GlobalPLSelected = "null";
        }else{
          this.GlobalPLSelected = this.SelectedGlobalPL[i];
        }
      }else{
        this.GlobalPLSelected += ","+this.SelectedGlobalPL[i];
      }
    }
    for(let i = 0; i< this.SelectedRegionalPL.length;i++){
      if(this.RegionalPLSelected == null){
        if(this.SelectedRegionalPL[i] == null){
          this.RegionalPLSelected = "null";
        }else{
          this.RegionalPLSelected = this.SelectedRegionalPL[i];
        }
      }else{
        this.RegionalPLSelected += ","+this.SelectedRegionalPL[i];
      }
    }
    for(let i = 0; i< this.SelectedLocalPL.length;i++){
      if(this.LocalPLSelected == null){
        if(this.SelectedLocalPL[i] == null){
          this.LocalPLSelected = "null";
        }else{
          this.LocalPLSelected = this.SelectedLocalPL[i];
        }
      }else{
        this.LocalPLSelected += ","+this.SelectedLocalPL[i];
      }
    }
    for(let i = 0; i< this.SelectedGlobalPM.length;i++){
      if(this.GlobalPMSelected == null){
        if(this.SelectedGlobalPM[i] == null){
          this.GlobalPMSelected = "null";
        }else{
          this.GlobalPMSelected = this.SelectedGlobalPM[i];
        }
      }else{
        this.GlobalPMSelected += ","+this.SelectedGlobalPM[i];
      }
    }
    for(let i = 0; i< this.SelectedGlobalPM.length;i++){
      if(this.RegionalPMSelected == null){
        if(this.SelectedGlobalPM[i] == null){
          this.RegionalPMSelected = "null";
        }else{
          this.RegionalPMSelected = this.SelectedGlobalPM[i];
        }
      }else{
        this.RegionalPMSelected += ","+this.SelectedGlobalPM[i];
      }
    }
  }
  GetAlldata(){
    var main1 = ['Client','iMeet_Milestone___Project_Status']
    var main2 = ['Region__Opportunity_','Client','iMeet_Milestone___Project_Status']
    var main3 = ['Global_PL_Leader','Client','iMeet_Milestone___Project_Status']
    var main4 = ['Regional_PL_Leader','Client','iMeet_Milestone___Project_Status']
    var main5 = ['Local_PL_Leader','Client','iMeet_Milestone___Project_Status']
    this.displayedColumns_CBYC = ['Client','iMeet_Milestone___Project_Status']
    this.displayedColumns_CBYR = ['Region__Opportunity_','Client','iMeet_Milestone___Project_Status']
    this.displayedColumns_CBYGPL = ['Global_PL_Leader','Client','iMeet_Milestone___Project_Status']
    this.displayedColumns_CBYRPL = ['Regional_PL_Leader','Client','iMeet_Milestone___Project_Status']
    this.displayedColumns_CBYLPL = ['Local_PL_Leader','Client','iMeet_Milestone___Project_Status']
    var qtr1 = ['Jan1st20','Jan2nd20','Jan3rd20','Jan4th20','Feb1st20','Feb2nd20','Feb3rd20','Feb4th20','Mar1st20','Mar2nd20','Mar3rd20','Mar4th20','Mar5th20'];
    var qtr2 = ['Apr1st20','Apr2nd20','Apr3rd20','Apr4th20','May1st20','May2nd20','May3rd20','May4th20','Jun1st20','Jun2nd20','Jun3rd20','Jun4th20','Jun5th20'];
    var qtr3 = ['Jul1st20','Jul2nd20','Jul3rd20','Jul4th20','Aug1st20','Aug2nd20','Aug3rd20','Aug4th20','Aug5th20','Sep1st20','Sep2nd20','Sep3rd20','Sep4th20'];
    var qtr4 = ['Oct1st20','Oct2nd20','Oct3rd20','Oct4th20','Nov1st20','Nov2nd20','Nov3rd20','Nov4th20','Nov5th20','Dec1st20','Dec2nd20','Dec3rd20','Dec4th20'];
    if(this.SelectedQuarter.includes("Qtr 1")){
      this.displayedColumns_CBYC = main1.concat(qtr1);
      this.displayedColumns_CBYR = main2.concat(qtr1);
      this.displayedColumns_CBYGPL = main3.concat(qtr1);
      this.displayedColumns_CBYRPL = main4.concat(qtr1);
      this.displayedColumns_CBYLPL = main5.concat(qtr1);
    }
    if(this.SelectedQuarter.includes("Qtr 2")){
      this.displayedColumns_CBYC = this.displayedColumns_CBYC.concat(qtr2);
      this.displayedColumns_CBYR = this.displayedColumns_CBYR.concat(qtr2);
      this.displayedColumns_CBYGPL = this.displayedColumns_CBYGPL.concat(qtr2);
      this.displayedColumns_CBYRPL = this.displayedColumns_CBYRPL.concat(qtr2);
      this.displayedColumns_CBYLPL = this.displayedColumns_CBYLPL.concat(qtr2);
    }
    if(this.SelectedQuarter.includes("Qtr 3")){
      this.displayedColumns_CBYC = this.displayedColumns_CBYC.concat(qtr3);
      this.displayedColumns_CBYR = this.displayedColumns_CBYR.concat(qtr3);
      this.displayedColumns_CBYGPL = this.displayedColumns_CBYGPL.concat(qtr3);
      this.displayedColumns_CBYRPL = this.displayedColumns_CBYRPL.concat(qtr3);
      this.displayedColumns_CBYLPL = this.displayedColumns_CBYLPL.concat(qtr3);
    }
    if(this.SelectedQuarter.includes("Qtr 4")){
      this.displayedColumns_CBYC = this.displayedColumns_CBYC.concat(qtr4);
      this.displayedColumns_CBYR = this.displayedColumns_CBYR.concat(qtr4);
      this.displayedColumns_CBYGPL = this.displayedColumns_CBYGPL.concat(qtr4);
      this.displayedColumns_CBYRPL = this.displayedColumns_CBYRPL.concat(qtr4);
      this.displayedColumns_CBYLPL = this.displayedColumns_CBYLPL.concat(qtr4);
    }
    this.FiltersSelected();
    this.dashboard.ShowSpinnerHandler(true);
    this.service.CapacityByClient(this.SelectedMilestonestatus,this.SelectedLevels,this.SelectedRegions,this.SelectedYears,this.GlobalPLSelected,this.RegionalPLSelected,this.LocalPLSelected,this.GlobalPMSelected,this.RegionalPMSelected).subscribe(data => {
      this.dataSource_CBYC = data.Data;
      this.SumofJan1st = data.Data.map(t => t.Jan1st20).reduce((acc, value) => acc + value,0);
      this.SumofJan2nd = data.Data.map(t => t.Jan2nd20).reduce((acc, value) => acc + value,0);
      this.SumofJan3rd = data.Data.map(t => t.Jan3rd20).reduce((acc, value) => acc + value,0);
      this.SumofJan4th = data.Data.map(t => t.Jan4th20).reduce((acc, value) => acc + value,0);
      this.SumofFeb1st = data.Data.map(t => t.Feb1st20).reduce((acc, value) => acc + value,0);
      this.SumofFeb2nd = data.Data.map(t => t.Feb2nd20).reduce((acc, value) => acc + value,0);
      this.SumofFeb3rd = data.Data.map(t => t.Feb3rd20).reduce((acc, value) => acc + value,0);
      this.SumofFeb4th = data.Data.map(t => t.Feb4th20).reduce((acc, value) => acc + value,0);
      this.SumofMar1st = data.Data.map(t => t.Mar1st20).reduce((acc, value) => acc + value,0);
      this.SumofMar2nd = data.Data.map(t => t.Mar2nd20).reduce((acc, value) => acc + value,0);
      this.SumofMar3rd = data.Data.map(t => t.Mar3rd20).reduce((acc, value) => acc + value,0);
      this.SumofMar4th = data.Data.map(t => t.Mar4th20).reduce((acc, value) => acc + value,0);
      this.SumofMar5th = data.Data.map(t => t.Mar5th20).reduce((acc, value) => acc + value,0);
      // this.SumofMay1st = data.Data.map(t => t.May1st).reduce((acc, value) => acc + value,0);
      // this.SumofMay2nd = data.Data.map(t => t.May2nd).reduce((acc, value) => acc + value,0);
      // this.SumofMay3rd = data.Data.map(t => t.May3rd).reduce((acc, value) => acc + value,0);
      // this.SumofMay4th = data.Data.map(t => t.May4th).reduce((acc, value) => acc + value,0);
      // this.SumofJune1st = data.Data.map(t => t.June1st).reduce((acc, value) => acc + value,0);
      // this.SumofJune2nd = data.Data.map(t => t.June2nd).reduce((acc, value) => acc + value,0);
      // this.SumofJune3rd = data.Data.map(t => t.June3rd).reduce((acc, value) => acc + value,0);
      // this.SumofJune4th = data.Data.map(t => t.June4th).reduce((acc, value) => acc + value,0);
      // this.SumofJuly1st = data.Data.map(t => t.July1st).reduce((acc, value) => acc + value,0);
      // this.SumofJuly2nd = data.Data.map(t => t.July2nd).reduce((acc, value) => acc + value,0);
      // this.SumofJuly3rd = data.Data.map(t => t.July3rd).reduce((acc, value) => acc + value,0);
      // this.SumofJuly4th = data.Data.map(t => t.July4th).reduce((acc, value) => acc + value,0);
      // this.SumofJuly5th = data.Data.map(t => t.July5th).reduce((acc, value) => acc + value,0);
      // this.SumofAugust1st = data.Data.map(t => t.August1st).reduce((acc, value) => acc + value,0);
      // this.SumofAugust2nd = data.Data.map(t => t.August2nd).reduce((acc, value) => acc + value,0);
      // this.SumofAugust3rd = data.Data.map(t => t.August3rd).reduce((acc, value) => acc + value,0);
      // this.SumofAugust4th = data.Data.map(t => t.August4th).reduce((acc, value) => acc + value,0);
      // this.SumofSeptember1st = data.Data.map(t => t.September1st).reduce((acc, value) => acc + value,0);
      // this.SumofSeptember2nd = data.Data.map(t => t.September2nd).reduce((acc, value) => acc + value,0);
      // this.SumofSeptember3rd = data.Data.map(t => t.September3rd).reduce((acc, value) => acc + value,0);
      // this.SumofSeptember4th = data.Data.map(t => t.September4th).reduce((acc, value) => acc + value,0);
      // this.SumofSeptember5th = data.Data.map(t => t.September5th).reduce((acc, value) => acc + value,0);
      // this.SumofOctober1st = data.Data.map(t => t.October1st).reduce((acc, value) => acc + value,0);
      // this.SumofOctober2nd = data.Data.map(t => t.October2nd).reduce((acc, value) => acc + value,0);
      // this.SumofOctober3rd = data.Data.map(t => t.October3rd).reduce((acc, value) => acc + value,0);
      // this.SumofOctober4th = data.Data.map(t => t.October4th).reduce((acc, value) => acc + value,0);
      // this.SumofNovomber1st = data.Data.map(t => t.Novomber1st).reduce((acc, value) => acc + value,0);
      // this.SumofNovember2nd = data.Data.map(t => t.November2nd).reduce((acc, value) => acc + value,0);
      // this.SumofNovember3rd = data.Data.map(t => t.November3rd).reduce((acc, value) => acc + value,0);
      // this.SumofNovember4th = data.Data.map(t => t.November4th).reduce((acc, value) => acc + value,0);
      // this.SumofDecember1st = data.Data.map(t => t.December1st).reduce((acc, value) => acc + value,0);
      // this.SumofDecember2nd = data.Data.map(t => t.December2nd).reduce((acc, value) => acc + value,0);
      // this.SumofDecember3rd = data.Data.map(t => t.December3rd).reduce((acc, value) => acc + value,0);
      // this.SumofDecember4th = data.Data.map(t => t.December4th).reduce((acc, value) => acc + value,0);
      // this.SumofDecember5th = data.Data.map(t => t.December5th).reduce((acc, value) => acc + value,0);
      this.dataSource_CBYR = data.Data;
      this.dataSource_CBYGPL = data.Data;
      this.dataSource_CBYRPL = data.Data;
      this.dataSource_CBYLPL = data.Data;
      console.log(data.Data);
      this.dashboard.ShowSpinnerHandler(false);
    });
    // this.dashboard.ShowSpinnerHandler(true);
    // this.service.CapacityByRegion(this.SelectedMilestonestatus,this.SelectedLevels,this.SelectedRegions,this.SelectedYears,"").subscribe(data => {
    //   this.dataSource_CBYR = data.Data;
    //   this.dashboard.ShowSpinnerHandler(false);
    // });
    // this.dashboard.ShowSpinnerHandler(true);
    // this.service.CapacityByGlobalPL(this.SelectedMilestonestatus,this.SelectedLevels,this.SelectedRegions,this.SelectedYears,"").subscribe(data => {
    //   this.dataSource_CBYGPL = data.Data;
    //   this.dashboard.ShowSpinnerHandler(false);
    // });
    // this.dashboard.ShowSpinnerHandler(true);
    // this.service.CapacityByRegionalPL(this.SelectedMilestonestatus,this.SelectedLevels,this.SelectedRegions,this.SelectedYears,"").subscribe(data => {
    //   this.dataSource_CBYRPL = data.Data;
    //   this.dashboard.ShowSpinnerHandler(false);
    // });
    // this.dashboard.ShowSpinnerHandler(true);
    // this.service.CapacityByLocalPL(this.SelectedMilestonestatus,this.SelectedLevels,this.SelectedRegions,this.SelectedYears,"").subscribe(data => {
    //   this.dataSource_CBYLPL = data.Data;
    //   this.dashboard.ShowSpinnerHandler(false);
    // });
    this.Apply_disable = true;
  }
  exportAsXLSXNM(){
    this.dashboard.ShowSpinnerHandler(true);
    this.service.CapacityByClient(this.SelectedMilestonestatus,this.SelectedLevels,this.SelectedRegions,this.SelectedYears,this.GlobalPLSelected,this.RegionalPLSelected,this.LocalPLSelected,this.GlobalPMSelected,this.RegionalPMSelected).subscribe(data => {
      if(data.code == 200){
        this.excelService.exportAsExcelFile(data.Data, 'Capacity Management');
      }else{
        alert("Something Went wrong, Please Try again later");
      }
      this.dashboard.ShowSpinnerHandler(false);
    });
  }
  //Start of Year Methods
  checkUncheckYears() {
    for (var i = 0; i < this.yearList.length; i++) {
      this.yearList[i].isSelected = this.masteryear;
    }
    this.getSelectedYear();
  }
  yearsSelected() {
    this.masteryear = this.yearList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedYear();
  }
  getSelectedYear(){
    this.Apply_disable = false;
    this.SelectedYears = null;
    for(let i=0;i<this.yearList.length;i++){
      if(this.yearList[i].isSelected == true){
        if(this.SelectedYears == null){
          if(this.yearList[i].Go_Live_Year == "")
          {
            this.SelectedYears = ","+this.yearList[i].Go_Live_Year;
          }else{
            this.SelectedYears = this.yearList[i].Go_Live_Year;
          }
        }else{
          this.SelectedYears += ","+this.yearList[i].Go_Live_Year;
        }
      }else{
      }
    }
  }
  //End of Year Methods
  //Start of Year Methods
  checkUncheckQuarters() {
    for (var i = 0; i < this.quarteList.length; i++) {
      this.quarteList[i].isSelected = this.masterquarter;
    }
    this.getSelectedQuarter();
  }
  QuartersSelected() {
    this.masterquarter = this.quarteList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedQuarter();
  }
  getSelectedQuarter(){
    this.Apply_disable = false;
    this.SelectedQuarter = null;
    for(let i=0;i<this.quarteList.length;i++){
      if(this.quarteList[i].isSelected == true){
        if(this.SelectedQuarter == null){
          if(this.quarteList[i].Quarter == "")
          {
            this.SelectedQuarter = ","+this.quarteList[i].Quarter;
          }else{
            this.SelectedQuarter = this.quarteList[i].Quarter;
          }
        }else{
          this.SelectedQuarter += ","+this.quarteList[i].Quarter;
        }
      }else{
      }
    }
  }
  //End of Year Methods
  //Start of Project levels Methods
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
    this.SelectedLevels = null;
    for(let i=0;i<this.levelList.length;i++){
      if(this.levelList[i].isSelected == true){
        if(this.SelectedLevels == null){
          if(this.levelList[i].iMeet_Project_Level == "")
          {
            this.SelectedLevels = ","+this.levelList[i].iMeet_Project_Level;
          }else{
            this.SelectedLevels = this.levelList[i].iMeet_Project_Level;
          }
        }else{
          this.SelectedLevels += ","+this.levelList[i].iMeet_Project_Level;
        }
      }else{
      }
    }
  }
  //End of Project levels Methods
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
          if(this.regionList[i].Region__Opportunity_ == "")
          {
            this.SelectedRegions = ","+this.regionList[i].Region__Opportunity_;
          }else{
            this.SelectedRegions = this.regionList[i].Region__Opportunity_;
          }
        }else{
          this.SelectedRegions += ","+this.regionList[i].Region__Opportunity_;
        }
      }else{
      }
    }
  }
  //End of Region Methods
  //Start of MilestoneStatus Methods
  checkUncheckMilestoneStatus() {
    for (var i = 0; i < this.MilestonestatusList.length; i++) {
      this.MilestonestatusList[i].isSelected = this.masterMilestonestatus;
    }
    this.getSelectedMilestoneStatus();
  }
  MilestoneStatusSelected() {
    this.masterMilestonestatus = this.MilestonestatusList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedMilestoneStatus();
  }
  getSelectedMilestoneStatus(){
    this.Apply_disable = false;
    this.SelectedMilestonestatus = null;
    for(let i=0;i<this.MilestonestatusList.length;i++){
      if(this.MilestonestatusList[i].isSelected == true){
        if(this.SelectedMilestonestatus == null){
          if(this.MilestonestatusList[i].iMeet_Milestone___Project_Status == "")
          {
            this.SelectedMilestonestatus = ","+this.MilestonestatusList[i].iMeet_Milestone___Project_Status;
          }else{
            this.SelectedMilestonestatus = this.MilestonestatusList[i].iMeet_Milestone___Project_Status;
          }
        }else{
          this.SelectedMilestonestatus += ","+this.MilestonestatusList[i].iMeet_Milestone___Project_Status;
        }
      }else{
      }
    }
  }
  GlobalPLSelectedList(){
    this.GlobalPL.forEach( item =>{
      this.SelectedGlobalPL.push(item.Global_PL_Leader);
    })
  }
  GlobalPLChanged(){
    this.Apply_disable = false;
  }
  RegionalPLChanged(){
    this.Apply_disable = false;
  }
  LocalPLChanged(){
    this.Apply_disable = false;
  }
  GlobalPMChanged(){
    this.Apply_disable = false;
  }
  RegionalPMChanged(){
    this.Apply_disable = false;
  }
}