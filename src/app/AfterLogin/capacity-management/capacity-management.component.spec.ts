import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacityManagementComponent } from './capacity-management.component';

describe('CapacityManagementComponent', () => {
  let component: CapacityManagementComponent;
  let fixture: ComponentFixture<CapacityManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapacityManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapacityManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
