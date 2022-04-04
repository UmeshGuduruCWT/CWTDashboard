import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalTeamAnalysisComponent } from './digital-team-analysis.component';

describe('DigitalTeamAnalysisComponent', () => {
  let component: DigitalTeamAnalysisComponent;
  let fixture: ComponentFixture<DigitalTeamAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalTeamAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalTeamAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
