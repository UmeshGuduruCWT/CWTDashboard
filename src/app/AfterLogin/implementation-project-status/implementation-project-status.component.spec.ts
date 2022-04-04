import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImplementationProjectStatusComponent } from './implementation-project-status.component';

describe('ImplementationProjectStatusComponent', () => {
  let component: ImplementationProjectStatusComponent;
  let fixture: ComponentFixture<ImplementationProjectStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImplementationProjectStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImplementationProjectStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
