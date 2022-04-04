import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTeamAnalysisComponent } from './project-team-analysis.component';

describe('ProjectTeamAnalysisComponent', () => {
  let component: ProjectTeamAnalysisComponent;
  let fixture: ComponentFixture<ProjectTeamAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectTeamAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectTeamAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
