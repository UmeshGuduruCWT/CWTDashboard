import { BreakpointObserver } from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';
import { filter, map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DashboardServiceService } from '../dashboard-service.service';

@Component({
  selector: 'app-dashboard-component-wologin',
  templateUrl: './dashboard-component-wologin.component.html',
  styleUrls: ['./dashboard-component-wologin.component.css']
})
export class DashboardComponentWOLoginComponent implements OnInit {
  showSpinner : boolean = false;
  screenWidth: number;
  screenHeight : number;
  imageUrl : string = "assets/images/cwt.png";
  Userimage : string = "assets/images/CWTlogo.jpg";
  constructor(public service : DashboardServiceService,public datepipe : DatePipe,private route : ActivatedRoute,private breakpointObserver: BreakpointObserver,private router : Router) {
    // set screenWidth on page load
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    window.onresize = () => {
      // set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    };
    // this.router.events
    // .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
    // .subscribe(event => {
    //   if (
    //     event.id === 1 &&
    //     event.url === event.urlAfterRedirects 
    //   ) {
    //     // localStorage.setItem("LastLoggedIn",this.date);
    //   }else{
    //   }
    // })
  }

  ReportSelected : string = "Go Live Report";
  ngOnInit(): void {
    if(localStorage.getItem("UID") != null){
      this.router.navigate(["/Dashboard",localStorage.getItem("UID")]);
    }else{
      localStorage.clear();
    }
  }
  SelectedReport(value : number){
    switch(value){
      case 20 : {
        this.ReportSelected = "Go Live Report";
        // this.service.UsersUsageofReports(this.LoginUID,"GoLiveReport","PanelClick").subscribe(data =>{
        // })
      }
      break;
      default : {
        this.ReportSelected = "Go Live Report";
      }
    }
  }
  ShowSpinnerHandler(value){
    this.showSpinner = value;
  }
  openloginpage(){
    this.router.navigate(["/Login"]);
  }
}
