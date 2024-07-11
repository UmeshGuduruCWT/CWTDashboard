import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public Sanitizer : DomSanitizer) { }
  powerBiLink;
  ngOnInit(): void {
    this.powerBiLink = this.Sanitizer.bypassSecurityTrustResourceUrl("https://app.powerbi.com/view?r=eyJrIjoiMWY3NDQ5ZmQtZjZjNC00ZWE2LTk5ZWMtYmI2NDMxZDYzOGM1IiwidCI6ImNhZmU0YTY3LTk0NzUtNDc3Ni04OWZkLTRiNDcyODYwMDk2MiIsImMiOjN9");
  }

}
