import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DashboardServiceService } from 'src/app/dashboard-service.service';
import { ExcelService } from 'src/app/excel.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LivedashboardComponent } from '../livedashboard/livedashboard.component';
import { Chart } from 'chart.js';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import ChartDataLabels from 'chartjs-plugin-datalabels';
@Component({
  selector: 'app-nps-implementation',
  templateUrl: './nps-implementation.component.html',
  styleUrls: ['./nps-implementation.component.css']
})
export class NpsImplementationComponent implements OnInit {
  constructor(
    public datepipe : DatePipe,public service : DashboardServiceService,public dialog: MatDialog, public dashboard : LivedashboardComponent,private excelService:ExcelService) 
  {
    //set screenWidth on page load
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    window.onresize = () => {
      //set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    };
  }
  screenWidth;screenHeight;
  n_nps_Score = [];
  ne_nps_Score = [];
  n_Region = [];
  ne_Region = [];
  e_nps_Score = [];
  e_Region = [];
  n_regioncount = [];
  ne_regioncount = [];
  n_PassiveCount = [];
  ne_PassiveCount = [];
  n_PromoterCount = [];
  ne_PromoterCount = [];
  n_DetracterCount = [];
  ne_DetracterCount = [];
  e_regioncount = [];
  e_PassiveCount = [];
  e_PromoterCount = [];
  e_DetracterCount = [];

  n_commentone = [];
  n_commentonecount = [];
  n_commenttwo = [];
  n_commenttwocount = [];
  n_commentthree = [];
  n_commentthreecount = [];
  e_commentone = [];
  e_commentonecount = [];
  e_commenttwo = [];
  e_commenttwocount = [];
  e_commentthree = [];
  e_commentthreecount = [];
  
  ne_commentone = [];
  ne_commentonecount = [];
  ne_commenttwo = [];
  ne_commenttwocount = [];
  ne_commentthree = [];
  ne_commentthreecount = [];
  ngOnInit(): void {
    this.CurrentYear = (new Date()).getFullYear();
    this.TargetNPSScore = 70;
    this.service.NPSData().subscribe(data => {
      if(data.code == 200){
        this.SurveySent = data.NPSvalues[0].NewBusinessSurveySent;
        this.E_SurveySent = data.NPSvalues[0].ExistingSurveySent;
        this.ResponsesRecevied = data.NPSvalues[0].NewBusinessSurveyReceived;
        this.E_ResponsesRecevied = data.NPSvalues[0].ExistingSurveyReceived;
        this.ResponseRate = data.NPSvalues[0].NewBusinessSurveySent == 0 ? 0 : Math.round((data.NPSvalues[0].NewBusinessSurveyReceived/data.NPSvalues[0].NewBusinessSurveySent)*100)+"%";
        this.E_ResponseRate = data.NPSvalues[0].ExistingSurveySent == 0 ? 0 : Math.round((data.NPSvalues[0].ExistingSurveyReceived/data.NPSvalues[0].ExistingSurveySent)*100)+"%";
        this.NPSScore = data.NPSvalues[0].NewBusinessSurveyReceived == 0 ? 0 : (Math.round(((data.NPSvalues[0].NewBusinessPromoter/data.NPSvalues[0].NewBusinessSurveyReceived)-(data.NPSvalues[0].NewBusinessDetractor/data.NPSvalues[0].NewBusinessSurveyReceived))*100*100)/100).toFixed(1);
        this.E_NPSScore = data.NPSvalues[0].ExistingSurveyReceived == 0 ? 0 : (Math.round(((data.NPSvalues[0].ExistingPromoter/data.NPSvalues[0].ExistingSurveyReceived)-(data.NPSvalues[0].ExistingDetractor/data.NPSvalues[0].ExistingSurveyReceived))*100*100)/100).toFixed(1);
        this.NE_SurveySent = data.NPSvalues[0].NESurveySent;
        this.NE_ResponsesRecevied = data.NPSvalues[0].NESurveyReceived;
        this.NE_ResponseRate = data.NPSvalues[0].NESurveySent == 0 ? 0 : Math.round((data.NPSvalues[0].NESurveyReceived/data.NPSvalues[0].NESurveySent)*100)+"%";
        this.NE_NPSScore = data.NPSvalues[0].NESurveyReceived == 0 ? 0 : (Math.round(((data.NPSvalues[0].NEPromoter/data.NPSvalues[0].NESurveyReceived)-(data.NPSvalues[0].NEDetractor/data.NPSvalues[0].NESurveyReceived))*100*100)/100).toFixed(1);
        if(this.n_nps_breakdown != undefined){
          this.n_nps_breakdown.destroy();
        }
        var options = {
          // events: false,
          legend: {
            display: false,
            // position : 'bottom',
            // fullWidth : true,
            // labels: {
            //     fontColor: '#000000',
            //     fontSize :  10,
            //     padding : 10,
            //     fontStyle : 'normal',
            //     fontFamily : 'Arial',
            // }
          },
          chartArea: {
            backgroundColor: 'rgba(251, 85, 85, 0.4)'
          },
          hover: {
            mode: 'index' as 'index',
            intersect: false
          },
          title: {
            display: true,
            text: ' '
          },
          scales: {
            xAxes: [{
              ticks: {
                fontSize : 10,
                fontStyle : 'normal',
                fontColor : '#000000',
                fontFamily : 'Arial',
              },
              gridLines: {
                color: "rgba(0, 0, 0, 0)",
              }
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true,
                fontSize : 10,
                fontStyle : 'normal',
                fontColor : '#000000',
                fontFamily : 'Arial',
              },
              gridLines: {
                color: "rgba(0, 0, 0, 0)",
              }
            }]
          },
          tooltips: {
            mode: 'index' as 'index',
            intersect: false,
            callbacks: {
              label: function(tooltipItems, data) {
                return "NPS Score : " + 
                Math.round(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]);
              }
            }
          },
          plugins: {
            labels: {
              render: 'value',
              fontColor: '#3B3B3B',
              position: 'outside',
              textMargin: 6,
              fontSize: 12,
              fontStyle: 'bold',
              fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            }
          },
        };
        var options3 = {
          legend: {
            display: true,
            position : 'bottom' as 'bottom',
            fullWidth : true,
            labels: {
                fontColor: '#000000',
                fontSize :  11,
                padding : 15,
                fontStyle : '500',
                fontFamily : 'Arial',
            }
          },
          chartArea: {
            backgroundColor: 'rgba(251, 85, 85, 0.4)'
          },
          // hover: {
          //   mode: 'index' as 'index',
          //   intersect: false
          // },
          title: {
            display: true,
            text: ' '
          },
          scales: {
            xAxes: [{ 
              // stacked: true,
              ticks: {
                fontSize : 10,
                fontStyle : 'normal',
                fontColor : '#000000',
                fontFamily : 'Arial',
              },
              gridLines: {
                color: "rgba(0, 0, 0, 0)",
              }
            }],
            yAxes: [{ 
              // stacked: true,
              ticks: {
                beginAtZero: true,
                fontSize : 10,
                fontStyle : 'normal',
                fontColor : '#000000',
                fontFamily : 'Arial',
              },
              gridLines: {
                color: "rgba(0, 0, 0, 0)",
              }
            }]
          },
          plugins: {
            labels: {
              render: function (args) {
                if(args.value > 0) {
                  return ''+args.value;
                }
                else
                {
                  return '';
                }
              },
              align: 'center',
              anchor: 'center',
              // render: 'value',
              fontColor: '#3B3B3B',
              // position: 'outside',
              textMargin: 6,
              fontSize: 12,
              fontStyle: 'bold',
              fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            },
          },
        }
        var options4 = {
          legend: {
            display: false,
          },
          hover: {
            mode: 'index' as 'index',
            intersect: false
          },
          // plugins: {
            // datalabels: {
            //   anchor : 'end' as 'end',
            //   align : 'end' as 'end',
            //   color : 'black',
            //   backgroundColor : 'rgb(52, 152, 219 ,0.4)',
            //   padding : 3,
            //   borderRadius : 6,
            //   font: {
            //     size: 11,
            //     weight: 'bold' as 'bold'
            //   }
            // }
          // },
          tooltips: {
            mode: 'index' as 'index',
            intersect: false,
            callbacks: {
              label: function(tooltipItems, data) {
                return "Count : " + 
                Math.round(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]);
              }
            }
          },
          scales: {
            xAxes: [{ 
              // stacked: true,
              ticks: {
                beginAtZero: true,
                fontSize : 13,
                fontStyle : 'normal',
                fontColor : '#000000',
                fontFamily : 'Arial',
                stepSize: 1,
              }
            }],
            yAxes: [{ 
              stacked: true,
              ticks: {
                beginAtZero: true,
                fontSize : 11,
                fontStyle : 'normal',
                fontColor : '#000000',
                fontFamily : 'Arial',
                stepSize: 1,
              },
              gridLines: {
                color: "rgba(0, 0, 0, 0)",
              }
            }]
          },
        }
        var pieOptions = {
          legend: {
            display: true,
            position : 'bottom' as 'bottom',
            fullWidth : true,
            labels: {
              fontColor: '#000000',
              fontSize :  10,
              padding : 10,
              fontStyle : '400',
              fontFamily : 'Arial',
            }
          },
          plugins: {
            labels: {
              render: 'value',
              fontColor: '#3B3B3B',
              textMargin: 6,
              arc: false,
              fontSize: 13,
              fontStyle: 'bold',
              fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            }
          },
          showAllTooltips: true,
          tooltips: {
            callbacks: {
              label: function(tooltipItems, data) {
                return data.labels[tooltipItems.index] + " : "+ data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index];
              }
            }
          },
          events: ['mousemove'],
        };
        this.n_nps_breakdown = new Chart('n_nps_breakdown', {
          type : 'pie',
          data : {
            // labels : this.PLWProjectLevels,
            labels : ["Promoter","Passive","Detractor"],
            datasets : [
              {
                label : "Project Count",
                data : [data.NPSvalues[0].NewBusinessPromoter,data.NPSvalues[0].NewBusinessPassive,data.NPSvalues[0].NewBusinessDetractor],
                hoverBackgroundColor: [
                  'rgb(46, 204, 113)', 'rgb(247, 220, 111)', 'rgb(231, 76, 60)'
                ],
                backgroundColor: [
                  'rgb(46, 204, 113)', 'rgb(247, 220, 111)', 'rgb(231, 76, 60)'
                ],
                borderColor: [
                  'rgba(46, 204, 113,1)', 'rgba(247, 220, 111,1)', 'rgba(231, 76, 60,1)'
                ],
              }
            ]
          },
          options : pieOptions,
        })
        if(this.e_nps_breakdown != undefined){
          this.e_nps_breakdown.destroy();
        }
        this.e_nps_breakdown = new Chart('e_nps_breakdown', {
          type : 'pie',
          data : {
            // labels : this.PLWProjectLevels,
            labels : ["Promoter","Passive","Detractor"],
            datasets : [
              {
                label : "Project Count",
                data : [data.NPSvalues[0].ExistingPromoter,data.NPSvalues[0].ExistingPassive,data.NPSvalues[0].ExistingDetractor],
                hoverBackgroundColor: [
                  'rgb(46, 204, 113)', 'rgb(247, 220, 111)', 'rgb(231, 76, 60)'
                ],
                backgroundColor: [
                  'rgb(46, 204, 113)', 'rgb(247, 220, 111)', 'rgb(231, 76, 60)'
                ],
                borderColor: [
                  'rgba(46, 204, 113,1)', 'rgba(247, 220, 111,1)', 'rgba(231, 76, 60,1)'
                ],
              }
            ]
          },
          options : pieOptions,
        })
        if(this.ne_nps_breakdown != undefined){
          this.ne_nps_breakdown.destroy();
        }
        this.ne_nps_breakdown = new Chart('ne_nps_breakdown', {
          type : 'pie',
          data : {
            // labels : this.PLWProjectLevels,
            labels : ["Promoter","Passive","Detractor"],
            datasets : [
              {
                label : "Project Count",
                data : [data.NPSvalues[0].NEPromoter,data.NPSvalues[0].NEPassive,data.NPSvalues[0].NEDetractor],
                hoverBackgroundColor: [
                  'rgb(46, 204, 113)', 'rgb(247, 220, 111)', 'rgb(231, 76, 60)'
                ],
                backgroundColor: [
                  'rgb(46, 204, 113)', 'rgb(247, 220, 111)', 'rgb(231, 76, 60)'
                ],
                borderColor: [
                  'rgba(46, 204, 113,1)', 'rgba(247, 220, 111,1)', 'rgba(231, 76, 60,1)'
                ],
              }
            ]
          },
          options : pieOptions,
        })
        for(let i = 0; i<data.NewRegionWiseNPSScore.length;i++){
          if(data.NewRegionWiseNPSScore[i].Region == null){
            this.n_Region.push("Blanks");
          }
          else{
            this.n_Region.push(data.NewRegionWiseNPSScore[i].Region);
          }
          // data.NewRegionWiseNPSScore[i].Score =  ((data.NewRegionWiseNPSScore[i].PromoterCount-data.NewRegionWiseNPSScore[i].DetractorCount)/data.NewRegionWiseNPSScore[i].NPSScore)*100
          this.n_nps_Score.push(Math.round(data.NewRegionWiseNPSScore[i].Score));
        }
        if(this.n_nps_regionscore != undefined){
          this.n_nps_regionscore.destroy();
        }
        this.n_nps_regionscore = new Chart('n_nps_regionscore', {
          type : 'bar',
          data : {
            labels : this.n_Region,
            datasets : [
              {
                data : this.n_nps_Score,
                backgroundColor: [
                  'rgba(0, 87, 231,1)', 'rgba(232, 209, 102,1)','rgba(235, 137, 95 ,1)', 'rgba(222, 106, 115,1)', 'rgba(87, 59, 146,1)'
                ],
                hoverBackgroundColor: [
                  'rgba(0, 87, 231,0.4)', 'rgba(232, 209, 102,0.4)','rgba(235, 137, 95,0.4)','rgba(222, 106, 115,0.4)','rgba(87, 59, 146,0.4)',
                ],
                fill: false,
              }
            ]
          },
          options : options,
        })
        for(let i = 0; i<data.ExistingRegionWiseNPSScore.length;i++){
          if(data.ExistingRegionWiseNPSScore[i].Region == null){
            this.e_Region.push("Blanks");
          }
          else{
            this.e_Region.push(data.ExistingRegionWiseNPSScore[i].Region);
          }
          // data.ExistingRegionWiseNPSScore[i].Score =  ((data.ExistingRegionWiseNPSScore[i].PromoterCount-data.ExistingRegionWiseNPSScore[i].DetractorCount)/data.ExistingRegionWiseNPSScore[i].NPSScore)*100
          this.e_nps_Score.push(Math.round(data.ExistingRegionWiseNPSScore[i].Score));
        }
        if(this.e_nps_regionscore != undefined){
          this.e_nps_regionscore.destroy();
        }
        this.e_nps_regionscore = new Chart('e_nps_regionscore', {
          type : 'bar',
          data : {
            labels : this.e_Region,
            datasets : [
              {
                data : this.e_nps_Score,
                backgroundColor: [
                  'rgba(0, 87, 231,1)', 'rgba(232, 209, 102,1)','rgba(235, 137, 95 ,1)', 'rgba(222, 106, 115,1)', 'rgba(87, 59, 146,1)'
                ],
                hoverBackgroundColor: [
                  'rgba(0, 87, 231,0.4)', 'rgba(232, 209, 102,0.4)','rgba(235, 137, 95,0.4)','rgba(222, 106, 115,0.4)','rgba(87, 59, 146,0.4)',
                ],
                fill: false,
              }
            ]
          },
          options : options,
        })
        for(let i = 0; i<data.NERegionWiseNPSScore.length;i++){
          if(data.NERegionWiseNPSScore[i].Region == null){
            this.ne_Region.push("Blanks");
          }
          else{
            this.ne_Region.push(data.NERegionWiseNPSScore[i].Region);
          }
          // data.NERegionWiseNPSScore[i].Score =  ((data.NERegionWiseNPSScore[i].PromoterCount-data.NERegionWiseNPSScore[i].DetractorCount)/data.NERegionWiseNPSScore[i].NPSScore)*100;
          this.ne_nps_Score.push(Math.round(data.NERegionWiseNPSScore[i].Score));
        }
        if(this.ne_nps_regionscore != undefined){
          this.ne_nps_regionscore.destroy();
        }
        this.ne_nps_regionscore = new Chart('ne_nps_regionscore', {
          type : 'bar',
          data : {
            labels : this.ne_Region,
            datasets : [
              {
                data : this.ne_nps_Score,
                backgroundColor: [
                  'rgba(0, 87, 231,1)', 'rgba(232, 209, 102,1)','rgba(235, 137, 95 ,1)', 'rgba(222, 106, 115,1)', 'rgba(87, 59, 146,1)'
                ],
                hoverBackgroundColor: [
                  'rgba(0, 87, 231,0.4)', 'rgba(232, 209, 102,0.4)','rgba(235, 137, 95,0.4)','rgba(222, 106, 115,0.4)','rgba(87, 59, 146,0.4)',
                ],
                fill: false,
              }
            ]
          },
          options : options,
        })
        for(let i = 0; i<data.NewRegionWiseNPSCount.length;i++){
          if(data.NewRegionWiseNPSCount[i].Region == null){
            this.n_regioncount.push("Blanks");
          }
          else{
            this.n_regioncount.push(data.NewRegionWiseNPSCount[i].Region);
          }
          this.n_PromoterCount.push(data.NewRegionWiseNPSCount[i].PromoterCount);
          this.n_PassiveCount.push(data.NewRegionWiseNPSCount[i].PassiveCount);
          this.n_DetracterCount.push(data.NewRegionWiseNPSCount[i].DetractorCount);
        }
        if(this.n_nps_regioncount != undefined){
          this.n_nps_regioncount.destroy();
        }
        this.n_nps_regioncount = new Chart('n_nps_regioncount', {
          type : 'bar',
          data : {
            labels: this.n_regioncount,
            datasets : [
              {
                label: 'Passive',
                data: this.n_PassiveCount,
                backgroundColor: 'rgb(247, 220, 111)'
              },
              {
                label: 'Promoter',
                data: this.n_PromoterCount,
                backgroundColor: 'rgb(46, 204, 113)'
              },
              {
                label: 'Detractor',
                data: this.n_DetracterCount,
                backgroundColor: 'rgb(231, 76, 60)'
              }
            ]
          },
          options : options3,
        })
        for(let i = 0; i<data.ExistingRegionWiseNPSCount.length;i++){
          if(data.ExistingRegionWiseNPSCount[i].Region == null){
            this.e_regioncount.push("Blanks");
          }
          else{
            this.e_regioncount.push(data.ExistingRegionWiseNPSCount[i].Region);
          }
          this.e_PromoterCount.push(data.ExistingRegionWiseNPSCount[i].PromoterCount);
          this.e_PassiveCount.push(data.ExistingRegionWiseNPSCount[i].PassiveCount);
          this.e_DetracterCount.push(data.ExistingRegionWiseNPSCount[i].DetractorCount);
        }
        if(this.e_nps_regioncount != undefined){
          this.e_nps_regioncount.destroy();
        }
        this.e_nps_regioncount = new Chart('e_nps_regioncount', {
          type : 'bar',
          data : {
            labels: this.e_regioncount,
            datasets : [
              {
                label: 'Passive',
                data: this.e_PassiveCount,
                backgroundColor: 'rgb(247, 220, 111)'
              },
              {
                label: 'Promoter',
                data: this.e_PromoterCount,
                backgroundColor: 'rgb(46, 204, 113)'
              },
              {
                label: 'Detractor',
                data: this.e_DetracterCount,
                backgroundColor: 'rgb(231, 76, 60)'
              }
            ]
          },
          options : options3,
        })
        for(let i = 0; i<data.NERegionWiseNPSCount.length;i++){
          if(data.NERegionWiseNPSCount[i].Region == null){
            this.ne_regioncount.push("Blanks");
          }
          else{
            this.ne_regioncount.push(data.NERegionWiseNPSCount[i].Region);
          }
          this.ne_PromoterCount.push(data.NERegionWiseNPSCount[i].PromoterCount);
          this.ne_PassiveCount.push(data.NERegionWiseNPSCount[i].PassiveCount);
          this.ne_DetracterCount.push(data.NERegionWiseNPSCount[i].DetractorCount);
        }
        if(this.ne_nps_regioncount != undefined){
          this.ne_nps_regioncount.destroy();
        }
        this.ne_nps_regioncount = new Chart('ne_nps_regioncount', {
          type : 'bar',
          data : {
            labels: this.ne_regioncount,
            datasets : [
              {
                label: 'Passive',
                data: this.ne_PassiveCount,
                backgroundColor: 'rgb(247, 220, 111)'
              },
              {
                label: 'Promoter',
                data: this.ne_PromoterCount,
                backgroundColor: 'rgb(46, 204, 113)'
              },
              {
                label: 'Detractor',
                data: this.ne_DetracterCount,
                backgroundColor: 'rgb(231, 76, 60)'
              }
            ]
          },
          options : options3,
        })
        for(let i = 0; i<data.NewSemanticAnalysisOne.length;i++){
          if(data.NewSemanticAnalysisOne[i].Comment == null){
            this.n_commentone.push("Blanks");
          }
          else{
            this.n_commentone.push(data.NewSemanticAnalysisOne[i].Comment);
          }
          this.n_commentonecount.push(data.NewSemanticAnalysisOne[i].Count);
        }
        if(this.n_nps_commentone != undefined){
          this.n_nps_commentone.destroy();
        }
        this.n_nps_commentone = new Chart('n_nps_commentone', {
          type : 'horizontalBar',
          data : {
            labels: this.n_commentone,
            datasets : [
              {
                label : "",
                data : this.n_commentonecount,
                hoverBackgroundColor: 'rgb(27, 152, 17,0.7)',
                backgroundColor: 'rgb(27, 152, 17)',
              }
            ]
          },
          options : options4,
        })
        for(let i = 0; i<data.NewSemanticAnalysisTwo.length;i++){
          if(data.NewSemanticAnalysisTwo[i].Comment == null){
            this.n_commenttwo.push("Blanks");
          }
          else{
            this.n_commenttwo.push(data.NewSemanticAnalysisTwo[i].Comment);
          }
          this.n_commenttwocount.push(data.NewSemanticAnalysisTwo[i].Count);
        }
        if(this.n_nps_commenttwo != undefined){
          this.n_nps_commenttwo.destroy();
        }
        this.n_nps_commenttwo = new Chart('n_nps_commenttwo', {
          type : 'horizontalBar',
          data : {
            labels: this.n_commenttwo,
            datasets : [
              {
                label : "",
                data : this.n_commenttwocount,
                hoverBackgroundColor: 'rgb(236, 74, 21)',
                backgroundColor: 'rgb(236, 74, 21)',
              }
            ]
          },
          options : options4,
        })
        for(let i = 0; i<data.NewSemanticAnalysisThree.length;i++){
          if(data.NewSemanticAnalysisThree[i].Comment == null){
            this.n_commentthree.push("Blanks");
          }
          else{
            this.n_commentthree.push(data.NewSemanticAnalysisThree[i].Comment);
          }
          this.n_commentthreecount.push(data.NewSemanticAnalysisThree[i].Count);
        }
        if(this.n_nps_commentthree != undefined){
          this.n_nps_commentthree.destroy();
        }
        this.n_nps_commentthree = new Chart('n_nps_commentthree', {
          type : 'horizontalBar',
          data : {
            labels: this.n_commentthree,
            datasets : [
              {
                label : "",
                data : this.n_commentthreecount,
                hoverBackgroundColor: 'rgb(17, 141, 255)',
                backgroundColor: 'rgb(17, 141, 255)',
              }
            ]
          },
          options : options4,
        })
        for(let i = 0; i<data.ExistingSemanticAnalysisOne.length;i++){
          if(data.ExistingSemanticAnalysisOne[i].Comment == null){
            this.e_commentone.push("Blanks");
          }
          else{
            this.e_commentone.push(data.ExistingSemanticAnalysisOne[i].Comment);
          }
          this.e_commentonecount.push(data.ExistingSemanticAnalysisOne[i].Count);
        }
        if(this.e_nps_commentone != undefined){
          this.e_nps_commentone.destroy();
        }
        this.e_nps_commentone = new Chart('e_nps_commentone', {
          type : 'horizontalBar',
          data : {
            labels: this.e_commentone,
            datasets : [
              {
                label : "",
                data : this.e_commentonecount,
                hoverBackgroundColor: 'rgb(27, 152, 17,0.7)',
                backgroundColor: 'rgb(27, 152, 17)',
              }
            ]
          },
          options : options4,
        })
        for(let i = 0; i<data.ExistingSemanticAnalysisTwo.length;i++){
          if(data.ExistingSemanticAnalysisTwo[i].Comment == null){
            this.e_commenttwo.push("Blanks");
          }
          else{
            this.e_commenttwo.push(data.ExistingSemanticAnalysisTwo[i].Comment);
          }
          this.e_commenttwocount.push(data.ExistingSemanticAnalysisTwo[i].Count);
        }
        if(this.e_nps_commenttwo != undefined){
          this.e_nps_commenttwo.destroy();
        }
        this.e_nps_commenttwo = new Chart('e_nps_commenttwo', {
          type : 'horizontalBar',
          data : {
            labels: this.e_commenttwo,
            datasets : [
              {
                label : "",
                data : this.e_commenttwocount,
                hoverBackgroundColor: 'rgb(236, 74, 21)',
                backgroundColor: 'rgb(236, 74, 21)',
              }
            ]
          },
          options : options4,
        })
        for(let i = 0; i<data.ExistingSemanticAnalysisThree.length;i++){
          if(data.ExistingSemanticAnalysisThree[i].Comment == null){
            this.e_commentthree.push("Blanks");
          }
          else{
            this.e_commentthree.push(data.ExistingSemanticAnalysisThree[i].Comment);
          }
          this.e_commentthreecount.push(data.ExistingSemanticAnalysisThree[i].Count);
        }
        if(this.e_nps_commentthree != undefined){
          this.e_nps_commentthree.destroy();
        }
        this.e_nps_commentthree = new Chart('e_nps_commentthree', {
          type : 'horizontalBar',
          data : {
            labels: this.e_commentthree,
            datasets : [
              {
                label : "",
                data : this.e_commentthreecount,
                hoverBackgroundColor: 'rgb(17, 141, 255)',
                backgroundColor: 'rgb(17, 141, 255)',
              }
            ]
          },
          options : options4,
        })
        for(let i = 0; i<data.NESemanticAnalysisOne.length;i++){
          if(data.NESemanticAnalysisOne[i].Comment == null){
            this.ne_commentone.push("Blanks");
          }
          else{
            this.ne_commentone.push(data.NESemanticAnalysisOne[i].Comment);
          }
          this.ne_commentonecount.push(data.NESemanticAnalysisOne[i].Count);
        }
        if(this.ne_nps_commentone != undefined){
          this.ne_nps_commentone.destroy();
        }
        this.ne_nps_commentone = new Chart('ne_nps_commentone', {
          type : 'horizontalBar',
          data : {
            labels: this.ne_commentone,
            datasets : [
              {
                label : "",
                data : this.ne_commentonecount,
                hoverBackgroundColor: 'rgb(27, 152, 17,0.7)',
                backgroundColor: 'rgb(27, 152, 17)',
              }
            ]
          },
          options : options4,
        })
        for(let i = 0; i<data.NESemanticAnalysisTwo.length;i++){
          if(data.NESemanticAnalysisTwo[i].Comment == null){
            this.ne_commenttwo.push("Blanks");
          }
          else{
            this.ne_commenttwo.push(data.NESemanticAnalysisTwo[i].Comment);
          }
          this.ne_commenttwocount.push(data.NESemanticAnalysisTwo[i].Count);
        }
        if(this.ne_nps_commenttwo != undefined){
          this.ne_nps_commenttwo.destroy();
        }
        this.ne_nps_commenttwo = new Chart('ne_nps_commenttwo', {
          type : 'horizontalBar',
          data : {
            labels: this.ne_commenttwo,
            datasets : [
              {
                label : "",
                data : this.ne_commenttwocount,
                hoverBackgroundColor: 'rgb(236, 74, 21)',
                backgroundColor: 'rgb(236, 74, 21)',
              }
            ]
          },
          options : options4,
        })
        for(let i = 0; i<data.NESemanticAnalysisThree.length;i++){
          if(data.NESemanticAnalysisThree[i].Comment == null){
            this.ne_commentthree.push("Blanks");
          }
          else{
            this.ne_commentthree.push(data.NESemanticAnalysisThree[i].Comment);
          }
          this.ne_commentthreecount.push(data.NESemanticAnalysisThree[i].Count);
        }
        if(this.ne_nps_commentthree != undefined){
          this.ne_nps_commentthree.destroy();
        }
        this.ne_nps_commentthree = new Chart('ne_nps_commentthree', {
          type : 'horizontalBar',
          data : {
            labels: this.ne_commentthree,
            datasets : [
              {
                label : "",
                data : this.ne_commentthreecount,
                hoverBackgroundColor: 'rgb(17, 141, 255)',
                backgroundColor: 'rgb(17, 141, 255)',
              }
            ]
          },
          options : options4,
        })
      }
    })
  }
  downloadAsPDF(){
    var data = document.getElementById('pdfdata');
    html2canvas(data).then(canvas => {
    const contentDataURL = canvas.toDataURL('image/png');
    let pdf = new jspdf('l', 'px', [1600,this.screenHeight]);
    var position = 0;
    pdf.addImage(contentDataURL, 'PNG', 0, position, 1600, this.screenHeight)
    pdf.save('New-Business.pdf'); 
    });
    var data1 = document.getElementById('pdfdatas');
    html2canvas(data1).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jspdf('l', 'px', [1600,this.screenHeight]);
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, 1600, this.screenHeight)
      pdf.save('Existing Business.pdf');
    });
    var data2 = document.getElementById('combinedpdf');
    html2canvas(data2).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jspdf('l', 'px', [1400,this.screenHeight]);
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, 1400, this.screenHeight)
      pdf.save('New_Business_and_Existing_Business.pdf');
    });
  }
  CurrentYear;SurveySent;ResponsesRecevied;ResponseRate;NPSScore;TargetNPSScore;
  E_SurveySent;E_ResponsesRecevied;E_ResponseRate;E_NPSScore;
  NE_SurveySent;NE_ResponseRate;NE_ResponsesRecevied;NE_NPSScore;
  e_nps_breakdown : any;
  n_nps_breakdown : any;
  e_nps_regionscore : any;
  n_nps_regionscore : any;
  e_nps_regioncount : any;
  n_nps_regioncount : any;
  n_nps_commentone : any;
  n_nps_commenttwo : any;
  n_nps_commentthree : any;
  e_nps_commentone : any;
  e_nps_commenttwo : any;
  e_nps_commentthree : any;
  ne_nps_breakdown : any;
  ne_nps_regionscore : any;
  ne_nps_regioncount : any;
  ne_nps_commentone : any;
  ne_nps_commenttwo : any;
  ne_nps_commentthree : any;
}
