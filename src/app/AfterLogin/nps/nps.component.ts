import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-nps',
  templateUrl: './nps.component.html',
  styleUrls: ['./nps.component.css']
})
export class NPSComponent implements OnInit {
  src = 'http://www.cwtdashboard.com/excelfolder/NPS.pdf';
  constructor() { }
  ngOnInit(): void {
  }
  ExportNPS(){
    window.open('http://www.cwtdashboard.com/excelfolder/NPS.pdf', "_blank");
  }
}