import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StageGateTestingComponent } from './stage-gate-testing.component';

describe('StageGateTestingComponent', () => {
  let component: StageGateTestingComponent;
  let fixture: ComponentFixture<StageGateTestingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StageGateTestingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StageGateTestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
