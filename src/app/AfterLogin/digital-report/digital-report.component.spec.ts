import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalReportComponent } from './digital-report.component';

describe('DigitalReportComponent', () => {
  let component: DigitalReportComponent;
  let fixture: ComponentFixture<DigitalReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
