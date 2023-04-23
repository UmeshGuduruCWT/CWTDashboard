import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DashboardServiceService } from 'src/app/dashboard-service.service';
import { ExcelService } from 'src/app/excel.service';
import { ExistingRegionWiseNPSCount, NERegionWiseNPSCount, NewRegionWiseNPSCount, NPSvalues } from 'src/app/Models/NPSData';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LivedashboardComponent } from '../livedashboard/livedashboard.component';
export class RollingNPS {
  RowLabel: string;
  APAC: number;
  EMEA: number;
  NORAM: number;
  LATAM: number;
  Global: number;
  GrandTotal : number;
  NPS : number;
}
// const data_rollingnps: RollingNPS[];
@Component({
  selector: 'app-rolling-nps',
  templateUrl: './rolling-nps.component.html',
  styleUrls: ['./rolling-nps.component.css']
})
export class RollingNPSComponent implements OnInit {
  constructor(
    public service : DashboardServiceService,public dashboard : LivedashboardComponent,public dialog: MatDialog,public datepipe : DatePipe,public excelservice : ExcelService) { 
      //set screenWidth on page load
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      window.onresize = () => {
        //set screenWidth on screen size change
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
      };
  }
  screenHeight;screenWidth;
  YTDData : NewRegionWiseNPSCount[];
  CurrentMonthData : NERegionWiseNPSCount[];
  PreviousMonthsData : ExistingRegionWiseNPSCount[];
  data_rollingNPS : RollingNPS[];
  displayedColumns: string[] = ['RowLabel','APAC','EMEA','Global','LATAM','NORAM','GrandTotal','NPS'];
  dataSource_nps;
  displayedColumns_nps: string[] = ['RowLabel','APAC','EMEA','Global','LATAM','NORAM','GrandTotal','NPS'];
  CurrentMonthNORAMTotal;CurrentMonthLATAMTotal;CurrentMonthEMEATotal;CurrentMonthAPACTotal;CurrentMonthGrandTotal;CurrentMonthGlobalTotal;CurrentMonthNPS;
  CurrentMonthNORAMTotal_d;CurrentMonthLATAMTotal_d;CurrentMonthEMEATotal_d;CurrentMonthAPACTotal_d;CurrentMonthGrandTotal_d;CurrentMonthGlobalTotal_d;CurrentMonthNPS_d;
  YTDNPSTotal;PrevYearTotal;
  S_YTDNPSTotal;S_PrevYearTotal;
  dataSource;
  CurrentMonth;
  Today;headerText;
  public YearMonthData: ReplaySubject<NPSvalues[]> = new ReplaySubject<NPSvalues[]>(1);
  YearMonthList : NPSvalues[];
  yearmonthsearch = new FormControl();
  YearMonth = new FormControl();
  protected _onDestroy = new Subject<void>();
  ngOnInit(): void {
    this.Today = new Date(); 
    this.ytdtext = "YTD - " + (new Date()).getFullYear();
    this.CurrentMonth = this.Today.toLocaleString('default', { month: 'long' });
    this.dashboard.ShowSpinnerHandler(true);
    this.service.RollingNPS().subscribe(data=>{
      this.YTDData = data.NewRegionWiseNPSCount;
      this.CurrentMonthData = data.NERegionWiseNPSCount;
      this.PreviousMonthsData = data.ExistingRegionWiseNPSCount;
      this.YearMonthList = data.NPSvalues;
      this.YearMonthData.next(this.YearMonthList.slice());
      this.CurrentMonthNORAMTotal = Math.round(data.NERegionWiseNPSCount.map(t => t.NORAMCount).reduce((acc,value) => acc + value,0));
      this.CurrentMonthLATAMTotal = Math.round(data.NERegionWiseNPSCount.map(t => t.LATAMCount).reduce((acc,value) => acc + value,0));
      this.CurrentMonthEMEATotal = Math.round(data.NERegionWiseNPSCount.map(t => t.EMEACount).reduce((acc,value) => acc + value,0));
      this.CurrentMonthAPACTotal = Math.round(data.NERegionWiseNPSCount.map(t => t.APACCount).reduce((acc,value) => acc + value,0));
      this.CurrentMonthGlobalTotal = Math.round(data.NERegionWiseNPSCount.map(t => t.GlobalCount).reduce((acc,value) => acc + value,0));
      this.CurrentMonthGrandTotal = Math.round(data.NERegionWiseNPSCount.map(t => t.Total).reduce((acc,value) => acc + value,0));
      this.dashboard.ShowSpinnerHandler(false);
      this.data_rollingNPS = [];
      if(data.NERegionWiseNPSCount.find(x => x.NPSIndicator =="Detractor") == undefined){
        this.data_rollingNPS.push({RowLabel : "Detractor",APAC : 0,EMEA : 0,LATAM : 0,NORAM : 0,Global : 0,GrandTotal : 0,NPS : 0});
      }
      if(data.NERegionWiseNPSCount.find(x => x.NPSIndicator =="Passive") == undefined){
        this.data_rollingNPS.push({RowLabel : "Passive",APAC : 0,EMEA : 0,LATAM : 0,NORAM : 0,Global : 0,GrandTotal : 0,NPS : 0});
      }
      for(let i = 0;i<data.NERegionWiseNPSCount.length;i++){
        this.data_rollingNPS.push(
          {
            RowLabel : data.NERegionWiseNPSCount[i].NPSIndicator,
            APAC : data.NERegionWiseNPSCount[i].APACCount,
            EMEA : data.NERegionWiseNPSCount[i].EMEACount,
            LATAM : data.NERegionWiseNPSCount[i].LATAMCount,
            NORAM : data.NERegionWiseNPSCount[i].NORAMCount,
            Global : data.NERegionWiseNPSCount[i].GlobalCount,
            GrandTotal : data.NERegionWiseNPSCount[i].Total,
            NPS : Math.round((data.NERegionWiseNPSCount[i].Total/data.NERegionWiseNPSCount.map(t => t.Total).reduce((acc,value) => acc + value,0))*100)
          })
      }
      if(data.NERegionWiseNPSCount.find(x => x.NPSIndicator =="Promoter") == undefined){
        this.data_rollingNPS.push({RowLabel : "Promoter",APAC : 0,EMEA : 0,LATAM : 0,NORAM : 0,Global : 0,GrandTotal : 0,NPS : 0});
      }
      this.dataSource = new MatTableDataSource(this.data_rollingNPS);
      this.CurrentMonthNPS = data.NERegionWiseNPSCount.map(t => t.Total).reduce((acc,value) => acc + value,0) == 0 ? 0 : (Math.round((((data.NERegionWiseNPSCount.find(x => x.NPSIndicator =="Promoter") == undefined ? 0 : data.NERegionWiseNPSCount.find(x => x.NPSIndicator =="Promoter").Total)/data.NERegionWiseNPSCount.map(t => t.Total).reduce((acc,value) => acc + value,0))*100*100) - (((data.NERegionWiseNPSCount.find(x => x.NPSIndicator =="Detractor") == undefined ? 0 : data.NERegionWiseNPSCount.find(x => x.NPSIndicator =="Detractor").Total)/data.NERegionWiseNPSCount.map(t => t.Total).reduce((acc,value) => acc + value,0))*100*100))/100).toFixed(1) ?? 0;
      this.YTDNPSTotal = data.NewRegionWiseNPSCount.map(t => t.Total).reduce((acc,value) => acc + value,0) == 0 ? 0 : (Math.round((((data.NewRegionWiseNPSCount.find(x => x.NPSIndicator =="Promoter") == undefined ? 0 : data.NewRegionWiseNPSCount.find(x => x.NPSIndicator =="Promoter").Total)/data.NewRegionWiseNPSCount.map(t => t.Total).reduce((acc,value) => acc + value,0))*100*100) - (((data.NewRegionWiseNPSCount.find(x => x.NPSIndicator =="Detractor") == undefined ? 0 : data.NewRegionWiseNPSCount.find(x => x.NPSIndicator =="Detractor").Total)/data.NewRegionWiseNPSCount.map(t => t.Total).reduce((acc,value) => acc + value,0))*100*100))/100).toFixed(1) ?? 0;
      this.PrevYearTotal = (Math.round((((data.ExistingRegionWiseNPSCount.find(x => x.NPSIndicator =="Promoter") == undefined ? 0 : data.ExistingRegionWiseNPSCount.find(x => x.NPSIndicator =="Promoter").Total)/data.ExistingRegionWiseNPSCount.map(t => t.Total).reduce((acc,value) => acc + value,0))*100*100) - (((data.ExistingRegionWiseNPSCount.find(x => x.NPSIndicator =="Detractor") == undefined ? 0 : data.ExistingRegionWiseNPSCount.find(x => x.NPSIndicator =="Detractor").Total)/data.ExistingRegionWiseNPSCount.map(t => t.Total).reduce((acc,value) => acc + value,0))*100*100))/100).toFixed(1) ?? 0;
      data.NewRegionWiseNPSScore.forEach(item =>{
        this.YtdMonths.push(item);
      })
      data.ExistingRegionWiseNPSScore.forEach(item =>{
        this.PreviousMonths.push(item);
      })
      // this.YtdMonths.push(data.NewRegionWiseNPSScore[0]);
      // this.PreviousMonths.push(data.ExistingRegionWiseNPSScore[0]);
      this.masterYearMonth == false;
      this.SearchValueChanges();
      this.YearMonth.setValue(data.ExistingRegionWiseNPSScore);
      this.getSelectedYearMonth();
      // if((new Date()).getMonth() == 0){
      //   this.SelectedYearMonth = ((new Date()).getFullYear()-1) + "-12";
      //   this.YearMonth.setValue([this.SelectedYearMonth]);
      // }else{
      //   this.SelectedYearMonth = (new Date()).getFullYear() + "-" + ((new Date()).getMonth());
      //   this.YearMonth.setValue([this.SelectedYearMonth]);
      // }
      this.OnApplyClick();
    })
  }
  YtdMonths : any = [];
  PreviousMonths : any = [];
  protected YearMonthfilter() {
    if (!this.YearMonthList) {
      return;
    }
    // get the search keyword
    let search = this.yearmonthsearch.value;
    if (!search) {
      this.YearMonthData.next(this.YearMonthList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.YearMonthData.next(
      this.YearMonthList.filter(x => x.YearMonth.toLowerCase().indexOf(search) > -1)
    );
  }
  ytdtext;s_ytdtext;
  showytd_rollingfor_selectedYearmonth : boolean = true;
  LoadYTDData(){
    this.headerText = "YTD - " + (new Date()).getFullYear();
    this.masterYearMonth == false;
    this.YearMonth.setValue(this.YtdMonths);
    this.getSelectedYearMonth();
    this.OnApplyClick();
  }
  LoadPreviousMonthsData(){
    this.headerText = "Rolling NPS 12 Months";
    this.masterYearMonth == false;
    this.YearMonth.setValue(this.PreviousMonths);
    this.getSelectedYearMonth();
    this.OnApplyClick();
  }
  SearchValueChanges(){
    this.yearmonthsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.YearMonthfilter();
      });
  }
  data_rollingNPS_data : RollingNPS[];
  OnApplyClick(){
    var yearmonths = [];
    yearmonths = this.SelectedYearMonth.split(',');
    this.service.GetNPSDataByYearMonth(this.SelectedYearMonth).subscribe(data=>{
      this.CurrentMonthNORAMTotal_d = Math.round(data.NERegionWiseNPSCount.map(t => t.NORAMCount).reduce((acc,value) => acc + value,0));
      this.CurrentMonthLATAMTotal_d = Math.round(data.NERegionWiseNPSCount.map(t => t.LATAMCount).reduce((acc,value) => acc + value,0));
      this.CurrentMonthEMEATotal_d = Math.round(data.NERegionWiseNPSCount.map(t => t.EMEACount).reduce((acc,value) => acc + value,0));
      this.CurrentMonthAPACTotal_d = Math.round(data.NERegionWiseNPSCount.map(t => t.APACCount).reduce((acc,value) => acc + value,0));
      this.CurrentMonthGlobalTotal_d = Math.round(data.NERegionWiseNPSCount.map(t => t.GlobalCount).reduce((acc,value) => acc + value,0));
      this.CurrentMonthGrandTotal_d = Math.round(data.NERegionWiseNPSCount.map(t => t.Total).reduce((acc,value) => acc + value,0));
      this.data_rollingNPS_data = [];
      if(data.NERegionWiseNPSCount.find(x => x.NPSIndicator =="Detractor") == undefined){
        this.data_rollingNPS_data.push({RowLabel : "Detractor",APAC : 0,EMEA : 0,LATAM : 0,NORAM : 0,Global : 0,GrandTotal : 0,NPS : 0});
      }
      if(data.NERegionWiseNPSCount.find(x => x.NPSIndicator =="Passive") == undefined){
        this.data_rollingNPS_data.push({RowLabel : "Passive",APAC : 0,EMEA : 0,LATAM : 0,NORAM : 0,Global : 0,GrandTotal : 0,NPS : 0});
      }
      for(let i = 0;i<data.NERegionWiseNPSCount.length;i++){
        this.data_rollingNPS_data.push(
        {
          RowLabel : data.NERegionWiseNPSCount[i].NPSIndicator,
          APAC : data.NERegionWiseNPSCount[i].APACCount,
          EMEA : data.NERegionWiseNPSCount[i].EMEACount,
          LATAM : data.NERegionWiseNPSCount[i].LATAMCount,
          NORAM : data.NERegionWiseNPSCount[i].NORAMCount,
          Global : data.NERegionWiseNPSCount[i].GlobalCount,
          GrandTotal : data.NERegionWiseNPSCount[i].Total,
          NPS : Math.round((data.NERegionWiseNPSCount[i].Total/data.NERegionWiseNPSCount.map(t => t.Total).reduce((acc,value) => acc + value,0))*100)
        })
      }
      if(data.NERegionWiseNPSCount.find(x => x.NPSIndicator =="Promoter") == undefined){
        this.data_rollingNPS_data.push({RowLabel : "Promoter",APAC : 0,EMEA : 0,LATAM : 0,NORAM : 0,Global : 0,GrandTotal : 0,NPS : 0});
      }
      this.dataSource_nps = new MatTableDataSource(this.data_rollingNPS_data);
      this.CurrentMonthNPS_d = (Math.round((((data.NERegionWiseNPSCount.find(x => x.NPSIndicator =="Promoter") == undefined ? 0 : data.NERegionWiseNPSCount.find(x => x.NPSIndicator =="Promoter").Total)/data.NERegionWiseNPSCount.map(t => t.Total).reduce((acc,value) => acc + value,0))*100*100) - (((data.NERegionWiseNPSCount.find(x => x.NPSIndicator =="Detractor") == undefined ? 0 : data.NERegionWiseNPSCount.find(x => x.NPSIndicator =="Detractor").Total)/data.NERegionWiseNPSCount.map(t => t.Total).reduce((acc,value) => acc + value,0))*100*100))/100).toFixed(1) ?? 0;
      if(yearmonths.length == 1){
        this.showytd_rollingfor_selectedYearmonth = true;
        var sel_yearmonth = this.SelectedYearMonth.split('-');
        let sel_date = new Date(sel_yearmonth[0], sel_yearmonth[1]-1, 1);
        this.headerText = sel_yearmonth[0] + " - " + sel_date.toLocaleString('en-us', { month: 'long' });
        this.s_ytdtext = "YTD - " + sel_yearmonth[0];
        this.S_YTDNPSTotal = (Math.round((+data.NewRegionWiseNPSScore)*100)/100).toFixed(1);
        this.S_PrevYearTotal = (Math.round((+data.ExistingRegionWiseNPSScore)*100)/100).toFixed(1);
      }else{
        this.showytd_rollingfor_selectedYearmonth = false;
        this.s_ytdtext = "YTD - ";
        this.S_YTDNPSTotal = "--";
        this.S_PrevYearTotal = "--";
      }
    })
  }
  masterYearMonth: boolean;
  SelectedYearMonth : any;
  ymlist : any = [];
  checkUncheckYearMonth() {
    if(this.masterYearMonth == true){
      this.ymlist = [];
      this.YearMonthList.forEach(item =>{
        this.ymlist.push(item.YearMonth);
      })
      this.YearMonth.setValue(this.ymlist);
    }else{
      this.ymlist = [];
      this.YearMonth.setValue("");
    }
    this.getSelectedYearMonth();
  }
  onYearMonthchange() {
    var ymlist : any = [];
    this.YearMonthList.forEach(item =>{
      ymlist.push(item.YearMonth);
    })
    if(ymlist.length == this.YearMonth.value.length){
      this.masterYearMonth = true;
    }else{
      this.masterYearMonth = false;
    }
    this.getSelectedYearMonth();
  }
  getSelectedYearMonth(){
    this.SelectedYearMonth = null;
    for(let i=0;i<this.YearMonth.value.length;i++){
      if(this.SelectedYearMonth == null){
        this.SelectedYearMonth = this.YearMonth.value[i];
      }else{
        this.SelectedYearMonth += ","+this.YearMonth.value[i];
      }
    }
  }
}