import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardServiceService } from 'src/app/dashboard-service.service';
import { KB_Data } from 'src/app/Models/SteeringCommitte';

@Component({
  selector: 'app-knowledge-base',
  templateUrl: './knowledge-base.component.html',
  styleUrls: ['./knowledge-base.component.css'],
  encapsulation : ViewEncapsulation.None
})
export class KnowledgeBaseComponent implements OnInit {

  constructor(public service : DashboardServiceService) { }
  Search_Filter = new FormControl();
  KnowledgeBaseData : KB_Data[];
  KB_SearchData : KB_Data[];
  displayedColumns : string[] = ['Name'];
  dataSource;
  ShowBackgroundImage : boolean = true;
  searchText = "";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngOnInit(): void {
    this.service.KnowledgeBase().subscribe(data=>{
      this.KB_SearchData = [];
      this.KnowledgeBaseData = data.Data;
      this.dataSource = new MatTableDataSource(this.KB_SearchData);
      this.dataSource.paginator = this.paginator;
      console.log(this.KnowledgeBaseData)
      this.onFilterValueChange();
    })
  }
  onFilterValueChange(){
    this.Search_Filter.valueChanges.subscribe(value => {
      if(this.Search_Filter.value){
        this.ShowBackgroundImage = false;
      }else{
        this.ShowBackgroundImage = true;
      }
      const result = this.KnowledgeBaseData.filter((obj) => {
        return obj.Name.toLowerCase().search(this.Search_Filter.value.toLowerCase()) > -1 || obj.Keywords.toLowerCase().search(this.Search_Filter.value.toLowerCase()) > -1 || obj.Comments.toLowerCase().search(this.Search_Filter.value.toLowerCase()) > -1;
        // obj.Link.toLowerCase().search(this.Search_Filter.value.toLowerCase()) > -1 ||
      });

      this.KB_SearchData = result;
      const re = new RegExp(this.Search_Filter.value, 'igm');
      this.KB_SearchData = this.KB_SearchData.map(data => {
        return{
          Comments : data.Comments.replace(re,"<span class='highlighter'>$&</span>"),
          Name : data.Name.replace(re,"<span class='highlighter'>$&</span>"),
          Type : data.Type,
          Source : data.Source.replace(re,"<span class='highlighter'>$&</span>"),
          Link : data.Link,
          Keywords : data.Keywords
        }
      })
      this.dataSource.data = this.KB_SearchData;
      this.dataSource.paginator = this.paginator;
    });
  }
  onClick(Link : string){
    window.open(Link, "_blank");
  }
}
