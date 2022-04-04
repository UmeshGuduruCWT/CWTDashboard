import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ELTReportComponent } from './eltreport.component';

describe('ELTReportComponent', () => {
  let component: ELTReportComponent;
  let fixture: ComponentFixture<ELTReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ELTReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ELTReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
