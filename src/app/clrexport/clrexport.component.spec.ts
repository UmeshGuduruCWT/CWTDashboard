import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CLRExportComponent } from './clrexport.component';

describe('CLRExportComponent', () => {
  let component: CLRExportComponent;
  let fixture: ComponentFixture<CLRExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CLRExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CLRExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
