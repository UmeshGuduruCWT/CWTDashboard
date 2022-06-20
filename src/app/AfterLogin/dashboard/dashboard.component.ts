import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ActivatedRoute, Router, NavigationExtras, RouterEvent, NavigationEnd } from '@angular/router';
import { ViewportScroller,Location } from '@angular/common';
import { DashboardServiceService } from 'src/app/dashboard-service.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  showSpinner : boolean = false;
  screenWidth: number;
  screenHeight : number;
  LoggedINID;
  sub : Subscription;
  ReportSelected : string = "CWT Dashboard";
  imageUrl : string = "assets/images/cwt.png";
  Userimage : string = "assets/images/CWTlogo.jpg";
  public destroyed = new Subject<any>();
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );
  constructor(public service : DashboardServiceService,viewportScroller: ViewportScroller,private breakpointObserver: BreakpointObserver,private router : Router,private route : ActivatedRoute,public _location : Location) { 
    // set screenWidth on page load
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    window.onresize = () => {
      // set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    };
    this.router.events
    .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
    .subscribe(event => {
      if (
        event.id === 1 &&
        event.url === event.urlAfterRedirects 
      ) {
        localStorage.setItem("LastLoggedIn",this.date);
      }else{
      }
    })
  }
  ngOnInit() {
    this.service.UserReportAccess(localStorage.getItem("UID")).subscribe(data=>{
      if(data.code == 200){
        this.NpsCount = data.RevenueID;
        if(this.NpsCount > 0){
          this.npshidden = false;
        }else{
          this.npshidden = true;
        }
      }
    })
    this.startTimer();
    // this.LoggedINID = this.route.snapshot.paramMap.get("UID");
    // alert("");
    // this.sub = this.route.paramMap.subscribe(data =>{
    //   this.LoggedINID = data.get("UID");
    //   alert(this.LoggedINID);
    // })
  }
  @HostListener('document:mousemove', ['$event']) onMouseMove(event) {
    if(event) {
      this.SecondsLeft = 60;
      this.timeLeft = 1800;
    }
  }
  @HostListener('document:mouseenter', ['$event'])onMouseEnter(event: any) {     
    if(event) {
      this.timeLeft = 1800;
      this.SecondsLeft = 60;
    }
  }
  @HostListener('document:click', ['$event'])onClick(event: string) {
    if(event) {
      this.SecondsLeft = 60;
      this.timeLeft = 1800;
    }
  }
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if(event) {
      this.timeLeft = 1800;
      this.SecondsLeft = 60;
    }
  }
  @HostListener('document:scroll', ['$event']) onScroll(event: Event): void {
    if(event) {
      this.timeLeft = 1800;
      this.SecondsLeft = 60;
    }
  }
  date;
  @HostListener('window:beforeunload', ['$event']) onWindowClose(event: any): void {
     event.preventDefault();
     event.returnValue = false;
     this.date = new Date();
     localStorage.setItem("LastLoggedIn",this.date);
  }
  interval;timeLeft: number = 1800;
  SecondsLeft :number = 60;
  Time;
  NpsCount : number;npshidden : boolean = true;
  startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
        if(this.SecondsLeft > 0 && this.SecondsLeft >= 30){
          this.SecondsLeft--;
          this.Time = Math.round((this.timeLeft/60)-1)+" : "+ this.SecondsLeft;
        }else if(this.SecondsLeft > 0 && this.SecondsLeft < 30){
          this.SecondsLeft--;
          this.Time = Math.round(this.timeLeft/60)+" : "+ this.SecondsLeft;
        }else{
          this.SecondsLeft = 59;
          this.Time = Math.round(this.timeLeft/60)+" : "+ this.SecondsLeft;
        }
      }else {
        clearInterval(this.interval);
        localStorage.clear();
        this.router.navigate(["/Login"]);
      }
    },1801)
  }
  pauseTimer() {
    clearInterval(this.interval);
  }
  ShowSpinnerHandler(value){
    this.showSpinner = value;
  }
  HomeClick(){
    this.ReportSelected = "CWT Dashboard";
    if(decodeURI(this._location.path()) == "/Dashboard/HomePage"){
      this.router.navigateByUrl("/refresh",{skipLocationChange : true}).then(() =>{
        this.router.navigate([decodeURI(this._location.path())])
      })
    }else{
      this.router.navigate(['/Dashboard/HomePage']);
    }
  }
  SelectedReport(value : number){
    switch(value){
      case 1 : this.ReportSelected = "Implementation Project Status";
      break;
      case 2 : this.ReportSelected = "Critical Tasks Overdue";
      break;
      case 3 : this.ReportSelected = "Lessons Learnt";
      break;
      case 4 : this.ReportSelected = "Stage Gate Testing";
      break;
      case 5 : this.ReportSelected = "eSOW Report";
      break;
      case 6 : this.ReportSelected = "Automated CLR";
      break;
      case 7 : this.ReportSelected = "Implementation Market Report";
      break;
      case 8 : this.ReportSelected = "Cycle Time";
      break;
      case 9 : this.ReportSelected = "Tracker";
      break;
      case 10 : this.ReportSelected = "Resource Utilization";
      break;
      case 11 : this.ReportSelected = "Capacity Hierarchy";
      break;
      case 12 : this.ReportSelected = "NPS";
      break;
      case 13 : this.ReportSelected = "Project Team";
      break;
      case 14 : this.ReportSelected = "Digital Team";
      break;
      case 18 : this.ReportSelected = "Country Level Report";
      break;
      default : this.ReportSelected = "Home Page";
    }
  }
}