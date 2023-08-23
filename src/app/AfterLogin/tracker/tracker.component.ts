import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DashboardServiceService } from 'src/app/dashboard-service.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { Data } from 'src/app/Models/Responce';
import { DatePipe } from '@angular/common';
import { ExcelService } from 'src/app/excel.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LivedashboardComponent } from '../livedashboard/livedashboard.component';
export interface TrackerDialogData {
  Dailog_Client : string;
  Dailog_RevenueID : string;
  Dailog_Comment : string;
}
export class MyFilter {
  RevenueID : string;
  Region : string[];
  Country : string;
  GManager : string;
  RManager : string;
  LManager : string;
  Client : string;
  iMeetWorkspaceTitle : string;
  RevenueVolume : string;
  Project_Level : string[];
  ImplementationType : string;
  ProjectStatus : string[];
  GlobalDigitalOBTLead : string;
  RegionalDigitalOBTLead : string;
  LocalDigitalOBTLead : string;
  GlobalDigitalPortraitLead : string;
  RegionalDigitalPortraitLead : string;
  GlobalDigitalHRFeedSpeciallist : string;
  GDS : string;
  ComplexityScore : string;
  ProjectEffort : string;
  Proposed_Start_Date : string;
  Proposed_End_Date : string;
  Go_Live_Date : string;
  CompleteDuration : string;
  PerCompleted : string;
  MilestoneProjectNotes : string;
  Project_Start_Date : string;
  AssignmentDate_c : string;
  Milestone_Due_Date : string;
  OwnershipType : string;
}
@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.css']
})
export class TrackerComponent implements OnInit {
  constructor(public service : DashboardServiceService,public dialog: MatDialog,public dashboard : LivedashboardComponent,public datepipe : DatePipe,private excelservice : ExcelService) {
    // set screenWidth on page load
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    window.onresize = () => {
      // set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    };
  }
  date = new Date();
  FirstWeek;SecondWeek;ThirdWeek;FourthWeek;FifthWeek;SixthWeek;SeventhWeek;EigthWeek;NinthWeek;TenthWeek;ElevenWeek;TwelvethWeek;
  C13thweek;C14thWeek;C15thWeek;C16thWeek;C17thWeek;C18thWeek;C19thWeek;C20thWeek;C21stWeek;C22ndWeek;C23rdWeek;C24thWeek;
  displayedColumns: string[] = ['Client','Country','Region','RevenueID','iMeetWorkspaceTitle','GManager','RManager','LManager','RevenueVolume','Project_Level','ImplementationType','ProjectStatus','OwnershipType','MilestoneProjectNotes','ProjectEffort','GlobalDigitalOBTLead','RegionalDigitalOBTLead','LocalDigitalOBTLead','GlobalDigitalPortraitLead','RegionalDigitalPortraitLead','GlobalDigitalHRFeedSpeciallist','GDS','ComplexityScore','AssignmentDate_c','Project_Start_Date','Milestone_Due_Date','Proposed_Start_Date','Go_Live_Date','Proposed_End_Date','CompleteDuration','PerCompleted','FirstWeek','SecondWeek','ThirdWeek','FourthWeek','FivthWeek','SixthWeek','SeventhWeek','EighthWeek','NinthWeek','TenthWeek','EleventhWeek','twelvethWeek','C13thweek','C14thWeek','C15thWeek','C16thWeek','C17thWeek','C18thWeek','C19thWeek','C20thWeek','C21stWeek','C22ndWeek','C23rdWeek','C24thWeek'];
  displayedColumns_h: string[] = ['Client_h','Country_h','Region_h','RevenueID_h','iMeetWorkspaceTitle_h','GManager_h','RManager_h','LManager_h','RevenueVolume_h','Project_Level_h','ImplementationType_h','ProjectStatus_h','OwnershipType_h','MilestoneProjectNotes_h','ProjectEffort_h','GlobalDigitalOBTLead_h','RegionalDigitalOBTLead_h','LocalDigitalOBTLead_h','GlobalDigitalPortraitLead_h','RegionalDigitalPortraitLead_h','GlobalDigitalHRFeedSpeciallist_h','GDS_h','ComplexityScore_h','AssignmentDate_c_h','Project_Start_Date_h','Milestone_Due_Date_h','Proposed_Start_Date_h','Go_Live_Date_h','Proposed_End_Date_h','CompleteDuration_h','PerCompleted_h','FirstWeek_h'];//,'SecondWeek_h','ThirdWeek_h','FourthWeek_h','FivthWeek_h','SixthWeek_h','SeventhWeek_h','EighthWeek_h','NinthWeek_h','TenthWeek_h','EleventhWeek_h','twelvethWeek_h','C13thweek_h','C14thWeek_h','C15thWeek_h','C16thWeek_h','C17thWeek_h','C18thWeek_h','C19thWeek_h','C20thWeek_h','C21stWeek_h','C22ndWeek_h','C23rdWeek_h','C24thWeek_h'
  // displayedColumns: string[] = ['Region', 'Country','GManager','RManager','LManager','Client','iMeetWorkspaceTitle','RevenueVolume','Project_Level','ImplementationType','ProjectStatus','Proposed_Start_Date','Proposed_End_Date','Go_Live_Date','ProjectEffort','CompleteDuration','PerCompleted'];
  // displayedColumns_h: string[] = ['Region_h', 'Country_h','GManager_h','RManager_h','LManager_h','Client_h','iMeetWorkspaceTitle_h','RevenueVolume_h','Project_Level_h','ImplementationType_h','ProjectStatus_h','Proposed_Start_Date_h','Proposed_End_Date_h','Go_Live_Date_h','ProjectEffort_h','CompleteDuration_h','PerCompleted_h'];
  filteredValues : MyFilter = { RevenueID : '',
    Region : [],
    Country : '',
    GManager : '',
    RManager : '',
    LManager : '',
    Client : '',
    iMeetWorkspaceTitle : '',
    RevenueVolume : '',
    Project_Level : [],
    ImplementationType : '',
    ProjectStatus : [],
    GlobalDigitalOBTLead : '',
    RegionalDigitalOBTLead : '',
    LocalDigitalOBTLead : '',
    GlobalDigitalPortraitLead : '',
    RegionalDigitalPortraitLead : '',
    GlobalDigitalHRFeedSpeciallist : '',
    GDS : '',
    ComplexityScore : '',
    ProjectEffort : '',
    Proposed_Start_Date : '',
    Proposed_End_Date : '',
    Go_Live_Date : '',
    CompleteDuration : '',
    PerCompleted : '',
    MilestoneProjectNotes : '',
    Project_Start_Date : '',
    AssignmentDate_c : '',
    Milestone_Due_Date : '',
    OwnershipType : ''};
  screenWidth : number;
  screenHeight  : number;
  RevenueIDFilter = new FormControl();
  RegionFilter = new FormControl();
  CountryFilter = new FormControl();
  GManagerFilter = new FormControl();
  RManagerFilter = new FormControl();
  LManagerFilter = new FormControl();
  ClientFilter = new FormControl();
  iMeetWorkspaceTitleFilter = new FormControl();
  RevenueVolumeFilter = new FormControl();
  Project_LevelFilter = new FormControl();
  ImplementationTypeFilter = new FormControl();
  ProjectStatusFilter = new FormControl();
  GlobalDigitalOBTLeadFilter = new FormControl();
  RegionalDigitalOBTLeadFilter = new FormControl();
  LocalDigitalOBTLeadFilter = new FormControl();
  GlobalDigitalPortraitLeadFilter = new FormControl();
  RegionalDigitalPortraitLeadFilter = new FormControl();
  GlobalDigitalHRFeedSpeciallistFilter = new FormControl();
  GDSFilter = new FormControl();
  ComplexityScoreFilter = new FormControl();
  ProjectEffortFilter = new FormControl();
  Proposed_Start_DateFilter = new FormControl();
  Proposed_End_DateFilter = new FormControl();
  Go_Live_DateFilter = new FormControl();
  CompleteDurationFilter = new FormControl();
  PerCompletedFilter = new FormControl();
  MilestoneProjectNotesFilter = new FormControl();
  Project_Start_DateFilter = new FormControl();
  AssignmentDate_cFilter = new FormControl();
  Milestone_Due_DateFilter = new FormControl();
  OwnershipTypeFilter = new FormControl();
  TrackerData : Data[];
  RegionList : any = [];
  ProjectLevelList : any = [];
  ProjectStatusList : any = [];
  masterRegion : boolean;
  // masterRegion : boolean;
  masterProjectStatus : boolean;
  masterProjectLevel : boolean;
  dataSource;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngAfterViewInit() {
  }
  customFilterPredicate() {
    return (data: Data, filter: string): boolean => {
      let searchString = JSON.parse(filter) as MyFilter;
      let isRegionAvailable = false;
      let isProjectLevelAvailable = false;
      let isProjectStatusAvailable = false;
      if (searchString.Region.length) {
        for (const d of searchString.Region) {
          if (data.Region.toString().trim() == d) {
            isRegionAvailable = true;
          }
        }
      } else {
        isRegionAvailable = true;
      }
      if (searchString.ProjectStatus.length) {
        for (const d of searchString.ProjectStatus) {
          if (data.ProjectStatus.toString().trim() == d) {
            isProjectStatusAvailable = true;
          }
        }
      } else {
        isProjectStatusAvailable = true;
      }
      if (searchString.Project_Level.length) {
        for (const d of searchString.Project_Level) {
          if (data.Project_Level.toString().trim() == d) {
            isProjectLevelAvailable = true;
          }
        }
      } else {
        isProjectLevelAvailable = true;
      }
      return (
        isRegionAvailable &&
        isProjectStatusAvailable &&
        isProjectLevelAvailable &&
        data.RevenueID.toString().trim().toLowerCase().indexOf(searchString.RevenueID.toLowerCase()) !== -1 &&
        // data.Region.toString().trim().toLowerCase().indexOf(searchString.Region.toLowerCase()) !== -1 &&
        data.Country.toString().trim().toLowerCase().indexOf(searchString.Country.toLowerCase()) !== -1 &&
        data.GManager.toString().trim().toLowerCase().indexOf(searchString.GManager.toLowerCase()) !== -1 &&
        data.RManager.toString().trim().toLowerCase().indexOf(searchString.RManager.toLowerCase()) !== -1 &&
        data.LManager.toString().trim().toLowerCase().indexOf(searchString.LManager.toLowerCase()) !== -1 &&
        data.Client.toString().trim().toLowerCase().indexOf(searchString.Client.toLowerCase()) !== -1 &&
        data.iMeetWorkspaceTitle.toString().trim().toLowerCase().indexOf(searchString.iMeetWorkspaceTitle.toLowerCase()) !== -1 &&
        data.RevenueVolume.toString().trim().toLowerCase().indexOf(searchString.RevenueVolume.toLowerCase()) !== -1 &&
        // data.Project_Level.toString().trim().toLowerCase().indexOf(searchString.Project_Level.toLowerCase()) !== -1 &&
        data.ImplementationType.toString().trim().toLowerCase().indexOf(searchString.ImplementationType.toLowerCase()) !== -1 &&
        // data.ProjectStatus.toString().trim().toLowerCase().indexOf(searchString.ProjectStatus.toLowerCase()) !== -1 &&
        data.GlobalDigitalOBTLead.toString().trim().toLowerCase().indexOf(searchString.GlobalDigitalOBTLead.toLowerCase()) !== -1 &&
        data.RegionalDigitalOBTLead.toString().trim().toLowerCase().indexOf(searchString.RegionalDigitalOBTLead.toLowerCase()) !== -1 &&
        data.LocalDigitalOBTLead.toString().trim().toLowerCase().indexOf(searchString.LocalDigitalOBTLead.toLowerCase()) !== -1 &&
        data.GlobalDigitalPortraitLead.toString().trim().toLowerCase().indexOf(searchString.GlobalDigitalPortraitLead.toLowerCase()) !== -1 &&
        data.RegionalDigitalPortraitLead.toString().trim().toLowerCase().indexOf(searchString.RegionalDigitalPortraitLead.toLowerCase()) !== -1 &&
        data.GlobalDigitalHRFeedSpeciallist.toString().trim().toLowerCase().indexOf(searchString.GlobalDigitalHRFeedSpeciallist.toLowerCase()) !== -1 &&
        data.GDS.toString().trim().toLowerCase().indexOf(searchString.GDS.toLowerCase()) !== -1 &&
        data.ComplexityScore.toString().trim().toLowerCase().indexOf(searchString.ComplexityScore.toLowerCase()) !== -1 &&
        data.ProjectEffort.toString().trim().toLowerCase().indexOf(searchString.ProjectEffort.toLowerCase()) !== -1 &&
        data.Proposed_Start_Date.toString().trim().toLowerCase().indexOf(searchString.Proposed_Start_Date.toLowerCase()) !== -1 &&
        data.Proposed_End_Date.toString().trim().toLowerCase().indexOf(searchString.Proposed_End_Date.toLowerCase()) !== -1 &&
        data.Go_Live_Date.toString().trim().toLowerCase().indexOf(searchString.Go_Live_Date.toLowerCase()) !== -1 &&
        data.CompleteDuration.toString().trim().toLowerCase().indexOf(searchString.CompleteDuration.toLowerCase()) !== -1 &&
        data.PerCompleted.toString().trim().toLowerCase().indexOf(searchString.PerCompleted.toLowerCase()) !== -1  &&
        data.MilestoneProjectNotes.toString().trim().toLowerCase().indexOf(searchString.MilestoneProjectNotes.toLowerCase()) !== -1  &&
        data.Project_Start_Date.toString().trim().toLowerCase().indexOf(searchString.Project_Start_Date.toLowerCase()) !== -1  &&
        data.AssignmentDate_c.toString().trim().toLowerCase().indexOf(searchString.AssignmentDate_c.toLowerCase()) !== -1  &&
        data.Milestone_Due_Date.toString().trim().toLowerCase().indexOf(searchString.Milestone_Due_Date.toLowerCase()) !== -1  &&
        data.OwnershipType.toString().trim().toLowerCase().indexOf(searchString.OwnershipType.toLowerCase()) !== -1 
      )
    }
  }
  FilteredVolume;FilteredCount;
  onFilterValueChange(){
    this.RevenueIDFilter.valueChanges.subscribe(value => {
      this.filteredValues["RevenueID"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.RegionFilter.valueChanges.subscribe(value => {
      this.filteredValues["Region"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.CountryFilter.valueChanges.subscribe(value => {
      this.filteredValues["Country"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.GManagerFilter.valueChanges.subscribe(value => {
      this.filteredValues["GManager"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.RManagerFilter.valueChanges.subscribe(value => {
      this.filteredValues["RManager"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.LManagerFilter.valueChanges.subscribe(value => {
      this.filteredValues["LManager"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.ClientFilter.valueChanges.subscribe(value => {
      this.filteredValues["Client"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.iMeetWorkspaceTitleFilter.valueChanges.subscribe(value => {
      this.filteredValues["iMeetWorkspaceTitle"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.RevenueVolumeFilter.valueChanges.subscribe(value => {
      this.filteredValues["RevenueVolume"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.Project_LevelFilter.valueChanges.subscribe(value => {
      this.filteredValues["Project_Level"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.ImplementationTypeFilter.valueChanges.subscribe(value => {
      this.filteredValues["ImplementationType"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.ProjectStatusFilter.valueChanges.subscribe(value => {
      this.filteredValues["ProjectStatus"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.GlobalDigitalOBTLeadFilter.valueChanges.subscribe(value => {
      this.filteredValues["GlobalDigitalOBTLead"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.RegionalDigitalOBTLeadFilter.valueChanges.subscribe(value => {
      this.filteredValues["RegionalDigitalOBTLead"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.LocalDigitalOBTLeadFilter.valueChanges.subscribe(value => {
      this.filteredValues["LocalDigitalOBTLead"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.GlobalDigitalPortraitLeadFilter.valueChanges.subscribe(value => {
      this.filteredValues["GlobalDigitalPortraitLead"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.RegionalDigitalPortraitLeadFilter.valueChanges.subscribe(value => {
      this.filteredValues["RegionalDigitalPortraitLead"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.GlobalDigitalHRFeedSpeciallistFilter.valueChanges.subscribe(value => {
      this.filteredValues["GlobalDigitalHRFeedSpeciallist"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.GDSFilter.valueChanges.subscribe(value => {
      this.filteredValues["GDS"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.ComplexityScoreFilter.valueChanges.subscribe(value => {
      this.filteredValues["ComplexityScore"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.ProjectEffortFilter.valueChanges.subscribe(value => {
      this.filteredValues["ProjectEffort"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.Proposed_Start_DateFilter.valueChanges.subscribe(value => {
      this.filteredValues["Proposed_Start_Date"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.Proposed_End_DateFilter.valueChanges.subscribe(value => {
      this.filteredValues["Proposed_End_Date"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.Go_Live_DateFilter.valueChanges.subscribe(value => {
      this.filteredValues["Go_Live_Date"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.CompleteDurationFilter.valueChanges.subscribe(value => {
      this.filteredValues["CompleteDuration"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.PerCompletedFilter.valueChanges.subscribe(value => {
      this.filteredValues["PerCompleted"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.MilestoneProjectNotesFilter.valueChanges.subscribe(value => {
      this.filteredValues["MilestoneProjectNotes"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.Milestone_Due_DateFilter.valueChanges.subscribe(value => {
      this.filteredValues["Milestone_Due_Date"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.Project_Start_DateFilter.valueChanges.subscribe(value => {
      this.filteredValues["Project_Start_Date"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.AssignmentDate_cFilter.valueChanges.subscribe(value => {
      this.filteredValues["AssignmentDate_c"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.OwnershipTypeFilter.valueChanges.subscribe(value => {
      this.filteredValues["OwnershipType"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.dataSource.filterPredicate = this.customFilterPredicate();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  GetData(){
    var day = this.date.getDay();
    var diff = this.date.getDate() - day + (day == 0 ? -6:1);
    this.FirstWeek = this.datepipe.transform(this.date.setDate(diff), "dd-MMM-yyyy");
    this.SecondWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.ThirdWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.FourthWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.FifthWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.SixthWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.SeventhWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.EigthWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.NinthWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.TenthWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.ElevenWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.TwelvethWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.C13thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.C14thWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.C15thWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.C16thWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.C17thWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.C18thWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.C19thWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.C20thWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.C21stWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.C22ndWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.C23rdWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.C24thWeek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.dashboard.ShowSpinnerHandler(true);
    this.service.Tracker().subscribe(data =>{
      if(data.code == 200){
        this.TrackerData = data.Data;
        data.Data.forEach(item =>{
          this.ProjectLevelList.push(item.Project_Level);
          this.ProjectStatusList.push(item.ProjectStatus);
          this.RegionList.push(item.Region);
        })
        for(let i = 0;i<data.Data.length;i++){
          if(this.TrackerData[i].Proposed_End_Date__Formula_ == null){
            this.TrackerData[i].Proposed_End_Date = "---";
          }else{
            this.TrackerData[i].Proposed_End_Date = this.datepipe.transform(this.TrackerData[i].Proposed_End_Date__Formula_, "yyyy-MMM-dd");
          }
          if(this.TrackerData[i].Proposed_Start_Date__iMeet_ == null){
            this.TrackerData[i].Proposed_Start_Date = "---";
          }else{
            this.TrackerData[i].Proposed_Start_Date = this.datepipe.transform(this.TrackerData[i].Proposed_Start_Date__iMeet_, "yyyy-MMM-dd");
          }
          if(this.TrackerData[i].Go_Live_Date__iMeet_ == null){
            this.TrackerData[i].Go_Live_Date = "---";
          }else{
            this.TrackerData[i].Go_Live_Date = this.datepipe.transform(this.TrackerData[i].Go_Live_Date__iMeet_, "yyyy-MMM-dd");
          }
          if(this.TrackerData[i].ProjectDelay == null){
            this.TrackerData[i].CompleteDuration = "0 Weeks";
          }else{
            this.TrackerData[i].CompleteDuration = Math.round(this.TrackerData[i].ProjectDelay)+' Weeks';
          }
          if(this.TrackerData[i].AssignmentDate == null){
            this.TrackerData[i].AssignmentDate_c = "---";
          }else{
            this.TrackerData[i].AssignmentDate_c = this.datepipe.transform(this.TrackerData[i].AssignmentDate, "yyyy-MMM-dd");
          }
          if(this.TrackerData[i].ProjectStartDate == null){
            this.TrackerData[i].Project_Start_Date = "---";
          }else{
            this.TrackerData[i].Project_Start_Date = this.datepipe.transform(this.TrackerData[i].ProjectStartDate, "yyyy-MMM-dd");
          }
          if(this.TrackerData[i].MilestoneDueDate == null){
            this.TrackerData[i].Milestone_Due_Date = "---";
          }else{
            this.TrackerData[i].Milestone_Due_Date = this.datepipe.transform(this.TrackerData[i].MilestoneDueDate, "yyyy-MMM-dd");
          }
          if(this.TrackerData[i].MilestoneDueDateByLevel == null){
            this.TrackerData[i].MilestoneDueDate_ByLevel = "---";
          }else{
            this.TrackerData[i].MilestoneDueDate_ByLevel = this.datepipe.transform(this.TrackerData[i].MilestoneDueDateByLevel, "yyyy-MMM-dd");
          }
          this.TrackerData[i].RevenueVolumeUSD = Math.round(this.TrackerData[i].RevenueVolume).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
          this.TrackerData[i].FirstWeek = this.TrackerData[i].FirstWeek ?? 0;
          this.TrackerData[i].SecondWeek = this.TrackerData[i].SecondWeek ?? 0;
          this.TrackerData[i].ThirdWeek = this.TrackerData[i].ThirdWeek ?? 0;
          this.TrackerData[i].FourthWeek = this.TrackerData[i].FourthWeek ?? 0;
          this.TrackerData[i].FivthWeek = this.TrackerData[i].FivthWeek ?? 0;
          this.TrackerData[i].SixthWeek = this.TrackerData[i].SixthWeek ?? 0;
          this.TrackerData[i].SeventhWeek = this.TrackerData[i].SeventhWeek ?? 0;
          this.TrackerData[i].EighthWeek = this.TrackerData[i].EighthWeek ?? 0;
          this.TrackerData[i].NinthWeek = this.TrackerData[i].NinthWeek ?? 0;
          this.TrackerData[i].TenthWeek = this.TrackerData[i].TenthWeek ?? 0;
          this.TrackerData[i].EleventhWeek = this.TrackerData[i].EleventhWeek ?? 0;
          this.TrackerData[i].twelvethWeek = this.TrackerData[i].twelvethWeek ?? 0;
          this.TrackerData[i].C13thweek = this.TrackerData[i].C13thweek ?? 0;
          this.TrackerData[i].C14thWeek = this.TrackerData[i].C14thWeek ?? 0;
          this.TrackerData[i].C15thWeek = this.TrackerData[i].C15thWeek ?? 0;
          this.TrackerData[i].C16thWeek = this.TrackerData[i].C16thWeek ?? 0;
          this.TrackerData[i].C17thWeek = this.TrackerData[i].C17thWeek ?? 0;
          this.TrackerData[i].C18thWeek = this.TrackerData[i].C18thWeek ?? 0;
          this.TrackerData[i].C19thWeek = this.TrackerData[i].C19thWeek ?? 0;
          this.TrackerData[i].C20thWeek = this.TrackerData[i].C20thWeek ?? 0;
          this.TrackerData[i].C21stWeek = this.TrackerData[i].C21stWeek ?? 0;
          this.TrackerData[i].C22ndWeek = this.TrackerData[i].C22ndWeek ?? 0;
          this.TrackerData[i].C23rdWeek = this.TrackerData[i].C23rdWeek ?? 0;
          this.TrackerData[i].C24thWeek = this.TrackerData[i].C24thWeek ?? 0;
          this.TrackerData[i].AvgUtil = (this.TrackerData[i].FirstWeek+this.TrackerData[i].SecondWeek+this.TrackerData[i].ThirdWeek+this.TrackerData[i].FourthWeek)/4
        }
        this.RegionList = this.RegionList.filter((item,index) => this.RegionList.indexOf(item) === index);
        this.ProjectStatusList = this.ProjectStatusList.filter((item,index) => this.ProjectStatusList.indexOf(item) === index);
        this.ProjectLevelList = this.ProjectLevelList.filter((item,index) => this.ProjectLevelList.indexOf(item) === index);
        this.dataSource = null;
        this.dataSource = new MatTableDataSource(this.TrackerData);
        this.onFilterValueChange();
        this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
        this.FilteredCount = this.dataSource.filteredData.length;
        this.dashboard.ShowSpinnerHandler(false);
      }else{
        this.dataSource = null;
        this.dashboard.ShowSpinnerHandler(false);
      }
    });
  }
  ResetFilter(){
    this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
    this.FilteredCount = this.dataSource.filteredData.length;
    this.RevenueIDFilter.setValue("");
    this.RegionFilter.setValue("");
    this.CountryFilter.setValue("");
    this.GManagerFilter.setValue("");
    this.RManagerFilter.setValue("");
    this.LManagerFilter.setValue("");
    this.ClientFilter.setValue("");
    this.iMeetWorkspaceTitleFilter.setValue("");
    this.RevenueVolumeFilter.setValue("");
    this.Project_LevelFilter.setValue("");
    this.ImplementationTypeFilter.setValue("");
    this.ProjectStatusFilter.setValue("");
    this.GlobalDigitalOBTLeadFilter.setValue("");
    this.RegionalDigitalOBTLeadFilter.setValue("");
    this.LocalDigitalOBTLeadFilter.setValue("");
    this.GlobalDigitalPortraitLeadFilter.setValue("");
    this.RegionalDigitalPortraitLeadFilter.setValue("");
    this.GlobalDigitalHRFeedSpeciallistFilter.setValue("");
    this.GDSFilter.setValue("");
    this.ComplexityScoreFilter.setValue("");
    this.ProjectEffortFilter.setValue("");
    this.Proposed_Start_DateFilter.setValue("");
    this.Proposed_End_DateFilter.setValue("");
    this.Go_Live_DateFilter.setValue("");
    this.CompleteDurationFilter.setValue("");
    this.PerCompletedFilter.setValue("");
    this.MilestoneProjectNotesFilter.setValue("");
    this.Project_Start_DateFilter.setValue("");
    this.AssignmentDate_cFilter.setValue("");
    this.Milestone_Due_DateFilter.setValue("");
    this.OwnershipTypeFilter.setValue("");
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(TrackerCommentdailog, {
      // width: '400px',
      data: {Dailog_Comment: this.Dailog_Comment,Dailog_Client : this.Dailog_Client,Dailog_RevenueID : this.Dailog_RevenueID}
    });
    dialogRef.afterClosed().subscribe(result => {
      //this.Comment = result;
      // this.GetData();
    });
  }
  Dailog_Comment : string;
  Dailog_RevenueID : string;
  Dailog_Client : string;
  ShowComment(Dailog_Client : string,Dailog_RevenueID : string,Dailog_Comment : string){
    this.Dailog_Client = Dailog_Client;
    this.Dailog_RevenueID = Dailog_RevenueID;
    this.Dailog_Comment = Dailog_Comment;
    this.openDialog();
  }
  ngOnInit(): void {
    this.GetData();
  }
  onRegionchange(){
    if(this.RegionList.length == this.RegionFilter.value.length){
      this.masterRegion = true;
    }else{
      this.masterRegion = false;
    }
  }
  checkUncheckRegion(){
    if(this.masterRegion == true){
      this.RegionFilter.setValue(this.RegionList);
    }else{
      this.RegionFilter.setValue("");
    }
  }
  onProjectStatuschange(){
    if(this.ProjectStatusList.length == this.ProjectStatusFilter.value.length){
      this.masterProjectStatus = true;
    }else{
      this.masterProjectStatus = false;
    }
  }
  checkUncheckProjectStatus(){
    if(this.masterProjectStatus == true){
      this.ProjectStatusFilter.setValue(this.ProjectStatusList);
    }else{
      this.ProjectStatusFilter.setValue("");
    }
  }
  checkUncheckProjectLevel(){
    if(this.masterProjectLevel == true){
      this.Project_LevelFilter.setValue(this.ProjectLevelList);
    }else{
      this.Project_LevelFilter.setValue("");
    }
  }
  onProjectLevelchange(){
    if(this.ProjectLevelList.length == this.Project_LevelFilter.value.length){
      this.masterProjectLevel = true;
    }else{
      this.masterProjectLevel = false;
    }
  }
  exportTracker(){
    this.dashboard.ShowSpinnerHandler(true);
    this.service.Tracker().subscribe(data =>{
      if(data.code == 200){
        for(let i = 0;i<data.Data.length;i++){
          if(data.Data[i].Go_Live_Date__iMeet_ == null){
            data.Data[i].Go_Live_Date__iMeet_ = null;
          }else{
            data.Data[i].Go_Live_Date__iMeet_ = new Date(data.Data[i].Go_Live_Date__iMeet_);
          }
          if(data.Data[i].Proposed_Start_Date__iMeet_ == null){
            data.Data[i].Proposed_Start_Date__iMeet_ = null;
          }else{
            data.Data[i].Proposed_Start_Date__iMeet_ = new Date(data.Data[i].Proposed_Start_Date__iMeet_);
          }
          if(data.Data[i].Proposed_End_Date__Formula_ == null){
            data.Data[i].Proposed_End_Date__Formula_ = null;
          }else{
            data.Data[i].Proposed_End_Date__Formula_ = new Date(data.Data[i].Proposed_End_Date__Formula_);
          }
          if(data.Data[i].ProjectDelay == null){
            data.Data[i].CompleteDuration = "0 Weeks";
          }else{
            data.Data[i].CompleteDuration = Math.round(data.Data[i].ProjectDelay)+' Weeks';
          }
          if(data.Data[i].AssignmentDate == null){
            data.Data[i].AssignmentDate = null;
          }else{
            data.Data[i].AssignmentDate = new Date(data.Data[i].AssignmentDate);
          }
          if(data.Data[i].ProjectStartDate == null){
            data.Data[i].ProjectStartDate = null;
          }else{
            data.Data[i].ProjectStartDate = new Date(data.Data[i].ProjectStartDate);
          }
          if(data.Data[i].MilestoneDueDate == null){
            data.Data[i].MilestoneDueDate = null;
          }else{
            data.Data[i].MilestoneDueDate = new Date(data.Data[i].MilestoneDueDate);
          }
          if(data.Data[i].MilestoneDueDateByLevel == null){
            data.Data[i].MilestoneDueDateByLevel = null;
          }else{
            data.Data[i].MilestoneDueDateByLevel = new Date(data.Data[i].MilestoneDueDateByLevel);
          }
        }
        const CustomizedData = data.Data.map(o => {
          return {
            'Client': o.Client == "---" ? "" : o.Client,
            'Workspace Title' : o.iMeetWorkspaceTitle,
            'GLobal Manager' : o.GManager,
            'Regional Manager' : o.RManager,
            'Local Manager' : o.LManager,
            'Revenue ID' : o.RevenueID,
            'Region' : o.Region,
            'Country' : o.Country,
            'Ownership Type' : o.OwnershipType,
            'Revenue Volume' : o.RevenueVolume,
            'Project Level' : o.Project_Level,
            'Implementation Type' : o.ImplementationType,
            //Servicing_location : o.Servicing_location,
            'Project Status' : o.ProjectStatus,
            //New_Business_volume__US___c : o.New_Business_volume__US___c,
            'Project Effort' : o.ProjectEffort,
            'GlobalDigitalOBTLead' : o.GlobalDigitalOBTLead,
            'RegionalDigitalOBTLead' : o.RegionalDigitalOBTLead,
            'LocalDigitalOBTLead' : o.LocalDigitalOBTLead,
            'GlobalDigitalPortraitLead' : o.GlobalDigitalPortraitLead,
            'RegionalDigitalPortraitLead' : o.RegionalDigitalPortraitLead,
            'GlobalDigitalHRFeedSpeciallist' : o.GlobalDigitalHRFeedSpeciallist,
            'Milestone Project Notes' : o.MilestoneProjectNotes,
            'Assignment Date' : o.AssignmentDate,
            'Project Start Date' : o.ProjectStartDate,
            'Milestone Due Date' : o.MilestoneDueDate,
            'Milestone Due Date By Level' : o.MilestoneDueDateByLevel,
            'Host External Kickoff Date/ Proposed Start Date'  : o.Proposed_Start_Date__iMeet_,
            'Go-Live Date' : o.Go_Live_Date__iMeet_,
            'End of HyperCare' : o.Proposed_End_Date__Formula_,
            // 'Project Status' : o.ProjectStatus == "---" ? "" : o.ProjectStatus,
            'Complete Duration' : o.CompleteDuration,
            '% Completed' : o.PerCompleted,
            [this.FirstWeek] : o.FirstWeek,
            [this.SecondWeek] : o.SecondWeek,
            [this.ThirdWeek] : o.ThirdWeek,
            [this.FourthWeek]  : o.FourthWeek,
            [this.FifthWeek] : o.FivthWeek,
            [this.SixthWeek] : o.SixthWeek,
            [this.SeventhWeek] : o.SeventhWeek,
            [this.EigthWeek] : o.EighthWeek,
            [this.NinthWeek] : o.NinthWeek,
            [this.TenthWeek] : o.TenthWeek,
            [this.ElevenWeek] : o.EleventhWeek,
            [this.TwelvethWeek] : o.twelvethWeek,
            [this.C13thweek] : o.C13thweek,
            [this.C14thWeek] : o.C14thWeek,
            [this.C15thWeek] : o.C15thWeek,
            [this.C16thWeek] : o.C16thWeek,
            [this.C17thWeek] : o.C17thWeek,
            [this.C18thWeek] : o.C18thWeek,
            [this.C19thWeek] : o.C19thWeek,
            [this.C20thWeek] : o.C20thWeek,
            [this.C21stWeek] : o.C21stWeek,
            [this.C22ndWeek] : o.C22ndWeek,
            [this.C23rdWeek] : o.C23rdWeek,
            [this.C24thWeek] : o.C24thWeek
          };
        });
        this.excelservice.exportAsExcelFile(CustomizedData, 'Tracker');
        this.dashboard.ShowSpinnerHandler(false);
      }else{
        alert("Something went wrong please try again later");
        this.dashboard.ShowSpinnerHandler(false);
      }
    })
  }
}
@Component({
  selector: 'app-trackercommentdailog',
  templateUrl: './trackercommentdailog.component.html',
  styleUrls: ['./trackercommentdailog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TrackerCommentdailog {
  constructor(
    public dialogRef: MatDialogRef<TrackerCommentdailog>,
    @Inject(MAT_DIALOG_DATA) public data: TrackerDialogData) {
    }
  onNoClick(): void {
    this.dialogRef.close();
  }
}