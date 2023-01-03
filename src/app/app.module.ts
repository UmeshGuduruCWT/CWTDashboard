import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { DashboardComponent } from './AfterLogin/dashboard/dashboard.component';
import { LoadingSpinnerComponent } from './Other/loading-spinner/loading-spinner.component';
import { ImplementationMarketReportComponent, CommentsDialog, DataDialog } from './AfterLogin/implementation-market-report/implementation-market-report.component';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CriticalTasksOverDueComponent } from './AfterLogin/critical-tasks-over-due/critical-tasks-over-due.component';
import { ImplementationProjectStatusComponent,ImplementationProjectStatusdailog } from './AfterLogin/implementation-project-status/implementation-project-status.component';
import { ELTReportComponent, EltDailog, PriorMonthData } from './AfterLogin/eltreport/eltreport.component';
import { CapacityManagementComponent } from './AfterLogin/capacity-management/capacity-management.component';
import { ESowReportComponent } from './AfterLogin/e-sow-report/e-sow-report.component';
import { CommentDialogComponent } from './Dialog/comment-dialog/comment-dialog.component';
import { StageGateTestingComponent } from './AfterLogin/stage-gate-testing/stage-gate-testing.component';
import { LessonsLearntComponent, LessonsLearntdailog } from './AfterLogin/lessons-learnt/lessons-learnt.component';
import { ExcelService } from './excel.service';
import { HomepageComponent } from './AfterLogin/homepage/homepage.component';import {MatAutocompleteModule} from '@angular/material/autocomplete';
//import { MarketImplementationComponent } from './AfterLogin/market-implementation/market-implementation.component';
import { RefreshComponent } from './AfterLogin/refresh/refresh.component';
import { CycleTimeComponent } from './AfterLogin/cycle-time/cycle-time.component';
import { HierarchyComponent, AddingUser, DeleteUser } from './AfterLogin/hierarchy/hierarchy.component';
import { PerformanceLeaderComponent } from './AfterLogin/performance-leader/performance-leader.component';
//import { SelectAutocompleteModule } from 'mat-select-autocomplete';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { TrackerComponent,TrackerCommentdailog } from './AfterLogin/tracker/tracker.component';
import { ResourceComment, ResourceUtilizationComponent } from './AfterLogin/resource-utilization/resource-utilization.component';
import { CapacityHierarchyComponent, CapacityHierarchyDailog, DeleteUserDailog } from './AfterLogin/capacity-hierarchy/capacity-hierarchy.component';
import { ProspectComponent } from './AfterLogin/prospect/prospect.component';
import { CLRExportComponent } from './clrexport/clrexport.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { LivedashboardComponent } from './AfterLogin/livedashboard/livedashboard.component';
import { LiveHomePageComponent } from './AfterLogin/live-home-page/live-home-page.component';
import { MatTableFilterModule } from 'mat-table-filter';
import { ProfileComponent, ProfileDialog } from './AfterLogin/profile/profile.component';
import { StatsComponent } from './AfterLogin/stats/stats.component';
import { AdmincontrolComponent,EditUserAccess,GrantAccessDialog,AdminDeleteDialog } from './AfterLogin/admincontrol/admincontrol.component';
import { AutomatedCLRComponent, CLRCommentdailog,DigitalTeamdailog, ProjectTeamDailog,AuditLogdailog, ReplicateDailog,RecordLevelAuditLogdailog } from './AfterLogin/automated-clr/automated-clr.component';
import { NPSComponent } from './AfterLogin/nps/nps.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AdhocComponent } from './AfterLogin/adhoc/adhoc.component';
import { ConfigComponent,ConfigDeleteDialog } from './AfterLogin/config/config.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ProjectTeamAnalysisComponent,ManagerPojectDetails } from './AfterLogin/PerformanceAnalysis/project-team-analysis/project-team-analysis.component';
import { DigitalTeamAnalysisComponent,DigitalManagerDetails } from './AfterLogin/PerformanceAnalysis/digital-team-analysis/digital-team-analysis.component';
import { ResourceAssignmentComponent } from './AfterLogin/resource-assignment/resource-assignment.component';
import { PrioritizationComponent } from './AfterLogin/prioritization/prioritization.component';
import { NpsImplementationComponent } from './AfterLogin/nps-implementation/nps-implementation.component';
import { NPSClientEntriesComponent,DeleteNPSClient } from './AfterLogin/npsclient-entries/npsclient-entries.component';
import { NPSViewComponent } from './AfterLogin/npsview/npsview.component';
import { DigitalReportComponent } from './AfterLogin/digital-report/digital-report.component';
import { RollingNPSComponent } from './AfterLogin/rolling-nps/rolling-nps.component';
import { TooltipModule } from 'ng2-tooltip-directive';
import { GoLiveReportComponent } from './AfterLogin/go-live-report/go-live-report.component';
import { DashboardComponentWOLoginComponent } from './dashboard-component-wologin/dashboard-component-wologin.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    DashboardComponent,
    LivedashboardComponent,
    LoadingSpinnerComponent,
    ImplementationMarketReportComponent,
    CriticalTasksOverDueComponent,
    ImplementationProjectStatusComponent,
    ELTReportComponent,
    CapacityManagementComponent,
    ESowReportComponent,
    CommentDialogComponent,
    StageGateTestingComponent,ImplementationProjectStatusdailog,TrackerCommentdailog,ResourceComment,
    ConfigDeleteDialog,ManagerPojectDetails,DigitalManagerDetails,
    LessonsLearntComponent,EltDailog, CLRCommentdailog,LessonsLearntdailog, 
    PriorMonthData,DigitalTeamdailog,AuditLogdailog,RecordLevelAuditLogdailog,
    HomepageComponent,AddingUser,DeleteUser,
    CommentsDialog,DataDialog, RefreshComponent, CycleTimeComponent,
    HierarchyComponent, PerformanceLeaderComponent,
    //  MarketImplementationComponent
    TrackerComponent,ResourceUtilizationComponent,
    CapacityHierarchyComponent,CapacityHierarchyDailog,ProfileDialog,
    EditUserAccess,GrantAccessDialog,DeleteUserDailog,DeleteNPSClient,
    ProspectComponent,AdminDeleteDialog,
    ProjectTeamDailog,ReplicateDailog,
    CLRExportComponent,
    LiveHomePageComponent,
    ProfileComponent,
    StatsComponent,
    AdmincontrolComponent,
    AutomatedCLRComponent,
    NPSComponent,
    ForgotPasswordComponent,
    AdhocComponent,
    ConfigComponent,
    ProjectTeamAnalysisComponent,
    DigitalTeamAnalysisComponent,
    ResourceAssignmentComponent,
    PrioritizationComponent,
    NpsImplementationComponent,
    NPSClientEntriesComponent,
    NPSViewComponent,
    DigitalReportComponent,
    RollingNPSComponent,
    GoLiveReportComponent,
    DashboardComponentWOLoginComponent
  ],
  imports: [
    BrowserModule, CommonModule,
    AppRoutingModule, MaterialModule,TooltipModule.forRoot({}),
    ReactiveFormsModule, FormsModule,PdfViewerModule,NgxMatSelectSearchModule,
    MatTableFilterModule,ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    BrowserAnimationsModule, HttpClientModule,NgMultiSelectDropDownModule.forRoot()
    //,SelectAutocompleteModule
  ],
  entryComponents: [ELTReportComponent, EltDailog,PriorMonthData,CLRCommentdailog,ResourceComment,ManagerPojectDetails,DigitalManagerDetails,AuditLogdailog,RecordLevelAuditLogdailog,ConfigDeleteDialog,DigitalTeamdailog,MatTableFilterModule,TrackerCommentdailog,LessonsLearntdailog,ImplementationProjectStatusdailog, CommentsDialog, DataDialog, AddingUser, DeleteUser, CapacityHierarchyDailog,ProfileDialog,EditUserAccess,GrantAccessDialog,DeleteUserDailog,DeleteNPSClient,AdminDeleteDialog,ProjectTeamDailog,ReplicateDailog],
  providers: [DatePipe, ExcelService],
  bootstrap: [AppComponent]
})
export class AppModule { }