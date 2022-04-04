import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NPSViewComponent } from './npsview.component';

describe('NPSViewComponent', () => {
  let component: NPSViewComponent;
  let fixture: ComponentFixture<NPSViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NPSViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NPSViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
