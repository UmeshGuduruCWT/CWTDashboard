import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateSteeringCommitteeComponent } from './add-update-steering-committee.component';

describe('AddUpdateSteeringCommitteeComponent', () => {
  let component: AddUpdateSteeringCommitteeComponent;
  let fixture: ComponentFixture<AddUpdateSteeringCommitteeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateSteeringCommitteeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateSteeringCommitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
