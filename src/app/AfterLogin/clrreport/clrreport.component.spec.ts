import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CLRReportComponent } from './clrreport.component';

describe('CLRReportComponent', () => {
  let component: CLRReportComponent;
  let fixture: ComponentFixture<CLRReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CLRReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CLRReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
