import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollingNPSComponent } from './rolling-nps.component';

describe('RollingNPSComponent', () => {
  let component: RollingNPSComponent;
  let fixture: ComponentFixture<RollingNPSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollingNPSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollingNPSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
