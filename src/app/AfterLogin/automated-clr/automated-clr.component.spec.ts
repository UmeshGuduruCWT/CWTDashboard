import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomatedCLRComponent } from './automated-clr.component';

describe('AutomatedCLRComponent', () => {
  let component: AutomatedCLRComponent;
  let fixture: ComponentFixture<AutomatedCLRComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutomatedCLRComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomatedCLRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
