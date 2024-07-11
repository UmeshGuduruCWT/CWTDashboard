import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorsAllocatedComponent } from './errors-allocated.component';

describe('ErrorsAllocatedComponent', () => {
  let component: ErrorsAllocatedComponent;
  let fixture: ComponentFixture<ErrorsAllocatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorsAllocatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorsAllocatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
