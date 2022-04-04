import { Component, OnInit } from '@angular/core';
import { DashboardServiceService } from '../../dashboard-service.service';
import { SeniorLeader } from '../../Models/PerformanceData';
import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FormControl } from '@angular/forms';
import { LivedashboardComponent } from '../livedashboard/livedashboard.component';
@Component({
  selector: 'app-performance-leader',
  templateUrl: './performance-leader.component.html',
  styleUrls: ['./performance-leader.component.css']
})
export class PerformanceLeaderComponent implements OnInit {
  SeniorLeaders;
  displayedColumns: string[] = ['Assigne','Innovation', 'Nps', 'CycleTime', 'Volume','ProjectCount'];
  displayedColumn : string[] = ['Assigne','AssigneInnovation', 'AssigneNPS', 'AssigneCycleTime', 'AssigneVolume_string','AssigneProjects'];
  Years = new FormControl();
  Quarters = new FormControl();
  Levels = new FormControl();
  Regions = new FormControl();
  Status = new FormControl();
  Years_F; Quarters_f; Levels_f; Regions_f; Status_f; Type_f;
  Yearslist = []; Quarteslist = []; Regionslist = []; Statuslist = []; Levelslist = [];
  masteryear;masterquarter;masterregion;masterlevel;masterstatus;
  SelectedYears; SelectedQuarters; SelectedRegions; SelectedStatus; SelectedType; SelectedLevel;
  constructor(public service : DashboardServiceService,public dashboard : LivedashboardComponent) { }
  ngOnInit() {
    this.dashboard.ShowSpinnerHandler(true);
    this.service.ImeetMilestoneFiltersList().subscribe(data =>{
      this.Years_F = data.Year;
      this.Yearslist = [];
      this.masteryear = false;
      for (var i = 0; i < this.Years_F.length; i++) {
        if(this.Years_F[i].Go_Live_Year == "2020"){
          this.Yearslist.push(this.Years_F[i].Go_Live_Year);
        }
      }
      this.onYearschange();
      this.Quarters_f = data.Quarter;
      this.Quarteslist = [];
      this.masterquarter = true;
      this.Quarters_f.forEach( item =>{
        this.Quarteslist.push(item.Quarter);
      })
      this.onQuarterchange();
      this.Levels_f = data.ProjectLevel;
      this.Levelslist = [];
      this.masterlevel = true;
      this.Levels_f.forEach( item =>{
        this.Levelslist.push(item.iMeet_Project_Level);
      })
      this.onLevelschange();
      this.Regions_f = data.Region;
      this.Regionslist = [];
      this.masterregion = true;
      this.Regions_f.forEach( item =>{
        this.Regionslist.push(item.Region__Opportunity_);
      })
      this.onRegionschange();
      this.Status_f = data.MilestoneStatus;
      this.Statuslist = [];
      this.masterstatus = false;
      for (var i = 0; i < this.Status_f.length; i++) {
        if(this.Status_f[i].iMeet_Milestone___Project_Status == "A-Active/Date Confirmed" || this.Status_f[i].iMeet_Milestone___Project_Status == "C-Closed"){
          this.Statuslist.push(this.Status_f[i].iMeet_Milestone___Project_Status);
        }
      }
      this.onStatuschange();
      this.dashboard.ShowSpinnerHandler(false);
      this.setdata();
    });    
  }
  setdata(){
    this.dashboard.ShowSpinnerHandler(true);
    this.service.PerformanceData(this.SelectedYears,this.SelectedQuarters,this.SelectedRegions,this.SelectedLevel,this.SelectedStatus).subscribe(data =>{
      this.SeniorLeaders = data.Data;
      for(let i= 0;i<data.Data.length;i++){
        if(this.SeniorLeaders[i].Volume == null){
          this.SeniorLeaders[i].Volume_string = "$0";
        }else{
          this.SeniorLeaders[i].Volume_string = Math.round(this.SeniorLeaders[i].Volume).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
        }
        for(let j = 0;j<data.Data[i].Leaders.length;j++){
          if(this.SeniorLeaders[i].Leaders[j].LeaderVolume == null){
            this.SeniorLeaders[i].Leaders[j].LeaderVolume_string = "$0";
          }else{
            this.SeniorLeaders[i].Leaders[j].LeaderVolume_string = Math.round(this.SeniorLeaders[i].Leaders[j].LeaderVolume).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
          }
          for(let k = 0;k<data.Data[i].Leaders[j].Assignees.length;k++){
            if(this.SeniorLeaders[i].Leaders[j].Assignees[k].AssigneVolume == null){
              this.SeniorLeaders[i].Leaders[j].Assignees[k].AssigneVolume_string = "$0";
            }else{
              this.SeniorLeaders[i].Leaders[j].Assignees[k].AssigneVolume_string = Math.round(this.SeniorLeaders[i].Leaders[j].Assignees[k].AssigneVolume).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
            }
          }
        }
      }
      this.dashboard.ShowSpinnerHandler(false);
    });
  }
  srleader_click(icon: boolean, sr_leader : string){
    for(let i =0 ; i<this.SeniorLeaders.length;i++){
      if(this.SeniorLeaders[i].SeniorLeader == sr_leader){
        this.SeniorLeaders[i].SeniorIcon = !this.SeniorLeaders[i].SeniorIcon;
      }
    }
    //console.log(icon,sr_leader);
  }
  leader_click(index : number,icon: boolean, leader : string){
    console.log(icon, leader, index);
    for(let i = 0 ; i<this.SeniorLeaders[index].Leaders.length;i++){
      if(this.SeniorLeaders[index].Leaders[i].Leader == leader){
        this.SeniorLeaders[index].Leaders[i].Leadericon = !this.SeniorLeaders[index].Leaders[i].Leadericon;
      }
    }
  }
  onYearschange(){
    if(this.Yearslist.length == this.Years_F.length){
      this.masteryear = true;
    }else{
      this.masteryear = false;
    }
    this.SelectedYears = null;
    for(let i=0;i<this.Yearslist.length;i++){
      if(i == 0){
        this.SelectedYears = this.Yearslist[i];
      }else{
        this.SelectedYears += ","+this.Yearslist[i];
      }
    }
  }
  onQuarterchange(){
    if(this.Quarteslist.length == this.Quarters_f.length){
      this.masterquarter = true;
    }else{
      this.masterquarter = false;
    }
    this.SelectedQuarters = null;
    for(let i=0;i<this.Quarteslist.length;i++){
      if(i == 0){
        this.SelectedQuarters = this.Quarteslist[i];
      }else{
        this.SelectedQuarters += ","+this.Quarteslist[i];
      }
    }
  }
  onLevelschange(){
    if(this.Levelslist.length == this.Levels_f.length){
      this.masterlevel = true;
    }else{
      this.masterlevel = false;
    }
    this.SelectedLevel = null;
    for(let i=0;i<this.Levelslist.length;i++){
      if(i == 0){
        this.SelectedLevel = this.Levelslist[i];
      }else{
        this.SelectedLevel += ","+this.Levelslist[i];
      }
    }
  }
  onRegionschange(){
    if(this.Regionslist.length == this.Regions_f.length){
      this.masterregion = true;
    }else{
      this.masterregion = false;
    }
    this.SelectedRegions = null;
    for(let i=0;i<this.Regionslist.length;i++){
      if(i == 0){
        this.SelectedRegions = this.Regionslist[i];
      }else{
        this.SelectedRegions += ","+this.Regionslist[i];
      }
    }
  }
  onStatuschange(){
    if(this.Statuslist.length == this.Status_f.length){
      this.masterstatus = true;
    }else{
      this.masterstatus = false;
    }
    this.SelectedStatus = null;
    for(let i=0;i<this.Statuslist.length;i++){
      if(i == 0){
        this.SelectedStatus = this.Statuslist[i];
      }else{
        this.SelectedStatus += ","+this.Statuslist[i];
      }
    }
  }
  checkUncheckYears(){
    if(this.masteryear == true){
      this.Yearslist = [];
      this.Years_F.forEach( item =>{
        this.Yearslist.push(item.Go_Live_Year);
      })
    }else{
      this.Yearslist = [];
    }
    this.onYearschange();
  }
  checkUncheckQuarter(){
    if(this.masterquarter == true){
      this.Quarteslist = [];
      this.Quarters_f.forEach( item =>{
        this.Quarteslist.push(item.Quarter);
      })
    }else{
      this.Quarteslist = [];
    }
    this.onQuarterchange();
  }
  checkUncheckRegion(){
    if(this.masterregion == true){
      this.Regionslist = [];
      this.Regions_f.forEach( item =>{
        this.Regionslist.push(item.Region__Opportunity_);
      })
    }else{
      this.Regionslist = [];
    }
    this.onRegionschange();
  }
  checkUncheckLevel(){
    if(this.masterlevel == true){
      this.Levelslist = [];
      this.Levels_f.forEach( item =>{
        this.Levelslist.push(item.iMeet_Project_Level);
      })
    }else{
      this.Levelslist = [];
    }
    this.onLevelschange();
  }
  checkUncheckStatus(){
    if(this.masterstatus == true){
      this.Statuslist = [];
      this.Status_f.forEach( item =>{
        this.Statuslist.push(item.iMeet_Milestone___Project_Status);
      })
    }else{
      this.Statuslist = [];
    }
    this.onStatuschange();
  }
}