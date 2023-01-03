import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponentWOLoginComponent } from './dashboard-component-wologin.component';

describe('DashboardComponentWOLoginComponent', () => {
  let component: DashboardComponentWOLoginComponent;
  let fixture: ComponentFixture<DashboardComponentWOLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardComponentWOLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponentWOLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
