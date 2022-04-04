import { Component, OnInit } from '@angular/core';
import { DashboardServiceService } from 'src/app/dashboard-service.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { DatePipe } from '@angular/common';
import { ExcelService } from 'src/app/excel.service';
import { Data } from 'src/app/Models/Responce';

@Component({
  selector: 'app-prospect',
  templateUrl: './prospect.component.html',
  styleUrls: ['./prospect.component.css']
})
export class ProspectComponent implements OnInit {
  PdataSource;
  FirstWeek;SecondWeek;ThirdWeek;FourthWeek;FifthWeek;SixthWeek;SeventhWeek;EigthWeek;NinthWeek;TenthWeek;ElevenWeek;TwelvethWeek;
  ProspectData : Data[];
  date = new Date();
  PdisplayedColumns: string[] = ['Region','Leader','Manager','Client_Name','PAvgUtil','FirstWeek','SecondWeek','ThirdWeek','FourthWeek','FivthWeek','SixthWeek','SeventhWeek','EighthWeek','NinthWeek','TenthWeek','EleventhWeek','twelvethWeek'];
  constructor(public service : DashboardServiceService,public dashboard : DashboardComponent,public datepipe : DatePipe,public excelservice : ExcelService) { }
  

  ngOnInit(): void {
    var day = this.date.getDay();
    var diff = this.date.getDate() - day + (day == 0 ? -6:1);
    this.FirstWeek = this.datepipe.transform(this.date.setDate(diff), "dd-MM-yyyy");
    this.SecondWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MM-yyyy");
    this.ThirdWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MM-yyyy");
    this.FourthWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MM-yyyy");
    this.FifthWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MM-yyyy");
    this.SixthWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MM-yyyy");
    this.SeventhWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MM-yyyy");
    this.EigthWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MM-yyyy");
    this.NinthWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MM-yyyy");
    this.TenthWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MM-yyyy");
    this.ElevenWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MM-yyyy");
    this.TwelvethWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MM-yyyy");
    this.dashboard.ShowSpinnerHandler(true);
    this.service.GetProspect().subscribe(data =>{
      if(data.code == 200){
        console.log(data.Data);
        this.ProspectData = data.Data;
        for(let i = 0;i<data.Data.length;i++){
          this.ProspectData[i].FirstWeek = this.ProspectData[i].FirstWeek ?? 0;
          this.ProspectData[i].SecondWeek = this.ProspectData[i].SecondWeek ?? 0;
          this.ProspectData[i].ThirdWeek = this.ProspectData[i].ThirdWeek ?? 0;
          this.ProspectData[i].FourthWeek = this.ProspectData[i].FourthWeek ?? 0;
          this.ProspectData[i].FivthWeek = this.ProspectData[i].FivthWeek ?? 0;
          this.ProspectData[i].SixthWeek = this.ProspectData[i].SixthWeek ?? 0;
          this.ProspectData[i].SeventhWeek = this.ProspectData[i].SeventhWeek ?? 0;
          this.ProspectData[i].EighthWeek = this.ProspectData[i].EighthWeek ?? 0;
          this.ProspectData[i].NinthWeek = this.ProspectData[i].NinthWeek ?? 0;
          this.ProspectData[i].TenthWeek = this.ProspectData[i].TenthWeek ?? 0;
          this.ProspectData[i].EleventhWeek = this.ProspectData[i].EleventhWeek ?? 0;
          this.ProspectData[i].twelvethWeek = this.ProspectData[i].twelvethWeek ?? 0;
          this.ProspectData[i].PAvgUtil = parseFloat(((this.ProspectData[i].FirstWeek+this.ProspectData[i].SecondWeek+this.ProspectData[i].ThirdWeek+this.ProspectData[i].FourthWeek)/4).toFixed(2))
        }
        this.PdataSource = this.ProspectData;
        this.dashboard.ShowSpinnerHandler(false);
      }else{
        this.PdataSource = null;
        this.dashboard.ShowSpinnerHandler(false);
      }
    })
  }
}