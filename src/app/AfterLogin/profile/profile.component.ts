import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DashboardServiceService } from 'src/app/dashboard-service.service';
import { UsageData } from 'src/app/Models/UsersUsageofReports';
import { UserDetails } from 'src/app/Models/UserDetails';
import { LivedashboardComponent } from '../livedashboard/livedashboard.component';
export interface ProfileDailogData {
  Name : string;
  ReportName : string;
  ReportDisplayName : string;
  UID : string;
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  LoginUID : string;
  UserDetails;
  screenWidth : number;screenHeight  : number;
  FirstName : string;LastName : string;UID : string;Email : string;
  Manager : string;Password : string;C_Password : string;JobType : string;
  NameRegex;EmailRegex;UIDRegex;ManagerRegex;
  IMPS : boolean;CTO : boolean;MarketReport : boolean;LL : boolean;StageGate : boolean;NPS : boolean;
  AutomatedCLR : boolean;AutomatedCLRedits :boolean; CycleTime : boolean;Elt : boolean;CommentEdit : boolean;
  Imps_Status : string;CTO_Status : string;Market_Status : string;CommentEdit_Status;LL_Status : string;StageGate_Status : string;
  CLR_Status : string;CLREdits_Status : string;CycleTime_Status : string;Elt_Status : string;NPS_Status : string;
  imps_icon : string;CTO_icon : string;Market_icon : string;LL_icon : string;StageGate_icon : string;CommentEdit_icon : string;
  CLR_icon : string;CLREdits_icon : string;CycleTime_icon : string;Elt_icon : string;NPS_icon : string;
  hide = true; c_hide = true;
  constructor(private service : DashboardServiceService,public dialog: MatDialog,public datepipe : DatePipe,private dashboard : LivedashboardComponent) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    window.onresize = () => {
      // set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    };
  }
  TTAutomatedCLR : string;TTCLREdits;TTELT;TTIMPS;TTCTO;TTStageGate;TTLL;TTMarket;TTMarketEditss;TTCycleTime;TTNPS;
  ngOnInit(): void {
    this.LoadData();
    this.ReportsAccess();
  }
  ReportsAccess(){
    this.dashboard.ShowSpinnerHandler(true);
    this.TTAutomatedCLR = "";
    this.service.UserReportWiseRequests(this.LoginUID).subscribe(data =>{
      if(data.code == 200){
        this.TTAutomatedCLR = "Report Name : Automated CLR" + '\n';
        this.TTCLREdits = "Report Name : Automated CLR Edits" + '\n';
        this.TTELT = "Report Name : ELT Report" + '\n';
        this.TTIMPS = "Report Name : Implementation Project Status" + '\n';
        this.TTCTO = "Report Name : Critical Task Oerdue" + '\n';
        this.TTLL = "Report Name : Lessons Learnt" + '\n';
        this.TTStageGate = "Report Name : Stage Gate" + '\n';
        this.TTMarket = "Report Name : Implementation Market Report" + '\n';
        this.TTMarketEditss = "Report Name : Market Delta Comments Edits" + '\n';
        this.TTCycleTime = "Report Name : Cycle Time Report" + '\n';
        this.TTNPS = "Report Name : NPS" + '\n';
        if(data.Data[0].IMPS == true){
          this.IMPS = true;
          if(data.Data[0].IMPSStatus == "Approved"){
            this.TTIMPS += "Status : Approved"+'\n';
            this.TTIMPS += "Requested On : " + this.datepipe.transform(data.Data[0].IMPSRequesstedOn, "yyyy-MMM-dd")+'\n';
            this.TTIMPS += "Approved By : " + data.Data[0].IMPSApporvedBy+'\n';
            this.TTIMPS += "Approved On : " + this.datepipe.transform(data.Data[0].IMPSApporvedOn, "yyyy-MMM-dd")+'\n';
            this.imps_icon = "done_all";
          }else if(data.Data[0].IMPSStatus == "NoRequests"){
            this.TTIMPS += "Status : Access Granted"+'\n';
            this.imps_icon = "offline_pin";
          }else{
            this.imps_icon = "cancel";
          }
        }else{
          if(data.Data[0].IMPSStatus == "Requested"){
            this.TTIMPS += "Status : Requested"+'\n';
            this.TTIMPS += "Requested On : " + this.datepipe.transform(data.Data[0].IMPSRequesstedOn, "yyyy-MMM-dd")+'\n';
            this.imps_icon = "pending_actions";
          }else if(data.Data[0].IMPSStatus == "NoRequests"){
            this.TTIMPS += "Status : You can request for access"+'\n';
            this.imps_icon = "cancel";
          }else if(data.Data[0].IMPSStatus == "Declined"){
            this.TTIMPS += "Status : Declined"+'\n';
            this.TTIMPS += "Requested On : " + this.datepipe.transform(data.Data[0].IMPSRequesstedOn, "yyyy-MMM-dd")+'\n';
            this.TTIMPS += "Declined By : " + data.Data[0].IMPSApporvedBy+'\n';
            this.TTIMPS += "Declined On : " + this.datepipe.transform(data.Data[0].IMPSApporvedOn, "yyyy-MMM-dd")+'\n';
            this.imps_icon = "not_interested";
          }else{
            this.imps_icon = "";
          }
          this.IMPS = false;
        }
        if(data.Data[0].CTO == true){
          this.CTO = true;
          if(data.Data[0].CTOStatus == "Approved"){
            this.TTCTO += "Status : Approved"+'\n';
            this.TTCTO += "Requested On : " + this.datepipe.transform(data.Data[0].CTORequesstedOn, "yyyy-MMM-dd")+'\n';
            this.TTCTO += "Approved By : " + data.Data[0].CTOApporvedBy+'\n';
            this.TTCTO += "Approved On : " + this.datepipe.transform(data.Data[0].CTOApporvedOn, "yyyy-MMM-dd")+'\n';
            this.CTO_icon = "done_all";
          }else if(data.Data[0].CTOStatus == "NoRequests"){
            this.TTCTO += "Status : Access Granted"+'\n';
            this.CTO_icon = "offline_pin";
          }else{
            this.CTO_icon = "cancel";
          }
        }else{
          if(data.Data[0].CTOStatus == "Requested"){
            this.TTCTO += "Status : Requested"+'\n';
            this.TTCTO += "Requested On : " + this.datepipe.transform(data.Data[0].CTORequesstedOn, "yyyy-MMM-dd")+'\n';
            this.CTO_icon = "pending_actions";
          }else if(data.Data[0].CTOStatus == "NoRequests"){
            this.TTCTO += "Status : You can request for access"+'\n';
            this.CTO_icon = "cancel";
          }else if(data.Data[0].CTOStatus == "Declined"){
            this.TTCTO += "Status : Declined"+'\n';
            this.TTCTO += "Requested On : " + this.datepipe.transform(data.Data[0].CTORequesstedOn, "yyyy-MMM-dd")+'\n';
            this.TTCTO += "Declined By : " + data.Data[0].CTOApporvedBy+'\n';
            this.TTCTO += "Declined On : " + this.datepipe.transform(data.Data[0].CTOApporvedOn, "yyyy-MMM-dd")+'\n';
            this.CTO_icon = "not_interested";
          }else{
            this.CTO_icon = "";
          }
          this.CTO = false;
        }
        if(data.Data[0].MarketCommentsEdit == true){
          this.CommentEdit = true;
          if(data.Data[0].CommentEditStatus == "Approved"){
            this.TTMarketEditss += "Status : Approved"+'\n';
            this.TTMarketEditss += "Requested On : " + this.datepipe.transform(data.Data[0].CommentEditRequesstedOn, "yyyy-MMM-dd")+'\n';
            this.TTMarketEditss += "Approved By : " + data.Data[0].CommentEditApporvedBy+'\n';
            this.TTMarketEditss += "Approved On : " + this.datepipe.transform(data.Data[0].CommentEditApporvedOn, "yyyy-MMM-dd")+'\n';
            this.CommentEdit_icon = "done_all";
          }else if(data.Data[0].CommentEditStatus == "NoRequests"){
            this.TTMarketEditss += "Status : Access Granted"+'\n';
            this.CommentEdit_icon = "offline_pin";
          }else{
            this.CommentEdit_icon = "cancel";
          }
        }else{
          if(data.Data[0].CommentEditStatus == "Requested"){
            this.TTMarketEditss += "Status : Requested"+'\n';
            this.TTMarketEditss += "Requested On : " + this.datepipe.transform(data.Data[0].CommentEditRequesstedOn, "yyyy-MMM-dd")+'\n';
            this.CommentEdit_icon = "pending_actions";
          }else if(data.Data[0].CommentEditStatus == "NoRequests"){
            this.TTMarketEditss += "Status : You can request for access"+'\n';
            this.CommentEdit_icon = "cancel";
          }else if(data.Data[0].CommentEditStatus == "Declined"){
            this.TTMarketEditss += "Status : Declined"+'\n';
            this.TTMarketEditss += "Requested On : " + this.datepipe.transform(data.Data[0].CommentEditRequesstedOn, "yyyy-MMM-dd")+'\n';
            this.TTMarketEditss += "Declined By : " + data.Data[0].CommentEditApporvedBy+'\n';
            this.TTMarketEditss += "Declined On : " + this.datepipe.transform(data.Data[0].CommentEditApporvedOn, "yyyy-MMM-dd")+'\n';
            this.CommentEdit_icon = "not_interested";
          }else{
            this.CommentEdit_icon = "";
          }
          this.CommentEdit = false;
        }
        if(data.Data[0].LessonsLearnt == true){
          this.LL = true;
          if(data.Data[0].LLStatus == "Approved"){
            this.TTLL += "Status : Approved"+'\n';
            this.TTLL += "Requested On : " + this.datepipe.transform(data.Data[0].LLRequesstedOn, "yyyy-MMM-dd")+'\n';
            this.TTLL += "Approved By : " + data.Data[0].LLApporvedBy+'\n';
            this.TTLL += "Approved On : " + this.datepipe.transform(data.Data[0].LLApporvedOn, "yyyy-MMM-dd")+'\n';
            this.LL_icon = "done_all";
          }else if(data.Data[0].LLStatus == "NoRequests"){
            this.TTLL += "Status : Access Granted"+'\n';
            this.LL_icon = "offline_pin";
          }else{
            this.LL_icon = "cancel";
          }
        }else{
          if(data.Data[0].LLStatus == "Requested"){
            this.TTLL += "Status : Requested"+'\n';
            this.TTLL += "Requested On : " + this.datepipe.transform(data.Data[0].LLRequesstedOn, "yyyy-MMM-dd")+'\n';
            this.LL_icon = "pending_actions";
          }else if(data.Data[0].LLStatus == "NoRequests"){
            this.TTLL += "Status : You can request for access"+'\n';
            this.LL_icon = "cancel";
          }else if(data.Data[0].LLStatus == "Declined"){
            this.TTLL += "Status : Declined"+'\n';
            this.TTLL += "Requested On : " + this.datepipe.transform(data.Data[0].LLRequesstedOn, "yyyy-MMM-dd")+'\n';
            this.TTLL += "Declined By : " + data.Data[0].LLApporvedBy+'\n';
            this.TTLL += "Declined On : " + this.datepipe.transform(data.Data[0].LLApporvedOn, "yyyy-MMM-dd")+'\n';
            this.LL_icon = "not_interested";
          }else{
            this.LL_icon = "";
          }
          this.LL = false;
        }
        if(data.Data[0].StageGate == true){
          this.StageGate = true;
          if(data.Data[0].StageGateStatus == "Approved"){
            this.TTStageGate += "Status : Approved"+'\n';
            this.TTStageGate += "Requested On : " + this.datepipe.transform(data.Data[0].StageGateRequesstedOn, "yyyy-MMM-dd")+'\n';
            this.TTStageGate += "Approved By : " + data.Data[0].StageGateApporvedBy+'\n';
            this.TTStageGate += "Approved On : " + this.datepipe.transform(data.Data[0].StageGateApporvedOn, "yyyy-MMM-dd")+'\n';
            this.StageGate_icon = "done_all";
          }else if(data.Data[0].StageGateStatus == "NoRequests"){
            this.TTStageGate += "Status : Access Granted"+'\n';
            this.StageGate_icon = "offline_pin";
          }else{
            this.StageGate_icon = "cancel";
          }
        }else{
          if(data.Data[0].StageGateStatus == "Requested"){
            this.TTStageGate += "Status : Requested"+'\n';
            this.TTStageGate += "Requested On : " + this.datepipe.transform(data.Data[0].StageGateRequesstedOn, "yyyy-MMM-dd")+'\n';
            this.StageGate_icon = "pending_actions";
          }else if(data.Data[0].StageGateStatus == "NoRequests"){
            this.TTStageGate += "Status : You can request for access"+'\n';
            this.StageGate_icon = "cancel";
          }else if(data.Data[0].StageGateStatus == "Declined"){
            this.TTStageGate += "Status : Declined"+'\n';
            this.TTStageGate += "Requested On : " + this.datepipe.transform(data.Data[0].StageGateRequesstedOn, "yyyy-MMM-dd")+'\n';
            this.TTStageGate += "Declined By : " + data.Data[0].StageGateApporvedBy+'\n';
            this.TTStageGate += "Declined On : " + this.datepipe.transform(data.Data[0].StageGateApporvedOn, "yyyy-MMM-dd")+'\n';
            this.StageGate_icon = "not_interested";
          }else{
            this.StageGate_icon = "";
          }
          this.StageGate = false;
        }
        if(data.Data[0].AutomatedCLR == true){
          this.AutomatedCLR = true;
          if(data.Data[0].AutomatedCLRStatus == "Approved"){
            this.TTAutomatedCLR += "Status : Approved"+'\n';
            this.TTAutomatedCLR += "Requested On : " + this.datepipe.transform(data.Data[0].AutomatedCLRRequesstedOn, "yyyy-MMM-dd")+'\n';
            this.TTAutomatedCLR += "Approved By : " + data.Data[0].AutomatedCLRApporvedBy+'\n';
            this.TTAutomatedCLR += "Approved On : " + this.datepipe.transform(data.Data[0].AutomatedCLRApporvedOn, "yyyy-MMM-dd")+'\n';
            this.CLR_icon = "done_all";
          }else if(data.Data[0].AutomatedCLRStatus == "NoRequests"){
            this.TTAutomatedCLR += "Status : Access Granted"+'\n';
            this.CLR_icon = "offline_pin";
          }else{
            this.CLR_icon = "cancel";
          }
        }else{
          if(data.Data[0].AutomatedCLRStatus == "Requested"){
            this.TTAutomatedCLR += "Status : Requested"+'\n';
            this.TTAutomatedCLR += "Requested On : " + this.datepipe.transform(data.Data[0].AutomatedCLRRequesstedOn, "yyyy-MMM-dd")+'\n';
            this.CLR_icon = "pending_actions";
          }else if(data.Data[0].AutomatedCLRStatus == "NoRequests"){
            this.TTAutomatedCLR += "Status : You can request for access"+'\n';
            this.CLR_icon = "cancel";
          }else if(data.Data[0].AutomatedCLRStatus == "Declined"){
            this.TTAutomatedCLR += "Status : Declined"+'\n';
            this.TTAutomatedCLR += "Requested On : " + this.datepipe.transform(data.Data[0].AutomatedCLRRequesstedOn, "yyyy-MMM-dd")+'\n';
            this.TTAutomatedCLR += "Declined By : " + data.Data[0].AutomatedCLRApporvedBy+'\n';
            this.TTAutomatedCLR += "Declined On : " + this.datepipe.transform(data.Data[0].AutomatedCLRApporvedOn, "yyyy-MMM-dd")+'\n';
            this.CLR_icon = "not_interested";
          }else{
            this.CLR_icon = "";
          }
          this.AutomatedCLR = false;
        }
        if(data.Data[0].MarketReport == true){
          this.MarketReport = true;
          if(data.Data[0].MarketReportStatus == "Approved"){
            this.TTMarket += "Status : Approved"+'\n';
            this.TTMarket += "Requested On : " + this.datepipe.transform(data.Data[0].MarketReportRequesstedOn, "yyyy-MMM-dd")+'\n';
            this.TTMarket += "Approved By : " + data.Data[0].MarketReportApporvedBy+'\n';
            this.TTMarket += "Approved On : " + this.datepipe.transform(data.Data[0].MarketReportApporvedOn, "yyyy-MMM-dd")+'\n';
            this.Market_icon = "done_all";
          }else if(data.Data[0].MarketReportStatus == "NoRequests"){
            this.TTMarket += "Status : Access Granted"+'\n';
            this.Market_icon = "offline_pin";
          }else{
            this.Market_icon = "cancel";
          }
        }else{
          if(data.Data[0].MarketReportStatus == "Requested"){
            this.TTMarket += "Status : Requested"+'\n';
            this.TTMarket += "Requested On : " + this.datepipe.transform(data.Data[0].MarketReportRequesstedOn, "yyyy-MMM-dd")+'\n';
            this.Market_icon = "pending_actions";
          }else if(data.Data[0].MarketReportStatus == "NoRequests"){
            this.TTMarket += "Status : You can request for access"+'\n';
            this.Market_icon = "cancel";
          }else if(data.Data[0].MarketReportStatus == "Declined"){
            this.TTMarket += "Status : Declined"+'\n';
            this.TTMarket += "Requested On : " + this.datepipe.transform(data.Data[0].MarketReportRequesstedOn, "yyyy-MMM-dd")+'\n';
            this.TTMarket += "Declined By : " + data.Data[0].MarketReportApporvedBy+'\n';
            this.TTMarket += "Declined On : " + this.datepipe.transform(data.Data[0].MarketReportApporvedOn, "yyyy-MMM-dd")+'\n';
            this.Market_icon = "not_interested";
          }else{
            this.Market_icon = "";
          }
          this.MarketReport = false;
        }
        if(data.Data[0].CLREdits == true){
          this.AutomatedCLRedits = true;
          if(data.Data[0].CLREditsStatus == "Approved"){
            this.TTCLREdits += "Status : Approved"+'\n';
            this.TTCLREdits += "Requested On : " + this.datepipe.transform(data.Data[0].CLREditsRequesstedOn, "yyyy-MMM-dd")+'\n';
            this.TTCLREdits += "Approved By : " + data.Data[0].CLREditsApporvedBy+'\n';
            this.TTCLREdits += "Approved On : " + this.datepipe.transform(data.Data[0].CLREditsApporvedOn, "yyyy-MMM-dd")+'\n';
            this.CLREdits_icon = "done_all";
          }else if(data.Data[0].CLREditsStatus == "NoRequests"){
            this.TTCLREdits += "Status : Access Granted"+'\n';
            this.CLREdits_icon = "offline_pin";
          }else{
            this.CLREdits_icon = "cancel";
          }
        }else{
          if(data.Data[0].CLREditsStatus == "Requested"){
            this.TTCLREdits += "Status : Requested"+'\n';
            this.TTCLREdits += "Requested On : " + this.datepipe.transform(data.Data[0].CLREditsRequesstedOn, "yyyy-MMM-dd")+'\n';
            this.CLREdits_icon = "pending_actions";
          }else if(data.Data[0].CLREditsStatus == "NoRequests"){
            this.TTCLREdits += "Status : You can request for access"+'\n';
            this.CLREdits_icon = "cancel";
          }else if(data.Data[0].CLREditsStatus == "Declined"){
            this.TTCLREdits += "Status : Declined"+'\n';
            this.TTCLREdits += "Requested On : " + this.datepipe.transform(data.Data[0].CLREditsRequesstedOn, "yyyy-MMM-dd")+'\n';
            this.TTCLREdits += "Declined By : " + data.Data[0].CLREditsApporvedBy+'\n';
            this.TTCLREdits += "Declined On : " + this.datepipe.transform(data.Data[0].CLREditsApporvedOn, "yyyy-MMM-dd")+'\n';
            this.CLREdits_icon = "not_interested";
          }else{
            this.CLREdits_icon = "";
          }
          this.AutomatedCLRedits = false;
        }
        if(data.Data[0].CycleTime == true){
          this.CycleTime = true;
          if(data.Data[0].CycleTimeStatus == "Approved"){
            this.TTCycleTime += "Status : Approved"+'\n';
            this.TTCycleTime += "Requested On : " + this.datepipe.transform(data.Data[0].CycleTimeRequesstedOn, "yyyy-MMM-dd")+'\n';
            this.TTCycleTime += "Approved By : " + data.Data[0].CycleTimeApporvedBy+'\n';
            this.TTCycleTime += "Approved On : " + this.datepipe.transform(data.Data[0].CycleTimeApporvedOn, "yyyy-MMM-dd")+'\n';
            this.CycleTime_icon = "done_all";
          }else if(data.Data[0].CycleTimeStatus == "NoRequests"){
            this.TTCycleTime += "Status : Access Granted"+'\n';
            this.CycleTime_icon = "offline_pin";
          }else{
            this.CycleTime_icon = "cancel";
          }
        }else{
          if(data.Data[0].CycleTimeStatus == "Requested"){
            this.TTCycleTime += "Status : Requested"+'\n';
            this.TTCycleTime += "Requested On : " + this.datepipe.transform(data.Data[0].CycleTimeRequesstedOn, "yyyy-MMM-dd")+'\n';
            this.CycleTime_icon = "pending_actions";
          }else if(data.Data[0].CycleTimeStatus == "NoRequests"){
            this.TTCycleTime += "Status : You can request for access"+'\n';
            this.CycleTime_icon = "cancel";
          }else if(data.Data[0].CycleTimeStatus == "Declined"){
            this.TTCycleTime += "Status : Declined"+'\n';
            this.TTCycleTime += "Requested On : " + this.datepipe.transform(data.Data[0].CycleTimeRequesstedOn, "yyyy-MMM-dd")+'\n';
            this.TTCycleTime += "Declined By : " + data.Data[0].CycleTimeApporvedBy+'\n';
            this.TTCycleTime += "Declined On : " + this.datepipe.transform(data.Data[0].CycleTimeApporvedOn, "yyyy-MMM-dd")+'\n';
            this.CycleTime_icon = "not_interested";
          }else{
            this.CycleTime_icon = "";
          }
          this.CycleTime = false;
        }
        if(data.Data[0].ELTReport == true){
          this.Elt = true;
          if(data.Data[0].ELTReportStatus == "Approved"){
            this.TTELT += "Status : Approved"+'\n';
            this.TTELT += "Requested On : " + this.datepipe.transform(data.Data[0].ELTReportRequesstedOn, "yyyy-MMM-dd")+'\n';
            this.TTELT += "Approved By : " + data.Data[0].ELTReportApporvedBy+'\n';
            this.TTELT += "Approved On : " + this.datepipe.transform(data.Data[0].ELTReportApporvedOn, "yyyy-MMM-dd")+'\n';
            this.Elt_icon = "done_all";
          }else if(data.Data[0].ELTReportStatus == "NoRequests"){
            this.TTELT += "Status : Access Granted"+'\n';
            this.Elt_icon = "offline_pin";
          }else{
            this.Elt_icon = "cancel";
          }
        }else{
          if(data.Data[0].ELTReportStatus == "Requested"){
            this.TTELT += "Status : Requested"+'\n';
            this.TTELT += "Requested On : " + this.datepipe.transform(data.Data[0].ELTReportRequesstedOn, "yyyy-MMM-dd")+'\n';
            this.Elt_icon = "pending_actions";
          }else if(data.Data[0].ELTReportStatus == "NoRequests"){
            this.TTELT += "Status : You can request for access"+'\n';
            this.Elt_icon = "cancel";
          }else if(data.Data[0].ELTReportStatus == "Declined"){
            this.TTELT += "Status : Declined"+'\n';
            this.TTELT += "Requested On : " + this.datepipe.transform(data.Data[0].ELTReportRequesstedOn, "yyyy-MMM-dd")+'\n';
            this.TTELT += "Declined By : " + data.Data[0].ELTReportApporvedBy+'\n';
            this.TTELT += "Declined On : " + this.datepipe.transform(data.Data[0].ELTReportApporvedOn, "yyyy-MMM-dd")+'\n';
            this.Elt_icon = "not_interested";
          }else{
            this.Elt_icon = "";
          }
          this.Elt = false;
        }
        if(data.Data[0].NPS == true){
          this.NPS = true;
          if(data.Data[0].NPSStatus == "Approved"){
            this.TTNPS += "Status : Approved"+'\n';
            this.TTNPS += "Requested On : " + this.datepipe.transform(data.Data[0].NPSRequesstedOn, "yyyy-MMM-dd")+'\n';
            this.TTNPS += "Approved By : " + data.Data[0].NPSApporvedBy+'\n';
            this.TTNPS += "Approved On : " + this.datepipe.transform(data.Data[0].NPSApporvedOn, "yyyy-MMM-dd")+'\n';
            this.NPS_icon = "done_all";
          }else if(data.Data[0].NPSStatus == "NoRequests"){
            this.TTNPS += "Status : Access Granted"+'\n';
            this.NPS_icon = "offline_pin";
          }else{
            this.NPS_icon = "cancel";
          }
        }else{
          if(data.Data[0].NPSStatus == "Requested"){
            this.TTNPS += "Status : Requested"+'\n';
            this.TTNPS += "Requested On : " + this.datepipe.transform(data.Data[0].NPSRequesstedOn, "yyyy-MMM-dd")+'\n';
            this.NPS_icon = "pending_actions";
          }else if(data.Data[0].NPSStatus == "NoRequests"){
            this.TTNPS += "Status : You can request for access"+'\n';
            this.NPS_icon = "cancel";
          }else if(data.Data[0].NPSStatus == "Declined"){
            this.TTNPS += "Status : Declined"+'\n';
            this.TTNPS += "Requested On : " + this.datepipe.transform(data.Data[0].NPSRequesstedOn, "yyyy-MMM-dd")+'\n';
            this.TTNPS += "Declined By : " + data.Data[0].NPSApporvedBy+'\n';
            this.TTNPS += "Declined On : " + this.datepipe.transform(data.Data[0].NPSApporvedOn, "yyyy-MMM-dd")+'\n';
            this.NPS_icon = "not_interested";
          }else{
            this.NPS_icon = "";
          }
          this.NPS = false;
        }
        this.Imps_Status = data.Data[0].IMPSStatus;
        this.CTO_Status = data.Data[0].CTOStatus;
        this.Market_Status = data.Data[0].MarketReportStatus;
        this.LL_Status = data.Data[0].LLStatus;
        this.StageGate_Status = data.Data[0].StageGateStatus;
        this.CLR_Status = data.Data[0].AutomatedCLRStatus;
        this.CLREdits_Status = data.Data[0].CLREditsStatus;
        this.CycleTime_Status = data.Data[0].CycleTimeStatus;
        this.Elt_Status = data.Data[0].ELTReportStatus;
        this.CommentEdit_Status = data.Data[0].CommentEditStatus;
        this.NPS_Status = data.Data[0].NPSStatus;
      }else{
        alert("Something Went wrong");
      }
      this.dashboard.ShowSpinnerHandler(false);
    })
  }
  openDialog(ReportName): void {
    var Report_Name;
    if(ReportName == "MarketReport"){
      Report_Name = "Implementation Market Report";
    }else if(ReportName == "IMPS"){
      Report_Name = "Implementation Project Status Report";
    }else if(ReportName == "LL"){
      Report_Name = "Lessons Learnt Report";
    }else if(ReportName == "StageGate"){
      Report_Name = "Stage Gate Report";
    }else if(ReportName == "CTO"){
      Report_Name = "Critical Task Overdue Report";
    }else if(ReportName == "ELTReport"){
      Report_Name = "ELT Report";
    }else if(ReportName == "CycleTime"){
      Report_Name = "Cycle Time Report";
    }else if(ReportName == "AutomatedCLREdits"){
      Report_Name = "Editing Automated CLR";
    }else if(ReportName == "AutomatedCLR"){
      Report_Name = "Automated CLR";
    }else if(ReportName == "MarketCommentEdits"){
      Report_Name = "Editing Implementation Market Comments";
    }else if(ReportName == "NPS"){
      Report_Name = "NPS"
    }else{
      Report_Name = ReportName
    }
    const dialogRef = this.dialog.open(ProfileDialog, {
      width: '600px',
      data: {
        Name : localStorage.getItem("Username"),
        ReportName : ReportName,
        ReportDisplayName : Report_Name,
        UID : localStorage.getItem("UID"),
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.ReportsAccess();
    });
  }
  RequestAccess(ReportName : string){
    switch(ReportName){
      case "AutomatedCLR" : {
        if(this.AutomatedCLR == true){
        }else{
          if(this.CLR_Status == "Requested"){
            alert("You already Requested for this Report");
          }else{
            this.openDialog(ReportName);
          }
        }
      }
      break;
      case "AutomatedCLREdits" : {
        if(this.AutomatedCLRedits == true){
        }else{
          if(this.CLREdits_Status == "Requested"){
            alert("You already Requested for this Report");
          }else{
            this.openDialog(ReportName);
          }
        }
      }
      break;
      case "MarketReport" : {
        if(this.MarketReport == true){
        }else{
          if(this.Market_Status == "Requested"){
            alert("You already Requested for this Report");
          }else{
            this.openDialog(ReportName);
          }
        }
      }
      break;
      case "CycleTime" : {
        if(this.CycleTime == true){
        }else{
          if(this.CycleTime_Status == "Requested"){
            alert("You already Requested for this Report");
          }else{
            this.openDialog(ReportName);
          }
        }
      }
      break;
      case "ELTReport" : {
        if(this.Elt == true){
        }else{
          if(this.Elt_Status == "Requested"){
            alert("You already Requested for this Report");
          }else{
            this.openDialog(ReportName);
          }
        }
      }
      break;
      case "IMPS" : {
        if(this.IMPS == true){
        }else{
          if(this.Imps_Status == "Requested"){
            alert("You already Requested for this Report");
          }else{
            this.openDialog(ReportName);
          }
        }
      }
      break;
      case "CTO" : {
        if(this.CTO == true){
        }else{
          if(this.CTO_Status == "Requested"){
            alert("You already Requested for this Report");
          }else{
            this.openDialog(ReportName);
          }
        }
      }
      break;
      case "LL" : {
        if(this.LL == true){
        }else{
          if(this.LL_Status == "Requested"){
            alert("You already Requested for this Report");
          }else{
            this.openDialog(ReportName);
          }
        }
      }
      break;
      case "StageGate" : {
        if(this.StageGate == true){
        }else{
          if(this.StageGate_Status == "Requested"){
            alert("You already Requested for this Report");
          }else{
            this.openDialog(ReportName);
          }
        }
      }
      break;
      case "MarketCommentEdits" : {
        if(this.CommentEdit == true){
        }else{
          if(this.CommentEdit_Status == "Requested"){
            alert("You already Requested for this Report");
          }else{
            this.openDialog(ReportName);
          }
        }
      }
      break;
      case "NPS" : {
        if(this.NPS == true){
        }else{
          if(this.NPS_Status == "Requested"){
            alert("You already Requested for this Report");
          }else{
            this.openDialog(ReportName);
          }
        }
      }
      break;
    }
  }
  LoadData(){
    this.LoginUID = localStorage.getItem("UID");
    this.dashboard.ShowSpinnerHandler(true);
    this.service.UserDetails(this.LoginUID).subscribe(data =>{
      if(data.code == 200){
        this.UserDetails = data;
        this.UID = data.UID;
        this.FirstName = data.FirstName;
        this.LastName = data.LastName;
        this.Email = data.EmailId;
        this.Password = data.Password;
        this.JobType = data.JobType;
        this.C_Password = data.Password;
        this.Manager = data.Manager;
        this.dashboard.ShowSpinnerHandler(false);
      }else{
        alert("Something went wrong");
        this.dashboard.ShowSpinnerHandler(false);
      }
    })
  }
  Update(){
    if(this.UID == null || this.FirstName == null || this.LastName == null || this.Email == null || this.Manager == null || this.Password == null || this.C_Password == null || this.JobType == null){
      alert("Please Fill all Fields");
    }else{
      this.NameRegex = new RegExp('^[A-Za-z]{3,20}$');
      this.EmailRegex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$');
      this.UIDRegex = new RegExp('^[A-Z0-9]{7}$');
      this.ManagerRegex = new RegExp('^[A-Za-z]+\\ [a-zA-Z]{3,25}$');
      if(this.NameRegex.test(this.FirstName)){
        if(this.NameRegex.test(this.LastName)){
          if(this.UIDRegex.test(this.UID)){
            if(this.EmailRegex.test(this.Email)){
              if(this.ManagerRegex.test(this.Manager)){
                if(this.Password.length > 4){
                  if(this.Password == this.C_Password){
                    this.dashboard.ShowSpinnerHandler(true);
                    this.service.UpdateDetails(this.UID,this.FirstName,this.LastName,this.Email,this.Manager,this.Password,this.JobType).subscribe(data =>{
                      if(data.code == 200){
                        alert("Updated Succesfully");
                        this.service.UsersUsageofReports(this.LoginUID,"Profile","Update").subscribe(data =>{
                        })
                        this.dashboard.ShowSpinnerHandler(false);
                        this.LoadData();
                      }else{
                        alert(data.message);
                        this.dashboard.ShowSpinnerHandler(false);
                      }
                    });
                  }else{
                    alert("Please make sure your passwords Match!");
                  }
                }else{
                  alert("Password Should be atleast 5 Characters");
                }
              }else{
                alert("In-valid Manager Name, Make sure it is (Firstname Lastname)");
              }
            }else{
              alert("In-valid Email");
            }
          }else{
            alert("In-valid UID");
          }
        }else{
          alert("Not a valid Last Name");
        }
      }else{
        alert("Not a valid First Name");
      }
    }
  }
}
@Component({
  selector: 'app-profiledailog',
  templateUrl: './profiledailog.component.html'
  // styleUrls: ['./profiledailog.component.css']
})
export class ProfileDialog {
  constructor(
    public datepipe : DatePipe,
    public service : DashboardServiceService,
    public dialogRef: MatDialogRef<ProfileDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ProfileDailogData) {
    }
  ngOnInit() {
  }
  onYesClick(){
    this.service.RequestAccessTicket(this.data.UID,this.data.ReportName,"Requested").subscribe(data=>{
      if(data.code == 200){
        alert("Requested for Access");
        this.dialogRef.close();
      }else{
        alert("Failed to request,Please try again later");
        this.dialogRef.close();
      }
    })
  }
  onNoClick(){
    this.dialogRef.close();
  }
}