import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Countries } from 'src/app/Models/HomeData';
import { DashboardServiceService } from 'src/app/dashboard-service.service';
import { LivedashboardComponent } from '../livedashboard/livedashboard.component';
import { FormControl } from '@angular/forms';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-live-home-page',
  templateUrl: './live-home-page.component.html',
  styleUrls: ['./live-home-page.component.css']
})
export class LiveHomePageComponent implements OnInit {
  imageUrl : string;
  TotalRevenue : string;
  ProjectsCount : number;
  PipelineVolume : string;
  CurrentMonth : string;
  NextMonth : string;
  ActiveRevenue : string;
  ClosedRevenue : string;
  otherRevenue : string;
  Country_FC = new FormControl();
  // screenWidth : number;screenHeight  : number;
  // imageUrl : string = "assets/images/cwt.png";
  CurrentMonthVolume: string;
  CurrentMonthRecords: string;
  NextMonthVolume: string;
  NextMonthRecords: string;
  PreMonthVolume: string;
  PreMonthRecords: string;
  RoyMonthVolume: string;
  RoyMonthRecords: string;
  ExpectedCurrentMonthVolume: string;
  ExpectedCurrentMonthRecords: string;
  FutureYearsVolume: string;
  FutureYearsRecords: string;
  HoldVolume: string;
  HoldRecords: string;
  PipelineRecords: string;
  HighPotentialVolume: string;
  HighPotentialRecords: string;
  PotentialVolume: string;
  PotentialRecords: string;
  DisableCountry : boolean = true;
  CountryList : Countries[];mastercountry : boolean;CountryNG = [];SelectedCountry;
  constructor(private router : Router,public service : DashboardServiceService,public dashboard : LivedashboardComponent,) { }
  // constructor(private router : Router) {
  //   this.screenWidth = window.innerWidth;
  //   this.screenHeight = window.innerHeight;
  //   window.onresize = () => {
  //     // set screenWidth on screen size change
  //     this.screenWidth = window.innerWidth;
  //     this.screenHeight = window.innerHeight;
  //   };
  //  }
  GlobalData : boolean;APACData : boolean;EMEAData : boolean;LATAMData : boolean;NORAMData : boolean;
  ngOnInit() {
    this.GlobalData = true;
    this.imageUrl = "assets/images/cwt.png";
    this.GetData("APAC,EMEA,LATAM,NORAM");
  }
  SelectedRegion;
  GetData(Region : string){
    this.SelectedRegion = Region;
    this.dashboard.ShowSpinnerHandler(true);
    this.service.HomeDetailsData(Region).subscribe(data =>{
      this.ProjectsCount = data.Projects;
      // this.TotalRevenue = this.NumberConverter(data.TotalVolume);
      // this.ActiveRevenue = this.NumberConverter(data.ActiveVolume);
      // this.ClosedRevenue = this.NumberConverter(data.ClosedVolume);
      // this.otherRevenue = this.NumberConverter(data.P_NDC_H_Volume);
      this.PipelineVolume = this.NumberConverter(data.PipelineVolume);
      // this.CurrentMonth = this.NumberConverter(data.CurrentMonth);
      // this.NextMonth = this.NumberConverter(data.NextMonth);
      this.CurrentMonthVolume = this.NumberConverter(data.CurrentMonthVolume);
      this.CurrentMonthRecords = data.CurrentMonthRecords+"";
      this.NextMonthVolume = this.NumberConverter(data.NextMonthVolume);
      this.NextMonthRecords = data.NextMonthRecords+"";
      this.PreMonthVolume = this.NumberConverter(data.PreMonthVolume);
      this.PreMonthRecords = data.PreMonthRecords+"";
      this.RoyMonthVolume = this.NumberConverter(data.RoyMonthVolume);
      this.RoyMonthRecords = data.RoyMonthRecords+"";
      this.ExpectedCurrentMonthVolume = this.NumberConverter(data.ExpectedCurrentMonthVolume);
      this.ExpectedCurrentMonthRecords = data.ExpectedCurrentMonthRecords+"";
      this.FutureYearsVolume = this.NumberConverter(data.FutureYearsVolume);
      this.FutureYearsRecords = data.FutureYearsRecords+"";
      this.HoldVolume = this.NumberConverter(data.HoldVolume);
      this.HoldRecords = data.HoldRecords+"";
      this.PipelineVolume = this.NumberConverter(data.PipelineVolume);
      this.PipelineRecords = data.PipelineRecords+"";
      this.HighPotentialVolume = this.NumberConverter(data.HighPotentialVolume);
      this.HighPotentialRecords = data.HighPotentialRecords+"";
      this.PotentialVolume = this.NumberConverter(data.PotentialVolume);
      this.PotentialRecords = data.PotentialRecords+"";
      this.CountryList = data.Countries;
      this.CountryNG = [];
      this.mastercountry = true;
      this.CountryList.forEach( item =>{
        this.CountryNG.push(item.Country);
      })
      if(Region == "APAC,EMEA,LATAM,NORAM"){

      }else{
        this.onCountrychange();
      }
      this.dashboard.ShowSpinnerHandler(false);
    })
  }
  GlobalClick(){
    this.GlobalData = true;
    this.APACData = false;
    this.EMEAData = false;
    this.LATAMData = false;
    this.NORAMData = false;
    this.DisableCountry = true;
    this.GetData("APAC,EMEA,LATAM,NORAM");
  }
  APACClick(){
    this.GlobalData = false;
    this.APACData = true;
    this.EMEAData = false;
    this.LATAMData = false;
    this.NORAMData = false;
    this.DisableCountry = false;
    this.GetData("APAC");
  }
  LATAMClick(){
    this.GlobalData = false;
    this.APACData = false;
    this.EMEAData = false;
    this.LATAMData = true;
    this.NORAMData = false;
    this.DisableCountry = false;
    this.GetData("LATAM");
  }
  NORAMClick(){
    this.GlobalData = false;
    this.APACData = false;
    this.EMEAData = false;
    this.LATAMData = false;
    this.NORAMData = true;
    this.DisableCountry = false;
    this.GetData("NORAM");
  }
  EMEAClick(){
    this.GlobalData = false;
    this.APACData = false;
    this.EMEAData = true;
    this.LATAMData = false;
    this.NORAMData = false;
    this.DisableCountry = false;
    this.GetData("EMEA");
  }
  checkUncheckCountry(){
    if(this.mastercountry == true){
      this.CountryNG = [];
      this.CountryList.forEach( item =>{
        this.CountryNG.push(item.Country);
      })
    }else{
      this.CountryNG = [];
    }
    this.onCountrychange();
  }
  onCountrychange(){
    if(this.CountryNG.length == this.CountryList.length){
      this.mastercountry = true;
    }else{
      this.mastercountry = false;
    }
    this.SelectedCountry = null;
    for(let i=0;i<this.CountryNG.length;i++){
      if(i == 0){
        this.SelectedCountry = this.CountryNG[i];
      }else{
        this.SelectedCountry += ","+this.CountryNG[i];
      }
    }
    if(this.SelectedCountry == null || this.SelectedCountry == ""){
    }else{
      this.service.HomeDetailsDataWithCountry(this.SelectedRegion,this.SelectedCountry).subscribe(data =>{
        this.ProjectsCount = data.Projects;
        // this.TotalRevenue = this.NumberConverter(data.TotalVolume);
        // this.ActiveRevenue = this.NumberConverter(data.ActiveVolume);
        // this.ClosedRevenue = this.NumberConverter(data.ClosedVolume);
        // this.otherRevenue = this.NumberConverter(data.P_NDC_H_Volume);
        this.PipelineVolume = this.NumberConverter(data.PipelineVolume);
        // this.CurrentMonth = this.NumberConverter(data.CurrentMonth);
        // this.NextMonth = this.NumberConverter(data.NextMonth);
        this.CurrentMonthVolume = this.NumberConverter(data.CurrentMonthVolume);
        this.CurrentMonthRecords = data.CurrentMonthRecords+"";
        this.NextMonthVolume = this.NumberConverter(data.NextMonthVolume);
        this.NextMonthRecords = data.NextMonthRecords+"";
        this.PreMonthVolume = this.NumberConverter(data.PreMonthVolume);
        this.PreMonthRecords = data.PreMonthRecords+"";
        this.RoyMonthVolume = this.NumberConverter(data.RoyMonthVolume);
        this.RoyMonthRecords = data.RoyMonthRecords+"";
        this.ExpectedCurrentMonthVolume = this.NumberConverter(data.ExpectedCurrentMonthVolume);
        this.ExpectedCurrentMonthRecords = data.ExpectedCurrentMonthRecords+"";
        this.FutureYearsVolume = this.NumberConverter(data.FutureYearsVolume);
        this.FutureYearsRecords = data.FutureYearsRecords+"";
        this.HoldVolume = this.NumberConverter(data.HoldVolume);
        this.HoldRecords = data.HoldRecords+"";
        this.PipelineVolume = this.NumberConverter(data.PipelineVolume);
        this.PipelineRecords = data.PipelineRecords+"";
        this.HighPotentialVolume = this.NumberConverter(data.HighPotentialVolume);
        this.HighPotentialRecords = data.HighPotentialRecords+"";
        this.PotentialVolume = this.NumberConverter(data.PotentialVolume);
        this.PotentialRecords = data.PotentialRecords+"";
        this.dashboard.ShowSpinnerHandler(false);
      })
    }
  }
  NumberConverter(label : any) : string{
    if(label == null || label == ""){
      return "$0";
    }else if(label <= 999){
      return '$' + label+"";
    }
    // thousands
    else if(label >= 1000 && label <= 999999){
      return '$' + Math.round(label / 1000) + 'K';
    }
    // millions
    else if(label >= 1000000 && label <= 999999999){
      return '$' + Math.round(label / 1000000) + 'M';
    }
    // billions
    else if(label >= 1000000000 && label <= 999999999999){
      return '$' + Math.round(label / 1000000000) + 'B';
    }
    else
      return '$' + label;
  }
}