import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacityHierarchyComponent } from './capacity-hierarchy.component';

describe('HierarchyComponent', () => {
  let component: CapacityHierarchyComponent;
  let fixture: ComponentFixture<CapacityHierarchyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapacityHierarchyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapacityHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
