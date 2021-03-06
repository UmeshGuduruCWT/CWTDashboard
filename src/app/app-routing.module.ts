import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './AfterLogin/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ImplementationMarketReportComponent } from './AfterLogin/implementation-market-report/implementation-market-report.component';
import { CriticalTasksOverDueComponent } from './AfterLogin/critical-tasks-over-due/critical-tasks-over-due.component';
import { ImplementationProjectStatusComponent } from './AfterLogin/implementation-project-status/implementation-project-status.component';
import { ELTReportComponent } from './AfterLogin/eltreport/eltreport.component';
import { ESowReportComponent } from './AfterLogin/e-sow-report/e-sow-report.component';
import { CapacityManagementComponent } from './AfterLogin/capacity-management/capacity-management.component';
import { StageGateTestingComponent } from './AfterLogin/stage-gate-testing/stage-gate-testing.component';
import { LessonsLearntComponent } from './AfterLogin/lessons-learnt/lessons-learnt.component';
import { HomepageComponent } from './AfterLogin/homepage/homepage.component';
//import { MarketImplementationComponent } from './AfterLogin/market-implementation/market-implementation.component';
import { RefreshComponent } from './AfterLogin/refresh/refresh.component';
import { CycleTimeComponent } from './AfterLogin/cycle-time/cycle-time.component';
import { HierarchyComponent } from './AfterLogin/hierarchy/hierarchy.component';
import { PerformanceLeaderComponent } from './AfterLogin/performance-leader/performance-leader.component';
import { TrackerComponent } from './AfterLogin/tracker/tracker.component';
import { ResourceUtilizationComponent } from './AfterLogin/resource-utilization/resource-utilization.component';
import { CapacityHierarchyComponent } from './AfterLogin/capacity-hierarchy/capacity-hierarchy.component';
import { ProspectComponent } from './AfterLogin/prospect/prospect.component';
import { CLRExportComponent } from './clrexport/clrexport.component';
import { LivedashboardComponent } from './AfterLogin/livedashboard/livedashboard.component';
import { LiveHomePageComponent } from './AfterLogin/live-home-page/live-home-page.component';
import { ProfileComponent } from './AfterLogin/profile/profile.component';
import { StatsComponent } from './AfterLogin/stats/stats.component';
import { DashboardServiceService } from './dashboard-service.service';
import { AdmincontrolComponent } from './AfterLogin/admincontrol/admincontrol.component';
import { AutomatedCLRComponent } from './AfterLogin/automated-clr/automated-clr.component';
import { NPSComponent } from './AfterLogin/nps/nps.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AdhocComponent } from './AfterLogin/adhoc/adhoc.component';
import { ResourceAssignmentComponent } from './AfterLogin/resource-assignment/resource-assignment.component';
import { ProjectTeamAnalysisComponent } from './AfterLogin/PerformanceAnalysis/project-team-analysis/project-team-analysis.component';
import { DigitalTeamAnalysisComponent } from './AfterLogin/PerformanceAnalysis/digital-team-analysis/digital-team-analysis.component';
import { PrioritizationComponent } from './AfterLogin/prioritization/prioritization.component';
import { NpsImplementationComponent } from './AfterLogin/nps-implementation/nps-implementation.component';
import { NPSClientEntriesComponent } from './AfterLogin/npsclient-entries/npsclient-entries.component';
import { NPSViewComponent } from './AfterLogin/npsview/npsview.component';
import { DigitalReportComponent } from './AfterLogin/digital-report/digital-report.component';
import { RollingNPSComponent } from './AfterLogin/rolling-nps/rolling-nps.component';
const routes: Routes = [
  { path:'',redirectTo: 'Login', pathMatch: 'full'},
  { path:'Login',component:LoginComponent},
  { path:'Register',component:RegistrationComponent},
  { path:'ForgotPassword',component:ForgotPasswordComponent},
  { path:'Dashboard/:UID',
    component: LivedashboardComponent,
    // canActivate : [DashboardactivateGuard],
    children : [
      {path:'',redirectTo: 'HomePage', pathMatch: 'full'},
      //{path:'',redirectTo: 'HomePage', pathMatch: 'full'},
      {path:'HomePage',component:LiveHomePageComponent},
      {path:'INProgressHomePage',component:HomepageComponent},
      {path:'ImplementationMarket',component:ImplementationMarketReportComponent},
      //{path:'HierarchyImplementation',component:MarketImplementationComponent},
      {path:'PerformanceLeader',component:PerformanceLeaderComponent},
      {path:'CycleTime',component:CycleTimeComponent},
      {path:'Hierarchy',component:HierarchyComponent},
      {path:'CriticalTaskOverdue',component:CriticalTasksOverDueComponent},
      {path:'ImplementationProjectStatus',component:ImplementationProjectStatusComponent},
      {path:'EltReport',component:ELTReportComponent},
      {path:'CapacityManagement',component:CapacityManagementComponent},
      {path:'eSOWReport',component:ESowReportComponent},
      {path:'StageGateTesting',component:StageGateTestingComponent},
      {path:'LessonsLearnt',component:LessonsLearntComponent},
      {path:'Tracker',component:TrackerComponent},
      {path:'ResUtil',component:ResourceUtilizationComponent},
      {path:'CapacityHierarchy',component:CapacityHierarchyComponent},
      {path:'ProjectTeam',component:ProjectTeamAnalysisComponent},
      {path:'DigitalTeam',component:DigitalTeamAnalysisComponent},
      {path:'Prospect',component:ProspectComponent},
      {path:'AutomatedCLR',component:AutomatedCLRComponent},
      {path:'clrexport',component:CLRExportComponent},
      {path:'Profile',component:ProfileComponent},
      {path:'Stats',component:StatsComponent},
      {path:'NPS',component:NPSComponent},
      {path:'Adhoc',component:AdhocComponent},
      {path:'AdminPanel',component:AdmincontrolComponent},
      {path:'ResourceAssignment',component:ResourceAssignmentComponent},
      {path:'Prioritization',component:PrioritizationComponent},
      {path:'NpsCreateSurvey',component:NPSClientEntriesComponent},
      {path:'NpsView',component:NPSViewComponent},
      {path:'NpsDashboard',component:NpsImplementationComponent},
      {path:'DigitalReport',component:DigitalReportComponent},
      {path:'RollingNps',component:RollingNPSComponent},
  ]},
  // {path:'refresh',component : RefreshComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes,{onSameUrlNavigation : 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }