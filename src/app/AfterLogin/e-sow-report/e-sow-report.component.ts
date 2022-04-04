import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DashboardServiceService } from '../../dashboard-service.service';
import { eSOWData } from '../../Models/eSOWResponse';
import { DatePipe } from '@angular/common';
import { ProspectType, SalesLeaderTypeAndTypeOfBid } from '../../Models/eSOWFilters';
import { DashboardComponent } from '../dashboard/dashboard.component';

export interface AccountAndVolumes {
  Leftheaders: string;
  PerEssential : string;
  Essential : string;
  Configurable : string;
  Customizable : string;
  Total : string;
}
export interface WinRate {
  Leftheaders: string;
  Essential : string;
  Configurable : string;
  Customizable : string;
  Total : string;
}
export interface WinRateWOVerbalAward_AV {
  Leftheaders: string;
  Won : string;
  VerbalAward : string;
  Lost : string;
  PerWin : string;
}
export interface InProgress {
  Leftheaders: string;
  Accounts : string;
  Spend : string;
  AvgDaysSinceStart : string;
}
@Component({
  selector: 'app-e-sow-report',
  templateUrl: './e-sow-report.component.html',
  styleUrls: ['./e-sow-report.component.css']
  // encapsulation: ViewEncapsulation.None
})
export class ESowReportComponent implements OnInit {
  displayedColumnsSSA : string[] = ['Leftheaders','PerEssential','Essential','Configurable','Customizable','Total'];
  displayedColumnsWRAV : string[] = ['Leftheaders','Essential','Configurable','Customizable','Total'];
  displayedColumnsWOV_AV : string[] = ['Leftheaders', 'Won','VerbalAward','Lost','PerWin'];
  displayedColumnsIP : string[] = ['Leftheaders', 'Accounts','Spend'];//,'AvgDaysSinceStart'
  displayedColumnsYTD : string[] = ['Dsd_Lead','TotalAccounts','TVolumes','WonAccounts','WVolumes','LostAccounts','LVolumes','WinPerAccounts','WinPerVolume'];
  dataSource_SSA;
  dataSource_DSDLA;
  dataSource_TA;
  dataSource_SSV;
  dataSource_DSDLV;
  dataSource_TV;
  dataSource_WRA;
  dataSource_WRV;
  dataSource_WOV_A;
  dataSource_WOV_V;
  dataSource_IP;
  dataSource_YTD;
  dataSource_DD_NBR;
  dataSource_DD_NB;
  dataSource_DD_R;
  Apply_disable : boolean;
  Accounts_Volumes : eSOWData[];
  WOVerbalAward_AV : eSOWData[];
  ytdActivity : eSOWData[];
  DavidData : eSOWData[];
  start_date : Date;
  end_date : Date;
  start_dateDM : Date;
  start_dateET : Date;
  SelectedProspect_Type : any; SelectedSalesLeaderTypeAndTypeOfBid : any;
  masterProspect_Type : boolean; masterSalesLeaderTypeAndTypeOfBid : boolean;
  SalesLeaderTypeAndTypeOfBidList : SalesLeaderTypeAndTypeOfBid[];
  SalesLeaderTypeAndTypeOfBidListSelected : SalesLeaderTypeAndTypeOfBid[];
  Prospect_TypeList : ProspectType[];
  Prospect_TypeListSelected : ProspectType[];
  constructor(private service : DashboardServiceService,
    public datepipe : DatePipe,
    private dashboard : DashboardComponent) { }
  ngOnInit() {
    this.dashboard.ShowSpinnerHandler(true);
    this.service.EssentialTablesFilters().subscribe(data => {
      this.Prospect_TypeList = data.ProspectType;
      this.masterProspect_Type = true;
      this.getSelectedProspectType();
      this.SalesLeaderTypeAndTypeOfBidList = data.SalesLeaderTypeAndTypeOfBid;
      this.masterSalesLeaderTypeAndTypeOfBid = true;
      this.getSelectedSalesLeaderTypeAndTypeOfBid();
      this.Apply_disable = false;
      this.dashboard.ShowSpinnerHandler(false);
    });
  }
  GetEssentialTables(){
    this.dashboard.ShowSpinnerHandler(true);
    if(this.SelectedProspect_Type == null || this.SelectedSalesLeaderTypeAndTypeOfBid == null || this.start_dateET == null){
      alert("Please select the all Fields");
      this.Apply_disable = false;
      this.dashboard.ShowSpinnerHandler(false);
    }else{
      this.Apply_disable = true;
      this.service.EssentialTables(this.SelectedSalesLeaderTypeAndTypeOfBid,this.SelectedProspect_Type,this.start_dateET.toLocaleDateString()+"").subscribe(data => {
        this.Accounts_Volumes = data.Data;
        let SSAccountsdata : AccountAndVolumes[] = [
          {
            Leftheaders : 'Total',
            PerEssential : ((this.Accounts_Volumes[0].SSATotal/((data.Data.map(t => t.SSATotal).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : this.Accounts_Volumes[0].SSATotal+'',
            Configurable : this.Accounts_Volumes[2].SSATotal+'',
            Customizable : this.Accounts_Volumes[1].SSATotal+'',
            Total : data.Data.map(t => t.SSATotal).reduce((acc,value) => acc + value,0)+'',
          },
          {
            Leftheaders : 'Won',
            PerEssential : ((this.Accounts_Volumes[0].SSAWon/((data.Data.map(t => t.SSAWon).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : this.Accounts_Volumes[0].SSAWon+'',
            Configurable : this.Accounts_Volumes[2].SSAWon+'',
            Customizable : this.Accounts_Volumes[1].SSAWon+'',
            Total : data.Data.map(t => t.SSAWon).reduce((acc,value) => acc + value,0)+'',
          },
          {
            Leftheaders : 'Lost',
            PerEssential : ((this.Accounts_Volumes[0].SSALost/((data.Data.map(t => t.SSALost).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : this.Accounts_Volumes[0].SSALost+'',
            Configurable : this.Accounts_Volumes[2].SSALost+'',
            Customizable : this.Accounts_Volumes[1].SSALost+'',
            Total : data.Data.map(t => t.SSALost).reduce((acc,value) => acc + value,0)+'',
          },
          {
            Leftheaders : 'InProgress',
            PerEssential : ((this.Accounts_Volumes[0].SSAInPRogress/((data.Data.map(t => t.SSAInPRogress).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : this.Accounts_Volumes[0].SSAInPRogress+'',
            Configurable : this.Accounts_Volumes[2].SSAInPRogress+'',
            Customizable : this.Accounts_Volumes[1].SSAInPRogress+'',
            Total : data.Data.map(t => t.SSAInPRogress).reduce((acc,value) => acc + value,0)+'',
          }
        ];
        this.dataSource_SSA = SSAccountsdata;
        let DSDLAccountsdata : AccountAndVolumes[] = [
          {
            Leftheaders : 'Total',
            PerEssential : ((this.Accounts_Volumes[0].DSDLATotal/((data.Data.map(t => t.DSDLATotal).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : this.Accounts_Volumes[0].DSDLATotal+'',
            Configurable : this.Accounts_Volumes[2].DSDLATotal+'',
            Customizable : this.Accounts_Volumes[1].DSDLATotal+'',
            Total : data.Data.map(t => t.DSDLATotal).reduce((acc,value) => acc + value,0)+'',
          },
          {
            Leftheaders : 'Won',
            PerEssential : ((this.Accounts_Volumes[0].DSDLAWon/((data.Data.map(t => t.DSDLAWon).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : this.Accounts_Volumes[0].DSDLAWon+'',
            Configurable : this.Accounts_Volumes[2].DSDLAWon+'',
            Customizable : this.Accounts_Volumes[1].DSDLAWon+'',
            Total : data.Data.map(t => t.DSDLAWon).reduce((acc,value) => acc + value,0)+'',
          },
          {
            Leftheaders : 'Lost',
            PerEssential : ((this.Accounts_Volumes[0].DSDLALost/((data.Data.map(t => t.DSDLALost).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : this.Accounts_Volumes[0].DSDLALost+'',
            Configurable : this.Accounts_Volumes[2].DSDLALost+'',
            Customizable : this.Accounts_Volumes[1].DSDLALost+'',
            Total : data.Data.map(t => t.DSDLALost).reduce((acc,value) => acc + value,0)+'',
          },
          {
            Leftheaders : 'InProgress',
            PerEssential : ((this.Accounts_Volumes[0].DSDLAInPRogress/((data.Data.map(t => t.DSDLAInPRogress).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : this.Accounts_Volumes[0].DSDLAInPRogress+'',
            Configurable : this.Accounts_Volumes[2].DSDLAInPRogress+'',
            Customizable : this.Accounts_Volumes[1].DSDLAInPRogress+'',
            Total : data.Data.map(t => t.DSDLAInPRogress).reduce((acc,value) => acc + value,0)+'',
          }
        ];
        this.dataSource_DSDLA = DSDLAccountsdata;
        let TotalAccountsdata : AccountAndVolumes[] = [
          {
            Leftheaders : 'Total',
            PerEssential : (((this.Accounts_Volumes[0].DSDLATotal+this.Accounts_Volumes[0].SSATotal)/((data.Data.map(t => t.DSDLATotal).reduce((acc,value) => acc + value,0)+data.Data.map(t => t.SSATotal).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : (this.Accounts_Volumes[0].DSDLATotal+this.Accounts_Volumes[0].SSATotal)+'',
            Configurable : (this.Accounts_Volumes[2].DSDLATotal+this.Accounts_Volumes[2].SSATotal)+'',
            Customizable : (this.Accounts_Volumes[1].DSDLATotal+this.Accounts_Volumes[1].SSATotal)+'',
            Total : data.Data.map(t => t.DSDLATotal).reduce((acc,value) => acc + value,0)+data.Data.map(t => t.SSATotal).reduce((acc,value) => acc + value,0)+'',
          },
          {
            Leftheaders : 'Won',
            PerEssential : (((this.Accounts_Volumes[0].DSDLAWon+this.Accounts_Volumes[0].SSAWon)/((data.Data.map(t => t.DSDLAWon).reduce((acc,value) => acc + value,0)+data.Data.map(t => t.SSAWon).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : (this.Accounts_Volumes[0].DSDLAWon+this.Accounts_Volumes[0].SSAWon)+'',
            Configurable : (this.Accounts_Volumes[2].DSDLAWon+this.Accounts_Volumes[2].SSAWon)+'',
            Customizable : (this.Accounts_Volumes[1].DSDLAWon+this.Accounts_Volumes[1].SSAWon)+'',
            Total : data.Data.map(t => t.DSDLAWon).reduce((acc,value) => acc + value,0)+data.Data.map(t => t.SSAWon).reduce((acc,value) => acc + value,0)+'',
          },
          {
            Leftheaders : 'Lost',
            PerEssential : (((this.Accounts_Volumes[0].DSDLALost+this.Accounts_Volumes[0].SSALost)/((data.Data.map(t => t.DSDLALost).reduce((acc,value) => acc + value,0)+data.Data.map(t => t.SSALost).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : (this.Accounts_Volumes[0].DSDLALost+this.Accounts_Volumes[0].SSALost)+'',
            Configurable : (this.Accounts_Volumes[2].DSDLALost+this.Accounts_Volumes[2].SSALost)+'',
            Customizable : (this.Accounts_Volumes[1].DSDLALost+this.Accounts_Volumes[1].SSALost)+'',
            Total : data.Data.map(t => t.DSDLALost).reduce((acc,value) => acc + value,0)+data.Data.map(t => t.SSALost).reduce((acc,value) => acc + value,0)+'',
          },
          {
            Leftheaders : 'InProgress',
            PerEssential : (((this.Accounts_Volumes[0].DSDLAInPRogress+this.Accounts_Volumes[0].SSAInPRogress)/((data.Data.map(t => t.DSDLAInPRogress).reduce((acc,value) => acc + value,0)+data.Data.map(t => t.SSAInPRogress).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : (this.Accounts_Volumes[0].DSDLAInPRogress+this.Accounts_Volumes[0].SSAInPRogress)+'',
            Configurable : (this.Accounts_Volumes[2].DSDLAInPRogress+this.Accounts_Volumes[2].SSAInPRogress)+'',
            Customizable : (this.Accounts_Volumes[1].DSDLAInPRogress+this.Accounts_Volumes[1].SSAInPRogress)+'',
            Total : data.Data.map(t => t.DSDLAInPRogress).reduce((acc,value) => acc + value,0)+data.Data.map(t => t.SSAInPRogress).reduce((acc,value) => acc + value,0)+'',
          }
        ];
        this.dataSource_TA = TotalAccountsdata;
        let SSVolumedata : AccountAndVolumes[] = [
          {
            Leftheaders : 'Total',
            PerEssential : ((this.Accounts_Volumes[0].SSVTotal/((data.Data.map(t => t.SSVTotal).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : Math.round(this.Accounts_Volumes[0].SSVTotal).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Configurable : Math.round(this.Accounts_Volumes[2].SSVTotal).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Customizable : Math.round(this.Accounts_Volumes[1].SSVTotal).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Total : Math.round(data.Data.map(t => t.SSVTotal).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
          },
          {
            Leftheaders : 'Won',
            PerEssential : ((this.Accounts_Volumes[0].SSVWon/((data.Data.map(t => t.SSVWon).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : Math.round(this.Accounts_Volumes[0].SSVWon).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Configurable : Math.round(this.Accounts_Volumes[2].SSVWon).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Customizable : Math.round(this.Accounts_Volumes[1].SSVWon).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Total : Math.round(data.Data.map(t => t.SSVWon).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
          },
          {
            Leftheaders : 'Lost',
            PerEssential : ((this.Accounts_Volumes[0].SSVLost/((data.Data.map(t => t.SSVLost).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : Math.round(this.Accounts_Volumes[0].SSVLost).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Configurable : Math.round(this.Accounts_Volumes[2].SSVLost).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Customizable : Math.round(this.Accounts_Volumes[1].SSVLost).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Total : Math.round(data.Data.map(t => t.SSVLost).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
          },
          {
            Leftheaders : 'InProgress',
            PerEssential : ((this.Accounts_Volumes[0].SSVInPRogress/((data.Data.map(t => t.SSVInPRogress).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : Math.round(this.Accounts_Volumes[0].SSVInPRogress).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Configurable : Math.round(this.Accounts_Volumes[2].SSVInPRogress).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Customizable : Math.round(this.Accounts_Volumes[1].SSVInPRogress).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Total : Math.round(data.Data.map(t => t.SSVInPRogress).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
          }
        ];
        this.dataSource_SSV = SSVolumedata;
        let DSDLVolumedata : AccountAndVolumes[] = [
          {
            Leftheaders : 'Total',
            PerEssential : ((this.Accounts_Volumes[0].DSDLVTotal/((data.Data.map(t => t.DSDLVTotal).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : Math.round(this.Accounts_Volumes[0].DSDLVTotal).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Configurable : Math.round(this.Accounts_Volumes[2].DSDLVTotal).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Customizable : Math.round(this.Accounts_Volumes[1].DSDLVTotal).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Total : Math.round(data.Data.map(t => t.DSDLVTotal).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
          },
          {
            Leftheaders : 'Won',
            PerEssential : ((this.Accounts_Volumes[0].DSDLVWon/((data.Data.map(t => t.DSDLVWon).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : Math.round(this.Accounts_Volumes[0].DSDLVWon).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Configurable : Math.round(this.Accounts_Volumes[2].DSDLVWon).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Customizable : Math.round(this.Accounts_Volumes[1].DSDLVWon).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Total : Math.round(data.Data.map(t => t.DSDLVWon).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
          },
          {
            Leftheaders : 'Lost',
            PerEssential : ((this.Accounts_Volumes[0].DSDLVLost/((data.Data.map(t => t.DSDLVLost).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : Math.round(this.Accounts_Volumes[0].DSDLVLost).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Configurable : Math.round(this.Accounts_Volumes[2].DSDLVLost).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Customizable : Math.round(this.Accounts_Volumes[1].DSDLVLost).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Total : Math.round(data.Data.map(t => t.DSDLVLost).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
          },
          {
            Leftheaders : 'InProgress',
            PerEssential : ((this.Accounts_Volumes[0].DSDLVInPRogress/((data.Data.map(t => t.DSDLVInPRogress).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : Math.round(this.Accounts_Volumes[0].DSDLVInPRogress).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Configurable : Math.round(this.Accounts_Volumes[2].DSDLVInPRogress).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Customizable : Math.round(this.Accounts_Volumes[1].DSDLVInPRogress).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Total : Math.round(data.Data.map(t => t.DSDLVInPRogress).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
          }
        ];
        this.dataSource_DSDLV = DSDLVolumedata;
        let TotalVolumedata : AccountAndVolumes[] = [
          {
            Leftheaders : 'Total',
            PerEssential : (((this.Accounts_Volumes[0].DSDLVTotal+this.Accounts_Volumes[0].SSVTotal)/((data.Data.map(t => t.DSDLVTotal).reduce((acc,value) => acc + value,0)+data.Data.map(t => t.SSVTotal).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : Math.round(this.Accounts_Volumes[0].DSDLVTotal+this.Accounts_Volumes[0].SSVTotal).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Configurable : Math.round(this.Accounts_Volumes[2].DSDLVTotal+this.Accounts_Volumes[2].SSVTotal).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Customizable : Math.round(this.Accounts_Volumes[1].DSDLVTotal+this.Accounts_Volumes[1].SSVTotal).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Total : Math.round(data.Data.map(t => t.DSDLVTotal).reduce((acc,value) => acc + value,0)+data.Data.map(t => t.SSVTotal).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
          },
          {
            Leftheaders : 'Won',
            PerEssential : (((this.Accounts_Volumes[0].DSDLVWon+this.Accounts_Volumes[0].SSVWon)/((data.Data.map(t => t.DSDLVWon).reduce((acc,value) => acc + value,0)+data.Data.map(t => t.SSVWon).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : Math.round(this.Accounts_Volumes[0].DSDLVWon+this.Accounts_Volumes[0].SSVWon).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Configurable : Math.round(this.Accounts_Volumes[2].DSDLVWon+this.Accounts_Volumes[2].SSVWon).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Customizable : Math.round(this.Accounts_Volumes[1].DSDLVWon+this.Accounts_Volumes[1].SSVWon).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Total : Math.round(data.Data.map(t => t.DSDLVWon).reduce((acc,value) => acc + value,0)+data.Data.map(t => t.SSVWon).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
          },
          {
            Leftheaders : 'Lost',
            PerEssential : (((this.Accounts_Volumes[0].DSDLVLost+this.Accounts_Volumes[0].SSVLost)/((data.Data.map(t => t.DSDLVLost).reduce((acc,value) => acc + value,0)+data.Data.map(t => t.SSVLost).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : Math.round(this.Accounts_Volumes[0].DSDLVLost+this.Accounts_Volumes[0].SSVLost).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Configurable : Math.round(this.Accounts_Volumes[2].DSDLVLost+this.Accounts_Volumes[2].SSVLost).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Customizable : Math.round(this.Accounts_Volumes[1].DSDLVLost+this.Accounts_Volumes[1].SSVLost).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Total : Math.round(data.Data.map(t => t.DSDLVLost).reduce((acc,value) => acc + value,0)+data.Data.map(t => t.SSVLost).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
          },
          {
            Leftheaders : 'InProgress',
            PerEssential : (((this.Accounts_Volumes[0].DSDLVInPRogress+this.Accounts_Volumes[0].SSVInPRogress)/((data.Data.map(t => t.DSDLVInPRogress).reduce((acc,value) => acc + value,0)+data.Data.map(t => t.SSVInPRogress).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : Math.round(this.Accounts_Volumes[0].DSDLVInPRogress+this.Accounts_Volumes[0].SSVInPRogress).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Configurable : Math.round(this.Accounts_Volumes[2].DSDLVInPRogress+this.Accounts_Volumes[2].SSVInPRogress).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Customizable : Math.round(this.Accounts_Volumes[1].DSDLVInPRogress+this.Accounts_Volumes[1].SSVInPRogress).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Total : Math.round(data.Data.map(t => t.DSDLVInPRogress).reduce((acc,value) => acc + value,0)+data.Data.map(t => t.SSVInPRogress).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
          }
        ];
        this.dataSource_TV = TotalVolumedata;
        let WinRateAccount : WinRate[] = [
          {
            Leftheaders : 'Self Service',
            Essential : ((this.dataSource_SSA[1].Essential/(this.dataSource_SSA[0].Essential)|| 1)*100).toFixed(2)+"%",
            Configurable : ((this.dataSource_SSA[1].Configurable/(this.dataSource_SSA[0].Configurable)|| 1)*100).toFixed(2)+"%",
            Customizable : ((this.dataSource_SSA[1].Customizable/(this.dataSource_SSA[0].Customizable)|| 1)*100).toFixed(2)+"%",
            Total : ((this.dataSource_SSA[1].Total/(this.dataSource_SSA[0].Total)|| 1)*100).toFixed(2)+"%",
          },
          {
            Leftheaders : 'DSD Lead',
            Essential : ((this.dataSource_DSDLA[1].Essential/(this.dataSource_DSDLA[0].Essential)|| 1)*100).toFixed(2)+"%",
            Configurable : ((this.dataSource_DSDLA[1].Configurable/(this.dataSource_DSDLA[0].Configurable)|| 1)*100).toFixed(2)+"%",
            Customizable : ((this.dataSource_DSDLA[1].Customizable/(this.dataSource_DSDLA[0].Customizable)|| 1)*100).toFixed(2)+"%",
            Total : ((this.dataSource_DSDLA[1].Total/(this.dataSource_DSDLA[0].Total)|| 1)*100).toFixed(2)+"%",
          },
          {
            Leftheaders : 'Total',
            Essential : ((this.dataSource_TA[1].Essential/(this.dataSource_TA[0].Essential)|| 1)*100).toFixed(2)+"%",
            Configurable : ((this.dataSource_TA[1].Configurable/(this.dataSource_TA[0].Configurable)|| 1)*100).toFixed(2)+"%",
            Customizable : ((this.dataSource_TA[1].Customizable/(this.dataSource_TA[0].Customizable)|| 1)*100).toFixed(2)+"%",
            Total : ((this.dataSource_TA[1].Total/(this.dataSource_TA[0].Total)|| 1)*100).toFixed(2)+"%",
          }
        ];
        this.dataSource_WRA = WinRateAccount;
        let WinrateVolume : WinRate[] = [
          {
            Leftheaders : 'Self Service',
            Essential : ((this.Accounts_Volumes[0].SSVWon/(this.Accounts_Volumes[0].SSVTotal)|| 1)*100).toFixed(2)+"%",
            Configurable : ((this.Accounts_Volumes[2].SSVWon/(this.Accounts_Volumes[2].SSVTotal)|| 1)*100).toFixed(2)+"%",
            Customizable : ((this.Accounts_Volumes[1].SSVWon/(this.Accounts_Volumes[1].SSVTotal)|| 1)*100).toFixed(2)+"%",
            Total : ((data.Data.map(t => t.SSVWon).reduce((acc,value) => acc + value,0)/(data.Data.map(t => t.SSVTotal).reduce((acc,value) => acc + value,0))|| 1)*100).toFixed(2)+"%",
          },
          {
            Leftheaders : 'DSD Lead',
            Essential : ((this.Accounts_Volumes[0].DSDLVWon/(this.Accounts_Volumes[0].DSDLVTotal)|| 1)*100).toFixed(2)+"%",
            Configurable : ((this.Accounts_Volumes[2].DSDLVWon/(this.Accounts_Volumes[2].DSDLVTotal)|| 1)*100).toFixed(2)+"%",
            Customizable : ((this.Accounts_Volumes[1].DSDLVWon/(this.Accounts_Volumes[1].DSDLVTotal)|| 1)*100).toFixed(2)+"%",
            Total : ((data.Data.map(t => t.DSDLVWon).reduce((acc,value) => acc + value,0)/(data.Data.map(t => t.DSDLVTotal).reduce((acc,value) => acc + value,0))|| 1)*100).toFixed(2)+"%",
          },
          {
            Leftheaders : 'Total',
            Essential : (((this.Accounts_Volumes[0].DSDLVWon+this.Accounts_Volumes[0].SSVWon)/((this.Accounts_Volumes[0].DSDLVTotal+this.Accounts_Volumes[0].SSVTotal)|| 1))*100).toFixed(2)+"%",
            Configurable : (((this.Accounts_Volumes[2].DSDLVWon+this.Accounts_Volumes[2].SSVWon)/((this.Accounts_Volumes[2].DSDLVTotal+this.Accounts_Volumes[2].SSVTotal)|| 1))*100).toFixed(2)+"%",
            Customizable : (((this.Accounts_Volumes[1].DSDLVWon+this.Accounts_Volumes[1].SSVWon)/((this.Accounts_Volumes[1].DSDLVTotal+this.Accounts_Volumes[1].SSVTotal)|| 1))*100).toFixed(2)+"%",
            Total : (((data.Data.map(t => t.DSDLVWon).reduce((acc,value) => acc + value,0)+data.Data.map(t => t.SSVWon).reduce((acc,value) => acc + value,0))/((data.Data.map(t => t.DSDLVTotal).reduce((acc,value) => acc + value,0)+data.Data.map(t => t.SSVTotal).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+"%",
          }
        ];
        this.dataSource_WRV = WinrateVolume;
        this.dashboard.ShowSpinnerHandler(false);
      });
    }
  }
  GetDavidData(){
    this.dashboard.ShowSpinnerHandler(true);
    if(this.start_date == null || this.end_date == null){
      alert("Please select the Date Fields");
      this.dashboard.ShowSpinnerHandler(false);
    }else{
      //+ this.datepipe.transform(this.start_date,'MM/dd/yyyy')
      //this.datepipe.transform(this.end_date,'MM/dd/yyyy')
      this.service.DavidData(this.start_date.toLocaleDateString()+"",this.end_date.toLocaleDateString()+"").subscribe(data => {
        this.DavidData = data.Data;
        let Total_NB_R : AccountAndVolumes[] = [
          {
            Leftheaders : 'Total',
            PerEssential : ((this.DavidData[0].DDTotal/((data.Data.map(t => t.DDTotal).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : this.DavidData[0].DDTotal+'',
            Configurable : this.DavidData[2].DDTotal+'',
            Customizable : this.DavidData[1].DDTotal+'',
            Total : data.Data.map(t => t.DDTotal).reduce((acc,value) => acc + value,0)+'',
          },
          {
            Leftheaders : 'Won',
            PerEssential : ((this.DavidData[0].DDWon/((data.Data.map(t => t.DDWon).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : this.DavidData[0].DDWon+'',
            Configurable : this.DavidData[2].DDWon+'',
            Customizable : this.DavidData[1].DDWon+'',
            Total : data.Data.map(t => t.DDWon).reduce((acc,value) => acc + value,0)+'',
          },
          {
            Leftheaders : 'Lost',
            PerEssential : ((this.DavidData[0].DDLost/((data.Data.map(t => t.DDLost).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : this.DavidData[0].DDLost+'',
            Configurable : this.DavidData[2].DDLost+'',
            Customizable : this.DavidData[1].DDLost+'',
            Total : data.Data.map(t => t.DDLost).reduce((acc,value) => acc + value,0)+'',
          },
          {
            Leftheaders : 'InProgress',
            PerEssential : ((this.DavidData[0].DDInPRogress/((data.Data.map(t => t.DDInPRogress).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : this.DavidData[0].DDInPRogress+'',
            Configurable : this.DavidData[2].DDInPRogress+'',
            Customizable : this.DavidData[1].DDInPRogress+'',
            Total : data.Data.map(t => t.DDInPRogress).reduce((acc,value) => acc + value,0)+'',
          }
        ];
        this.dataSource_DD_NBR = Total_NB_R;
        let Total_NB : AccountAndVolumes[] = [
          {
            Leftheaders : 'Total',
            PerEssential : ((this.DavidData[0].DDNBTotal/((data.Data.map(t => t.DDNBTotal).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : this.DavidData[0].DDNBTotal+'',
            Configurable : this.DavidData[2].DDNBTotal+'',
            Customizable : this.DavidData[1].DDNBTotal+'',
            Total : data.Data.map(t => t.DDNBTotal).reduce((acc,value) => acc + value,0)+'',
          },
          {
            Leftheaders : 'Won',
            PerEssential : ((this.DavidData[0].DDNBWon/((data.Data.map(t => t.DDNBWon).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : this.DavidData[0].DDNBWon+'',
            Configurable : this.DavidData[2].DDNBWon+'',
            Customizable : this.DavidData[1].DDNBWon+'',
            Total : data.Data.map(t => t.DDNBWon).reduce((acc,value) => acc + value,0)+'',
          },
          {
            Leftheaders : 'Lost',
            PerEssential : ((this.DavidData[0].DDNBLost/((data.Data.map(t => t.DDNBLost).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : this.DavidData[0].DDNBLost+'',
            Configurable : this.DavidData[2].DDNBLost+'',
            Customizable : this.DavidData[1].DDNBLost+'',
            Total : data.Data.map(t => t.DDNBLost).reduce((acc,value) => acc + value,0)+'',
          },
          {
            Leftheaders : 'InProgress',
            PerEssential : ((this.DavidData[0].DDNBInPRogress/((data.Data.map(t => t.DDNBInPRogress).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : this.DavidData[0].DDNBInPRogress+'',
            Configurable : this.DavidData[2].DDNBInPRogress+'',
            Customizable : this.DavidData[1].DDNBInPRogress+'',
            Total : data.Data.map(t => t.DDNBInPRogress).reduce((acc,value) => acc + value,0)+'',
          }
        ];
        this.dataSource_DD_NB = Total_NB;
        let Total_R : AccountAndVolumes[] = [
          {
            Leftheaders : 'Total',
            PerEssential : (((this.DavidData[0].DDTotal-this.DavidData[0].DDNBTotal)/((data.Data.map(t => t.DDTotal).reduce((acc,value) => acc + value,0)-data.Data.map(t => t.DDNBTotal).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : (this.DavidData[0].DDTotal-this.DavidData[0].DDNBTotal)+'',
            Configurable : (this.DavidData[2].DDTotal-this.DavidData[2].DDNBTotal)+'',
            Customizable : (this.DavidData[1].DDTotal-this.DavidData[1].DDNBTotal)+'',
            Total : data.Data.map(t => t.DDTotal).reduce((acc,value) => acc + value,0)-data.Data.map(t => t.DDNBTotal).reduce((acc,value) => acc + value,0)+'',
          },
          {
            Leftheaders : 'Won',
            PerEssential : (((this.DavidData[0].DDWon-this.DavidData[0].DDNBWon)/((data.Data.map(t => t.DDWon).reduce((acc,value) => acc + value,0)-data.Data.map(t => t.DDNBWon).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : (this.DavidData[0].DDWon-this.DavidData[0].DDNBWon)+'',
            Configurable : (this.DavidData[2].DDWon-this.DavidData[2].DDNBWon)+'',
            Customizable : (this.DavidData[1].DDWon-this.DavidData[1].DDNBWon)+'',
            Total : data.Data.map(t => t.DDWon).reduce((acc,value) => acc + value,0)-data.Data.map(t => t.DDNBWon).reduce((acc,value) => acc + value,0)+'',
          },
          {
            Leftheaders : 'Lost',
            PerEssential : ((((this.DavidData[0].DDLost-this.DavidData[0].DDNBLost)/((data.Data.map(t => t.DDLost).reduce((acc,value) => acc + value,0)-data.Data.map(t => t.DDNBLost).reduce((acc,value) => acc + value,0)) || 1))*100).toFixed(2)) +'%',
            Essential : (this.DavidData[0].DDLost-this.DavidData[0].DDNBLost)+'',
            Configurable : (this.DavidData[2].DDLost-this.DavidData[2].DDNBLost)+'',
            Customizable : (this.DavidData[1].DDLost-this.DavidData[1].DDNBLost)+'',
            Total : data.Data.map(t => t.DDLost).reduce((acc,value) => acc + value,0)-data.Data.map(t => t.DDNBLost).reduce((acc,value) => acc + value,0)+'',
          },
          {
            Leftheaders : 'InProgress',
            PerEssential : (((this.DavidData[0].DDInPRogress-this.DavidData[0].DDNBInPRogress)/((data.Data.map(t => t.DDInPRogress).reduce((acc,value) => acc + value,0)-data.Data.map(t => t.DDNBInPRogress).reduce((acc,value) => acc + value,0))|| 1))*100).toFixed(2)+'%',
            Essential : (this.DavidData[0].DDInPRogress-this.DavidData[0].DDNBInPRogress)+'',
            Configurable : (this.DavidData[2].DDInPRogress-this.DavidData[2].DDNBInPRogress)+'',
            Customizable : (this.DavidData[1].DDInPRogress-this.DavidData[1].DDNBInPRogress)+'',
            Total : data.Data.map(t => t.DDInPRogress).reduce((acc,value) => acc + value,0)-data.Data.map(t => t.DDNBInPRogress).reduce((acc,value) => acc + value,0)+'',
          }
        ];
        this.dataSource_DD_R = Total_R;
        this.dashboard.ShowSpinnerHandler(false);
      });
    }
  }
  GetDSDMetrics(){
    this.dashboard.ShowSpinnerHandler(true);
    if(this.start_dateDM == null){
      alert("Please select the Date");
      this.dashboard.ShowSpinnerHandler(false);
    }else{
      this.dashboard.ShowSpinnerHandler(true);
      this.service.DSDmetrics(this.start_dateDM.toLocaleDateString()+'').subscribe(data => {
        this.WOVerbalAward_AV = data.Data;
        let WOVerbalAwardAccountsData : WinRateWOVerbalAward_AV[] = [
          {
            Leftheaders : 'Total Clients',
            Won : (this.WOVerbalAward_AV[0].DSDLAWon+this.WOVerbalAward_AV[0].SSAWon)+'',
            VerbalAward : (this.WOVerbalAward_AV[0].DSDLAVerbal+this.WOVerbalAward_AV[0].SSAVerbal)+'',
            Lost : (this.WOVerbalAward_AV[0].DSDLALost+this.WOVerbalAward_AV[0].SSALost)+'',
            PerWin : (((this.WOVerbalAward_AV[0].DSDLAWon+this.WOVerbalAward_AV[0].SSAWon)/(((this.WOVerbalAward_AV[0].DSDLAWon+this.WOVerbalAward_AV[0].SSAWon)+(this.WOVerbalAward_AV[0].DSDLALost+this.WOVerbalAward_AV[0].SSALost))|| 1))*100).toFixed(0)+"%",
          },
          {
            Leftheaders : 'DSD Lead',
            Won : this.WOVerbalAward_AV[0].DSDLAWon+'',
            VerbalAward : this.WOVerbalAward_AV[0].DSDLAVerbal+'',
            Lost : this.WOVerbalAward_AV[0].DSDLALost+'',
            PerWin : ((this.WOVerbalAward_AV[0].DSDLAWon/((this.WOVerbalAward_AV[0].DSDLAWon+this.WOVerbalAward_AV[0].DSDLALost)|| 1))*100).toFixed(0),
          },
          {
            Leftheaders : 'Self-Service',
            Won : this.WOVerbalAward_AV[0].SSAWon+'',
            VerbalAward : this.WOVerbalAward_AV[0].SSAVerbal+'',
            Lost : this.WOVerbalAward_AV[0].SSALost+'',
            PerWin : ((this.WOVerbalAward_AV[0].SSAWon/((this.WOVerbalAward_AV[0].SSAWon+this.WOVerbalAward_AV[0].SSALost)|| 1))*100).toFixed(0),
          }
        ];
        this.dataSource_WOV_A = WOVerbalAwardAccountsData;
        let WOVerbalAwardVolumeData : WinRateWOVerbalAward_AV[] = [
          {
            Leftheaders : 'Total Clients',
            Won : Math.round(this.WOVerbalAward_AV[0].DSDLVWon+this.WOVerbalAward_AV[0].SSVWon).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            VerbalAward : Math.round(this.WOVerbalAward_AV[0].DSDLVVerbal+this.WOVerbalAward_AV[0].SSVVerbal).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Lost : Math.round(this.WOVerbalAward_AV[0].DSDLVLost+this.WOVerbalAward_AV[0].SSVLost).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            PerWin : (((this.WOVerbalAward_AV[0].DSDLVWon+this.WOVerbalAward_AV[0].SSVWon)/(((this.WOVerbalAward_AV[0].DSDLVWon+this.WOVerbalAward_AV[0].SSVWon)+(this.WOVerbalAward_AV[0].DSDLVLost+this.WOVerbalAward_AV[0].SSVLost))|| 1))*100).toFixed(0)+"%",
          },
          {
            Leftheaders : 'DSD Lead',
            Won : Math.round(this.WOVerbalAward_AV[0].DSDLVWon).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            VerbalAward : Math.round(this.WOVerbalAward_AV[0].DSDLVVerbal).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Lost : Math.round(this.WOVerbalAward_AV[0].DSDLVLost).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            PerWin : ((this.WOVerbalAward_AV[0].DSDLVWon/((this.WOVerbalAward_AV[0].DSDLVWon+this.WOVerbalAward_AV[0].DSDLVLost)|| 1))*100).toFixed(0),
          },
          {
            Leftheaders : 'Self-Service',
            Won : Math.round(this.WOVerbalAward_AV[0].SSVWon).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            VerbalAward : Math.round(this.WOVerbalAward_AV[0].SSVVerbal).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            Lost : Math.round(this.WOVerbalAward_AV[0].SSVLost).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            PerWin : ((this.WOVerbalAward_AV[0].SSVWon/((this.WOVerbalAward_AV[0].SSVWon+this.WOVerbalAward_AV[0].SSVLost))|| 1)*100).toFixed(0),
          }
        ];
        this.dataSource_WOV_V = WOVerbalAwardVolumeData;
        let InProgressData : InProgress[] = [
          {
            Leftheaders : 'Total Clients',
            Accounts :  (this.WOVerbalAward_AV[0].DSDLAccounts +this.WOVerbalAward_AV[0].SSAccounts)+"",
            Spend : Math.round(this.WOVerbalAward_AV[0].DSDLSpend+this.WOVerbalAward_AV[0].SSSpend).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            AvgDaysSinceStart : this.WOVerbalAward_AV[0].DSDLAvgDaysSinceStart + '',
          },
          {
            Leftheaders : 'DSD Lead',
            Accounts : this.WOVerbalAward_AV[0].DSDLAccounts + '',
            Spend : Math.round(this.WOVerbalAward_AV[0].DSDLSpend).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            AvgDaysSinceStart : this.WOVerbalAward_AV[0].DSDLAvgDaysSinceStart + '',
          },
          {
            Leftheaders : 'Self-Service',
            Accounts : this.WOVerbalAward_AV[0].SSAccounts + '',
            Spend : Math.round(this.WOVerbalAward_AV[0].SSSpend).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3),
            AvgDaysSinceStart : this.WOVerbalAward_AV[0].SSAvgDaysSinceStart + '',
          }
        ];
        this.dataSource_IP = InProgressData;
        this.dashboard.ShowSpinnerHandler(false);
      });
      this.dashboard.ShowSpinnerHandler(true);
      this.service.TotalYTDActivity(this.start_dateDM.toLocaleDateString()+'').subscribe(data => {
        this.ytdActivity = data.Data;
        for(let i = 0;i<data.Data.length;i++){
          this.ytdActivity[i].TVolumes = Math.round(data.Data[i].TotalVolumes).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3)+''; 
          this.ytdActivity[i].WVolumes = Math.round(data.Data[i].WonVolumes).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3)+''; 
          this.ytdActivity[i].LVolumes = Math.round(data.Data[i].LostVolumes).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3)+''; 
          this.ytdActivity[i].WinPerAccounts = (Math.round((data.Data[i].WonAccounts/((data.Data[i].WonAccounts+data.Data[i].LostAccounts)|| 1)) * 100)).toFixed(0)+'%'; 
          this.ytdActivity[i].WinPerVolume = (Math.round((data.Data[i].WonVolumes/((data.Data[i].WonVolumes+data.Data[i].LostVolumes)|| 1)) * 100)).toFixed(0)+'%'; 
        }
        this.dataSource_YTD = this.ytdActivity;
        this.dashboard.ShowSpinnerHandler(false);
      });
    }
  }
  //Start of Prospect_Type Methods
  checkUncheckProspect_Type() {
    for (var i = 0; i < this.Prospect_TypeList.length; i++) {
      this.Prospect_TypeList[i].isSelected = this.masterProspect_Type;
    }
    this.getSelectedProspectType();
  }
  Prospect_TypeSelected() {
    this.masterProspect_Type = this.Prospect_TypeList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedProspectType();
  }
  getSelectedProspectType(){
    this.Apply_disable = false;
    this.SelectedProspect_Type = null;
    for(let i=0;i<this.Prospect_TypeList.length;i++){
      if(this.Prospect_TypeList[i].isSelected == true){
        if(this.SelectedProspect_Type == null){
          this.SelectedProspect_Type = this.Prospect_TypeList[i].Prospect_Type;
        }else{
          this.SelectedProspect_Type += ","+this.Prospect_TypeList[i].Prospect_Type;
        }
      }else{
      }
    }
    //this.Prospect_TypeListSelected = this.Prospect_TypeList.filter(s => s.isSelected == true);
  }
  // deselectprojectstatus(val : string){
  //   for(let i=0;i<this.projectstatusList.length;i++){
  //     if(this.projectstatusList[i].iMeet_Milestone___Project_Status == val){
  //       this.projectstatusList[i].isSelected = false;
  //     }else{
  //     }
  //   }
  //   this.projectstatusSelected();
  // }
  //End of Prospect_Type Methods
  
  //Start of ProjectStatus Methods
  checkUncheckSalesLeaderTypeAndTypeOfBid() {
    for (var i = 0; i < this.SalesLeaderTypeAndTypeOfBidList.length; i++) {
      this.SalesLeaderTypeAndTypeOfBidList[i].isSelected = this.masterSalesLeaderTypeAndTypeOfBid;
    }
    this.getSelectedSalesLeaderTypeAndTypeOfBid();
  }
  SalesLeaderTypeAndTypeOfBidSelected() {
    this.masterSalesLeaderTypeAndTypeOfBid = this.SalesLeaderTypeAndTypeOfBidList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedSalesLeaderTypeAndTypeOfBid();
  }
  getSelectedSalesLeaderTypeAndTypeOfBid(){
    this.Apply_disable = false;
    this.SelectedSalesLeaderTypeAndTypeOfBid = null;
    for(let i=0;i<this.SalesLeaderTypeAndTypeOfBidList.length;i++){
      if(this.SalesLeaderTypeAndTypeOfBidList[i].isSelected == true){
        if(this.SelectedSalesLeaderTypeAndTypeOfBid == null){
          this.SelectedSalesLeaderTypeAndTypeOfBid = this.SalesLeaderTypeAndTypeOfBidList[i].Sales_Leader_type_and_Type_of_bid;
        }else{
          this.SelectedSalesLeaderTypeAndTypeOfBid += ","+this.SalesLeaderTypeAndTypeOfBidList[i].Sales_Leader_type_and_Type_of_bid;
        }
      }else{
      }
    }
    //this.SalesLeaderTypeAndTypeOfBidListSelected = this.projectstatusList.filter(s => s.isSelected == true);
  }
  // deselectprojectstatus(val : string){
  //   for(let i=0;i<this.projectstatusList.length;i++){
  //     if(this.projectstatusList[i].iMeet_Milestone___Project_Status == val){
  //       this.projectstatusList[i].isSelected = false;
  //     }else{
  //     }
  //   }
  //   this.projectstatusSelected();
  // }
  //End of Status Methods
}