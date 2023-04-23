import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SteeringCommitteeComponent } from './steering-committee.component';

describe('SteeringCommitteeComponent', () => {
  let component: SteeringCommitteeComponent;
  let fixture: ComponentFixture<SteeringCommitteeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SteeringCommitteeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SteeringCommitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
