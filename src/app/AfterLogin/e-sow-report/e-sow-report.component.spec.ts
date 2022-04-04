import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ESowReportComponent } from './e-sow-report.component';

describe('ESowReportComponent', () => {
  let component: ESowReportComponent;
  let fixture: ComponentFixture<ESowReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ESowReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ESowReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
