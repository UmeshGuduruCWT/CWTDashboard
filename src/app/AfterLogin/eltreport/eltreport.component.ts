import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { DashboardServiceService } from '../../dashboard-service.service';
import { EltData, YearMonth } from '../../Models/EltResponse';
import { ExcelService } from '../../excel.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LivedashboardComponent } from '../livedashboard/livedashboard.component';
import { FormControl } from '@angular/forms';
export interface DialogData {
  Dailog_Client : string;
  Dailog_Status : string;
  Dailog_Comment : string;
}
export interface PriorDialogData {
  Year : string;
  Month : string;
  Name : string;
}
@Component({
  selector: 'app-eltreport',
  templateUrl: './eltreport.component.html',
  styleUrls: ['./eltreport.component.css']
  // encapsulation: ViewEncapsulation.Emulated
})
export class ELTReportComponent implements OnInit {
  Dailog_Comment : string;
  Dailog_Status : string;
  Dailog_Client : string;
  Dailog_Year : string;
  Dailog_Month : string;
  displayedColumns_c : string[] = ['Client','APAC_volume','EMEA_volume','LATAM_volume','NORAM_volume','CurrentMonth_s','PriorMonthElt_s','Delta_s','TotalAcountVolume_s','EltStatus','Comments'];//'PreviousYear_s','Status'
  displayedColumns_n : string[] = ['Client','APAC_volume','EMEA_volume','LATAM_volume','NORAM_volume','CurrentMonth_s','EltStatus','TotalAcountVolume_s','Comments'];//'PreviousYear_s',
  displayedColumns_Ry : string[] = ['Client', 'Month1_s','Month2_s','RemainingMonths','TotalMonths','EltStatus','TotalAcountVolume_s','Comments'];//'PreviousYear_s',
  dataSource_c;
  dataSource_ce;
  displayedColumns_ce : string[] = ['Client','Revenue_volume','RevenueID','Country','Comments','ChangesMadeforAccount'];
  dataSource_n;
  dataSource_Ry;
  PreviousYear : string;
  CurrentMonth : string;
  SubTotalAPAC_C : string;
  SubTotalEMEA_C : string;
  SubTotalLatam_C : string;
  SubTotalNoram_C : string;
  SubTotal_C : string;
  OtherClient_C : string;
  GrandTotal_C : string;
  PreviousYear_N : string;
  NextMonth_N : string;
  SubTotalAPAC_N : string;
  SubTotalEMEA_N : string;
  SubTotalLatam_N : string;
  SubTotalNoram_N : string;
  SubTotal_N : string;
  OtherClient_N : string;
  GrandTotal_N : string;
  Month1_ry : string;
  Month2_ry : string;
  RemainingMonths_ry : string;
  PreviousYear_ry : string;
  Month1SubTotal_ry : string;
  Month2SubTotal_ry : string;
  RemainingMonthsSubTotal_ry : string;
  Month1OC_ry : string;
  Month2OC_ry : string;
  RemainingOC_ry : string;
  Month1GT_ry : string;
  Month2GT_ry : string;
  RemainingGT_ry : string;
  CurrentMonthData : EltData[];
  NextMonthData : EltData[];
  RemainingMonthsData : EltData[];
  YearMonth_list : YearMonth[];
  yearMonths = new FormControl();
  Selectedyearmonth;
  DisableButton : boolean = false;
  constructor(private service : DashboardServiceService,public dialog: MatDialog,private dashboard : LivedashboardComponent,private excelService:ExcelService) { }
  openDialog(): void {
    const dialogRef = this.dialog.open(EltDailog, {
      width: '400px',
      height : '250px',
      data: {Dailog_Comment: this.Dailog_Comment,Dailog_Client : this.Dailog_Client,Dailog_Status : this.Dailog_Status}
    });
    dialogRef.afterClosed().subscribe(result => {
      //this.Comment = result;
    });
  }
  PriorMonthDate;
  openPriorDialog() : void{
    const dialogRef = this.dialog.open(PriorMonthData, {
      // width: '500px',
      width : '90%',
      height : '650px',
      data: {Year: this.Dailog_Year,Month : this.Dailog_Month,Name : localStorage.getItem("Username")}
    });
    dialogRef.afterClosed().subscribe(result => {
      //this.Comment = result;
      this.Selectedyearmonth = "Select Value";
    });
  }
  ShowComment(Dailog_Client : string,Dailog_Status : string,Dailog_Comment : string){
    this.Dailog_Client = Dailog_Client;
    this.Dailog_Status = Dailog_Status;
    this.Dailog_Comment = Dailog_Comment;
    this.openDialog();
  }
  Forecast;Varience;VarienceValue;
  openLink(WorkSpace : string){
    // var Hyperlink = "https://cwt.imeetcentral.com/"+ WorkSpace.replace(/[^\w\s]/gi,"")+"/";
    var Hyperlink  : string = "https://cwt.imeetcentral.com/"+WorkSpace.replace(/\s/g, "")+"/properties";
    window.open(Hyperlink);
  }
  openLinkelt(WorkSpace : string){
    // var Hyperlink = "https://cwt.imeetcentral.com/"+ WorkSpace.replace(/[^\w\s]/gi,"")+"/";
    var Hyperlink  : string = "https://cwt.imeetcentral.com/"+WorkSpace.replace(/\s/g, "")+"/project/";
    window.open(Hyperlink);
  }
  ngOnInit() {
    this.PriorMonthDate = localStorage.getItem("ELTLastUpdatedOn");
    this.Selectedyearmonth = "Select Value";
    this.dashboard.ShowSpinnerHandler(true);
    this.service.CurrentMonthELT().subscribe(data =>{
      this.CurrentMonth = data.ColumnOne;
      this.PreviousYear = data.ColumnYearName;
      this.CurrentMonthData = data.Data;
      this.SubTotalAPAC_C = Math.round(data.Data.map(t => t.APAC).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.SubTotalEMEA_C = Math.round(data.Data.map(t => t.EMEA).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.SubTotalLatam_C = Math.round(data.Data.map(t => t.LATAM).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.SubTotalNoram_C = Math.round(data.Data.map(t => t.NORAM).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.SubTotal_C = Math.round(data.Data.map(t => t.CurrentMonth).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.GrandTotal_C = Math.round(data.TotalAmountMonth1).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.OtherClient_C = Math.round(data.TotalAmountMonth1 - data.Data.map(t => t.CurrentMonth).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      for(let i = 0;i<data.Data.length;i++){
        //Delta
        // if(this.CurrentMonthData[i].CurrentMonth == null){
        //   this.CurrentMonthData[i].DeltaColor = "white";

        //   this.CurrentMonthData[i].Delta_s = Math.round(0-).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);;
        // }else{
          if(this.CurrentMonthData[i].PriorMonthElt.length == 0){
            this.CurrentMonthData[i].Delta_s = Math.round(this.CurrentMonthData[i].CurrentMonth).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
            if(Math.round(this.CurrentMonthData[i].CurrentMonth) == 0){
              this.CurrentMonthData[i].DeltaColor = "white";
            }else{
              this.CurrentMonthData[i].DeltaColor = "green";}
          }else{  
            this.CurrentMonthData[i].Delta_s = Math.round(this.CurrentMonthData[i].CurrentMonth-this.CurrentMonthData[i].PriorMonthElt).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
            if(Math.round(this.CurrentMonthData[i].CurrentMonth-this.CurrentMonthData[i].PriorMonthElt) > 0){
              this.CurrentMonthData[i].DeltaColor = "green";
            }else if(Math.round(this.CurrentMonthData[i].CurrentMonth-this.CurrentMonthData[i].PriorMonthElt) == 0){
              this.CurrentMonthData[i].DeltaColor = "white";
            }else{
              this.CurrentMonthData[i].DeltaColor = "red";
            }
          }
        // }
        //CurrentMonth
        if(this.CurrentMonthData[i].CurrentMonth == null){
          this.CurrentMonthData[i].CurrentMonth_s = "$0";
        }else{
          this.CurrentMonthData[i].CurrentMonth_s = Math.round(this.CurrentMonthData[i].CurrentMonth).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Apac Region
        if(this.CurrentMonthData[i].APAC == null){
          this.CurrentMonthData[i].APAC_volume = "$0";
        }else{
          this.CurrentMonthData[i].APAC_volume = Math.round(this.CurrentMonthData[i].APAC).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //EMEA Region
        if(this.CurrentMonthData[i].EMEA == null){
          this.CurrentMonthData[i].EMEA_volume = "$0";
        }else{
          this.CurrentMonthData[i].EMEA_volume = Math.round(this.CurrentMonthData[i].EMEA).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Latam Region
        if(this.CurrentMonthData[i].LATAM == null){
          this.CurrentMonthData[i].LATAM_volume = "$0";
        }else{
          this.CurrentMonthData[i].LATAM_volume = Math.round(this.CurrentMonthData[i].LATAM).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Noram Region
        if(this.CurrentMonthData[i].NORAM == null){
          this.CurrentMonthData[i].NORAM_volume = "$0";
        }else{
          this.CurrentMonthData[i].NORAM_volume = Math.round(this.CurrentMonthData[i].NORAM).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //PriorMonthELT
        if(this.CurrentMonthData[i].PriorMonthElt.length == 0){
          this.CurrentMonthData[i].PriorMonthElt_s = "$0";
        }else{
          this.CurrentMonthData[i].PriorMonthElt_s = Math.round(this.CurrentMonthData[i].PriorMonthElt).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Previous Year
        if(this.CurrentMonthData[i].PreviousYear == null){
          this.CurrentMonthData[i].PreviousYear_s = "$0";
        }else{
          this.CurrentMonthData[i].PreviousYear_s = Math.round(this.CurrentMonthData[i].PreviousYear).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Total Account Volume
        if(this.CurrentMonthData[i].TotalAcountVolume == null){
          this.CurrentMonthData[i].TotalAcountVolume_s = "$0";
        }else{
          this.CurrentMonthData[i].TotalAcountVolume_s = Math.round(this.CurrentMonthData[i].TotalAcountVolume).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Comments
        if(this.CurrentMonthData[i].Comments == null || this.CurrentMonthData[i].Comments == ""){
          this.CurrentMonthData[i].Comments = this.CurrentMonthData[i].RegionComment + " " + Math.round(this.CurrentMonthData[i].RevenueComment).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }else{
        }
        if(this.CurrentMonthData[i].EltStatus.includes("On Track - Green")){
          this.CurrentMonthData[i].EltStatusColor = "green";
        }else if(this.CurrentMonthData[i].EltStatus.includes("Risk - Amber")){
          this.CurrentMonthData[i].EltStatusColor = "orange";
          //this.NextMonthData[i].TotalAcountVolume_s = this.NextMonthData[i].TotalAcountVolume.toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }else if(this.CurrentMonthData[i].EltStatus.includes("Issue - Red")){
          this.CurrentMonthData[i].EltStatusColor = "red";
        }else if(this.CurrentMonthData[i].EltStatus == null || this.CurrentMonthData[i].EltStatus == "")
        {
          this.CurrentMonthData[i].EltStatus = "On Track - Green";
          this.CurrentMonthData[i].EltStatusColor = "green";
        }
      }
      this.Forecast = Math.round(data.GrandTotal).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.Varience = Math.round(data.TotalAmountMonth1-data.GrandTotal).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      if(data.TotalAmountMonth1-data.GrandTotal >=0){
        this.VarienceValue = true;
      }else{
        this.VarienceValue = false;
      }
      for(let i = 0;i<data.YearMonth.length;i++){
        if(data.YearMonth[i].Revenue == null){
          data.YearMonth[i].Revenue_volume = "$0";
        }else{
          data.YearMonth[i].Revenue_volume = Math.round(data.YearMonth[i].Revenue).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        if(data.YearMonth[i].Month != data.YearMonth[i].CLRGoLiveMonth){
          data.YearMonth[i].ChangesMadeforAccount = "--> Go-live Month Changed from '" + data.YearMonth[i].Month + "' to '" + data.YearMonth[i].CLRGoLiveMonth+"'.";
        }
        if(data.YearMonth[i].ProjectStatus != data.YearMonth[i].CLRProjectStatus){
          data.YearMonth[i].ChangesMadeforAccount += "\n\n--> Project Status Changed from '" + data.YearMonth[i].ProjectStatus + "' to '" + data.YearMonth[i].CLRProjectStatus+"'.";
        }
      }
      this.dataSource_c = this.CurrentMonthData;
      this.dataSource_ce = data.YearMonth;
      this.dashboard.ShowSpinnerHandler(false);
    });
    this.dashboard.ShowSpinnerHandler(true);
    this.service.NextMonthELT().subscribe(data => {
      this.NextMonth_N = data.ColumnOne;
      this.PreviousYear_N = data.ColumnYearName;
      this.NextMonthData = data.Data;
      this.SubTotalAPAC_N = Math.round(data.Data.map(t => t.APAC).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.SubTotalEMEA_N = Math.round(data.Data.map(t => t.EMEA).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.SubTotalLatam_N = Math.round(data.Data.map(t => t.LATAM).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.SubTotalNoram_N = Math.round(data.Data.map(t => t.NORAM).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.SubTotal_N = Math.round(data.Data.map(t => t.CurrentMonth).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.GrandTotal_N = Math.round(data.TotalAmountMonth1).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.OtherClient_N = Math.round(data.TotalAmountMonth1 - data.Data.map(t => t.CurrentMonth).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      for(let i = 0;i<data.Data.length;i++){
        //CurrentMonth
        if(this.NextMonthData[i].CurrentMonth == null){
          this.NextMonthData[i].CurrentMonth_s = "$0";
        }else{
          this.NextMonthData[i].CurrentMonth_s = Math.round(this.NextMonthData[i].CurrentMonth).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Apac region
        if(this.NextMonthData[i].APAC == null){
          this.NextMonthData[i].APAC_volume = "$0";
        }else{
          this.NextMonthData[i].APAC_volume = Math.round(this.NextMonthData[i].APAC).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Emea region
        if(this.NextMonthData[i].EMEA == null){
          this.NextMonthData[i].EMEA_volume = "$0";
        }else{
          this.NextMonthData[i].EMEA_volume = Math.round(this.NextMonthData[i].EMEA).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Latam region
        if(this.NextMonthData[i].LATAM == null){
          this.NextMonthData[i].LATAM_volume = "$0";
        }else{
          this.NextMonthData[i].LATAM_volume = Math.round(this.NextMonthData[i].LATAM).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Noram region
        if(this.NextMonthData[i].NORAM == null){
          this.NextMonthData[i].NORAM_volume = "$0";
        }else{
          this.NextMonthData[i].NORAM_volume = Math.round(this.NextMonthData[i].NORAM).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //PriorMonthELT
        if(this.NextMonthData[i].PriorMonthElt == null){
          this.NextMonthData[i].PriorMonthElt_s = "$0";
        }else{
          this.NextMonthData[i].PriorMonthElt_s = Math.round(this.NextMonthData[i].PriorMonthElt).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Delta
        if(this.NextMonthData[i].Delta == null){
          this.NextMonthData[i].Delta_s = "$0";
        }else{
          this.NextMonthData[i].Delta_s = Math.round(this.NextMonthData[i].Delta).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Previous Year
        if(this.NextMonthData[i].PreviousYear == null){
          this.NextMonthData[i].PreviousYear_s = "$0";
        }else{
          this.NextMonthData[i].PreviousYear_s = Math.round(this.NextMonthData[i].PreviousYear).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Total Account Volume
        if(this.NextMonthData[i].TotalAcountVolume == null){
          this.NextMonthData[i].TotalAcountVolume_s = "$0";
        }else{
          this.NextMonthData[i].TotalAcountVolume_s = Math.round(this.NextMonthData[i].TotalAcountVolume).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Comments
        if(this.NextMonthData[i].Comments == null || this.NextMonthData[i].Comments == ""){
          this.NextMonthData[i].Comments = this.NextMonthData[i].RegionComment + " " + Math.round(this.NextMonthData[i].RevenueComment).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }else{
        }
        if(this.NextMonthData[i].EltStatus.includes("On Track - Green")){
          this.NextMonthData[i].EltStatusColor = "green";
        }else if(this.NextMonthData[i].EltStatus.includes("Risk - Amber")){
          this.NextMonthData[i].EltStatusColor = "orange";
          //this.NextMonthData[i].TotalAcountVolume_s = this.NextMonthData[i].TotalAcountVolume.toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }else if(this.NextMonthData[i].EltStatus.includes("Issue - Red")){
          this.NextMonthData[i].EltStatusColor = "red";
        }else if(this.NextMonthData[i].EltStatus == null || this.NextMonthData[i].EltStatus == "")
        {
          this.NextMonthData[i].EltStatus = "On Track - Green";
          this.NextMonthData[i].EltStatusColor = "green";
        }
      }
      this.dataSource_n = this.NextMonthData;
      this.dashboard.ShowSpinnerHandler(false);
    })
    this.dashboard.ShowSpinnerHandler(true);
    this.service.RestOfMonthsELT().subscribe(data => {
      this.Month1_ry = data.ColumnOne;
      this.Month2_ry = data.ColumnTwo;
      this.RemainingMonths_ry = data.ColumnThree;
      this.PreviousYear_ry = data.ColumnYearName;
      this.RemainingMonthsData = data.Data;
      this.Month1SubTotal_ry = Math.round(data.Data.map(t => t.Month1).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.Month1GT_ry = Math.round(data.TotalAmountMonth1).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.Month1OC_ry = Math.round(data.TotalAmountMonth1 - data.Data.map(t => t.Month1).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.Month2SubTotal_ry = Math.round(data.Data.map(t => t.Month2).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.Month2GT_ry = Math.round(data.TotalAmountMonth2).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.Month2OC_ry = Math.round(data.TotalAmountMonth2 - data.Data.map(t => t.Month2).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.RemainingMonthsSubTotal_ry = Math.round(data.Data.map(t => t.Month1_N).reduce((acc,value) => acc + value,0) + data.Data.map(t => t.Month2_N).reduce((acc,value) => acc + value,0) + data.Data.map(t => t.RemainingTBC).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.RemainingGT_ry = Math.round(data.TotalAmountRemainingMonths).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.RemainingOC_ry = Math.round(data.TotalAmountRemainingMonths - (data.Data.map(t => t.Month1_N).reduce((acc,value) => acc + value,0) + data.Data.map(t => t.Month2_N).reduce((acc,value) => acc + value,0) + data.Data.map(t => t.RemainingTBC).reduce((acc,value) => acc + value,0))).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      for(let i = 0;i<data.Data.length;i++){
        //Month1
        if(this.RemainingMonthsData[i].Month1 == null){
          this.RemainingMonthsData[i].Month1_s = "$0";
        }else{
          this.RemainingMonthsData[i].Month1_s = Math.round(this.RemainingMonthsData[i].Month1).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Month2
        if(this.RemainingMonthsData[i].Month2 == null){
          this.RemainingMonthsData[i].Month2_s = "$0";
        }else{
          this.RemainingMonthsData[i].Month2_s = Math.round(this.RemainingMonthsData[i].Month2).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //RemainingMonths
        if(this.RemainingMonthsData[i].RemainingTBC == null && this.RemainingMonthsData[i].Month1_N == null && this.RemainingMonthsData[i].Month2_N == null){
          this.RemainingMonthsData[i].RemainingMonths = "$0";
        }else{
          this.RemainingMonthsData[i].RemainingMonths = Math.round(this.RemainingMonthsData[i].Month1_N + this.RemainingMonthsData[i].Month2_N + this.RemainingMonthsData[i].RemainingTBC).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //TotalMonths
        if(this.RemainingMonthsData[i].RemainingTBC == null && this.RemainingMonthsData[i].Month1_N == null && this.RemainingMonthsData[i].Month2_N == null && this.RemainingMonthsData[i].Month2 == null && this.RemainingMonthsData[i].Month1 == null){
          this.RemainingMonthsData[i].TotalMonths = "$0";
        }else{
          this.RemainingMonthsData[i].TotalMonths = Math.round(this.RemainingMonthsData[i].Month1_N + this.RemainingMonthsData[i].Month2_N + this.RemainingMonthsData[i].RemainingTBC + this.RemainingMonthsData[i].Month2 + this.RemainingMonthsData[i].Month1).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Previous Year
        if(this.RemainingMonthsData[i].PreviousYear == null){
          this.RemainingMonthsData[i].PreviousYear_s = "$0";
        }else{
          this.RemainingMonthsData[i].PreviousYear_s = Math.round(this.RemainingMonthsData[i].PreviousYear).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Total Account Volume
        if(this.RemainingMonthsData[i].TotalAcountVolume == null){
          this.RemainingMonthsData[i].TotalAcountVolume_s = "$0";
        }else{
          this.RemainingMonthsData[i].TotalAcountVolume_s = Math.round(this.RemainingMonthsData[i].TotalAcountVolume).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Comments
        if(this.RemainingMonthsData[i].Comments == null || this.RemainingMonthsData[i].Comments == ""){
          this.RemainingMonthsData[i].Comments = this.RemainingMonthsData[i].RegionComment + " " + Math.round(this.RemainingMonthsData[i].RevenueComment).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }else{
        }
        //EltStatus Color
        if(this.RemainingMonthsData[i].EltStatus.includes("Risk - Amber")){
          this.RemainingMonthsData[i].EltStatus = "Risk - Amber";
          this.RemainingMonthsData[i].EltStatusColor = "orange";
        }
        if(this.RemainingMonthsData[i].EltStatus.includes("On Track - Green")){
          this.RemainingMonthsData[i].EltStatusColor = "green";
        }else if(this.RemainingMonthsData[i].EltStatus.includes("Risk - Amber")){
          this.RemainingMonthsData[i].EltStatusColor = "orange";
        }else if(this.RemainingMonthsData[i].EltStatus.includes("Issue - Red")){
          this.RemainingMonthsData[i].EltStatusColor = "red";
        }else if(this.RemainingMonthsData[i].EltStatus == null || this.RemainingMonthsData[i].EltStatus == ""){
          this.RemainingMonthsData[i].EltStatus = "On Track - Green";
          this.RemainingMonthsData[i].EltStatusColor = "green";
        }
      }
      this.dataSource_Ry = this.RemainingMonthsData;
      this.dashboard.ShowSpinnerHandler(false);
    })
    this.service.PreviousMonthsEltYearMonth().subscribe(data => {
      this.YearMonth_list = data.YearMonth;
      if(data.code == 200){
        for(let i = 0;i<data.YearMonth.length;i++){
          this.YearMonth_list[i].YearMonth = data.YearMonth[i].Year + " - "+ data.YearMonth[i].Month;
        }
        this.DisableButton = false;
      }else{
        this.DisableButton = true;
      }
    })
  }
  onSelectedChange(value : string){
    if(value == "Select Value"){
    }else{
      for(let i = 0;i<this.YearMonth_list.length;i++){
        if(this.YearMonth_list[i].YearMonth == value){
          this.Dailog_Year = this.YearMonth_list[i].Year;
          this.Dailog_Month = this.YearMonth_list[i].Month;
        }
      }
      this.openPriorDialog();
    }
  }
  exportAsXLSXCM(){
    const CustomizedData = this.dataSource_c.map(o => {
      return { Client: o.Client,
        APAC_volume : o.APAC_volume,
        EMEA_volume : o.EMEA_volume,
        LATAM_volume : o.LATAM_volume,
        NORAM_volume : o.NORAM_volume,
        CurrentMonth : o.CurrentMonth_s,
        PriorMonthElt : o.PriorMonthElt_s,
        Delta : o.Delta_s,
        TotalAcountVolume : o.TotalAcountVolume_s,
        Comments : o.Comments == null || o.Comments == "" ? o.RegionComment+""+Math.round(o.RevenueComment).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3) : o.Comments,
      };
    });
    this.excelService.exportAsExcelFile(CustomizedData, 'CurrentMonthElt');
  }
  exportAsXLSXNM(){
    const CustomizedData = this.dataSource_n.map(o => {
      return { Client: o.Client,
        APAC_volume : o.APAC_volume,
        EMEA_volume : o.EMEA_volume,
        LATAM_volume : o.LATAM_volume,
        NORAM_volume : o.NORAM_volume,
        NextMonth : o.CurrentMonth_s,
        EltStatus : o.EltStatus,
        AccountVolume : o.TotalAcountVolume_s,
        Comments : o.Comments == null || o.Comments == "" ? o.RegionComment+""+Math.round(o.RevenueComment).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3) : o.Comments,
      };
    });
    this.excelService.exportAsExcelFile(CustomizedData, 'NextMonthElt');
  }
  exportAsXLSXROY(){
    const CustomizedData = this.dataSource_Ry.map(o => {
      return { Client: o.Client,
        Month1 : o.Month1_s,
        Month2 : o.Month2_s,
        RemainingMonths : o.RemainingMonths,
        TotalMonths : o.TotalMonths,
        EltStatus : o.EltStatus,
        AccountVolume : o.TotalAcountVolume_s,
        Comments : o.Comments == null || o.Comments == "" ? o.RegionComment+""+Math.round(o.RevenueComment).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3) : o.Comments,
      };
    });
    this.excelService.exportAsExcelFile(CustomizedData, 'RestofYearElt');
  }
}
@Component({
  selector: 'app-eltdailog',
  templateUrl: './eltdailog.component.html',
})
export class EltDailog {
  constructor(
    public dialogRef: MatDialogRef<EltDailog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  selector: 'app-priormonthdata',
  templateUrl: './priormonthdata.component.html',
  styleUrls: ['./priormonthdata.component.css']
})
export class PriorMonthData {
  constructor(
    public dialogRef: MatDialogRef<PriorMonthData>,
    public service : DashboardServiceService,
    private excelService:ExcelService,public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: PriorDialogData) {}
  displayedColumns_c : string[] = ['Client','APAC_volume','EMEA_volume','LATAM_volume','NORAM_volume','CurrentMonth_s','PriorMonthElt_s','Delta_s','TotalAcountVolume_s','Comments'];//'PreviousYear_s','Status'
  dataSource_c;
  SelectedYearMonthData: EltData[];
  SelectedMonth;PreviousYear;
  SubTotalAPAC_C;SubTotalEMEA_C;SubTotalLatam_C;SubTotalNoram_C;
  SubTotal_C;GrandTotal_C;OtherClient_C;
  Dailog_Comment : string;
  Dailog_Status : string;
  Dailog_Client : string;
    ngOnInit(){
      this.service.SelectedPriorMonthYearData(this.data.Year,this.data.Month).subscribe(datas =>{
        this.SelectedMonth = this.data.Month + " " + this.data.Year + " (Status : Active/Closed)";
        // this.PreviousYear = datas.ColumnYearName;
        this.SelectedYearMonthData = datas.Data;
        this.SubTotalAPAC_C = Math.round(datas.Data.map(t => t.APAC).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        this.SubTotalEMEA_C = Math.round(datas.Data.map(t => t.EMEA).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        this.SubTotalLatam_C = Math.round(datas.Data.map(t => t.LATAM).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        this.SubTotalNoram_C = Math.round(datas.Data.map(t => t.NORAM).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        this.SubTotal_C = Math.round(datas.Data.map(t => t.Total).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        // this.GrandTotal_C = Math.round(datas.TotalAmountMonth1).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        // this.OtherClient_C = Math.round(datas.TotalAmountMonth1 - datas.Data.map(t => t.Total).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        for(let i = 0;i<datas.Data.length;i++){
          //Delta
          // if(this.SelectedYearMonthData[i].Total == null){
          //   this.SelectedYearMonthData[i].DeltaColor = "white";
          //   this.SelectedYearMonthData[i].Delta_s = "$0";
          // }else{
          //   if(this.SelectedYearMonthData[i].NBAPriorMonth == 0){
          //     this.SelectedYearMonthData[i].DeltaColor = "white";
          //     this.SelectedYearMonthData[i].Delta_s = "$0";
          //   }else{  
          //     this.SelectedYearMonthData[i].Delta_s = Math.round(this.SelectedYearMonthData[i].Total-this.SelectedYearMonthData[i].NBAPriorMonth).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
          //     if((this.SelectedYearMonthData[i].Total-this.SelectedYearMonthData[i].NBAPriorMonth) > 0){
          //       this.SelectedYearMonthData[i].DeltaColor = "green";
          //     }else{
          //       this.SelectedYearMonthData[i].DeltaColor = "red";
          //     }
          //   }
          // }
          if(this.SelectedYearMonthData[i].Delta == 0){
            this.SelectedYearMonthData[i].DeltaColor = "white";
          }else if(this.SelectedYearMonthData[i].Delta > 0){
            this.SelectedYearMonthData[i].DeltaColor = "green";
          }else{
            this.SelectedYearMonthData[i].DeltaColor = "red";
          }
          this.SelectedYearMonthData[i].Delta_s = Math.round(this.SelectedYearMonthData[i].Delta).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
          
          //Current Month
          if(this.SelectedYearMonthData[i].Total == null){
            this.SelectedYearMonthData[i].CurrentMonth_s = "$0";
          }else{
            this.SelectedYearMonthData[i].CurrentMonth_s = Math.round(this.SelectedYearMonthData[i].Total).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
          }
          //Apac Region
          if(this.SelectedYearMonthData[i].APAC == null){
            this.SelectedYearMonthData[i].APAC_volume = "$0";
          }else{
            this.SelectedYearMonthData[i].APAC_volume = Math.round(this.SelectedYearMonthData[i].APAC).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
          }
          //EMEA Region
          if(this.SelectedYearMonthData[i].EMEA == null){
            this.SelectedYearMonthData[i].EMEA_volume = "$0";
          }else{
            this.SelectedYearMonthData[i].EMEA_volume = Math.round(this.SelectedYearMonthData[i].EMEA).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
          }
          //Latam Region
          if(this.SelectedYearMonthData[i].LATAM == null){
            this.SelectedYearMonthData[i].LATAM_volume = "$0";
          }else{
            this.SelectedYearMonthData[i].LATAM_volume = Math.round(this.SelectedYearMonthData[i].LATAM).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
          }
          //Noram Region
          if(this.SelectedYearMonthData[i].NORAM == null){
            this.SelectedYearMonthData[i].NORAM_volume = "$0";
          }else{
            this.SelectedYearMonthData[i].NORAM_volume = Math.round(this.SelectedYearMonthData[i].NORAM).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
          }
          //Prior Month ELT
          if(this.SelectedYearMonthData[i].NBAPriorMonth == null){
            this.SelectedYearMonthData[i].PriorMonthElt_s = "$0";
          }else{
            this.SelectedYearMonthData[i].PriorMonthElt_s = Math.round(this.SelectedYearMonthData[i].NBAPriorMonth).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
          }
          //Previous Year
          // if(this.SelectedYearMonthData[i].PreviousYear == null){
          //   this.SelectedYearMonthData[i].PreviousYear_s = "$0";
          // }else{
          //   this.SelectedYearMonthData[i].PreviousYear_s = Math.round(this.SelectedYearMonthData[i].PreviousYear).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
          // }
          //Total Account Volume
          if(this.SelectedYearMonthData[i].TotalAccountVolume == null){
            this.SelectedYearMonthData[i].TotalAcountVolume_s = "$0";
          }else{
            this.SelectedYearMonthData[i].TotalAcountVolume_s = Math.round(this.SelectedYearMonthData[i].TotalAccountVolume).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
          }
        }
        this.dataSource_c = this.SelectedYearMonthData;
      });
    }
  ExportData(){
    // console.log(this.data.Year + "" + this.data.Month)
    this.service.SelectedPriorMonthYearData(this.data.Year,this.data.Month).subscribe(datas =>{
      if(datas.code == 200){
        const CustomizedData = datas.Data.map(o => {
          return { 
            "Client": o.Client,
            "APAC" : o.APAC,
            "EMEA" : o.EMEA,
            "LATAM" : o.LATAM,
            "NORAM" : o.NORAM,
            "Total" : o.Total,
            "NBA Volume Reported Prior Month" : o.NBAPriorMonth,
            "Delta" : o.Delta,
            "Total Account Volume" : o.TotalAccountVolume,
            "Comments" : o.Comments,
            "Month" : o.Month,
            "Year" : o.Year,
            "Inserted On" : o.InsertedOn,
          };
        });
        this.excelService.exportAsExcelFile(CustomizedData, 'ELT Prior Month');
      }else{
        alert("Something went wrong please try again");
      }
    });
  }
  onNoClick(){
    this.dialogRef.close();
  }
  ShowComment(Dailog_Client : string,Dailog_Status : string,Dailog_Comment : string){
    this.Dailog_Client = Dailog_Client;
    this.Dailog_Status = Dailog_Status;
    this.Dailog_Comment = Dailog_Comment;
    this.openDialog();
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(EltDailog, {
      width: '400px',
      height : '200px',
      data: {Dailog_Comment: this.Dailog_Comment,Dailog_Client : this.Dailog_Client,Dailog_Status : this.Dailog_Status}
    });
    dialogRef.afterClosed().subscribe(result => {
      //this.Comment = result;
    });
  }
}