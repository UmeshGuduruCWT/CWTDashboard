import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SteeringCommitteeRecordViewComponent } from './steering-committee-record-view.component';

describe('SteeringCommitteeRecordViewComponent', () => {
  let component: SteeringCommitteeRecordViewComponent;
  let fixture: ComponentFixture<SteeringCommitteeRecordViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SteeringCommitteeRecordViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SteeringCommitteeRecordViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
