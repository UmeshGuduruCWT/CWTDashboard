import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoLiveReportComponent } from './go-live-report.component';

describe('GoLiveReportComponent', () => {
  let component: GoLiveReportComponent;
  let fixture: ComponentFixture<GoLiveReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoLiveReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoLiveReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
