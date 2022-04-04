import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImplementationMarketReportComponent } from './implementation-market-report.component';

describe('ImplementationMarketReportComponent', () => {
  let component: ImplementationMarketReportComponent;
  let fixture: ComponentFixture<ImplementationMarketReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImplementationMarketReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImplementationMarketReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
