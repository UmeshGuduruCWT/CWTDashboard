import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceLeaderComponent } from './performance-leader.component';

describe('PerformanceLeaderComponent', () => {
  let component: PerformanceLeaderComponent;
  let fixture: ComponentFixture<PerformanceLeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformanceLeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceLeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
