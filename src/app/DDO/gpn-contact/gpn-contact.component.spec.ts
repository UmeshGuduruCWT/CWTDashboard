import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpnContactComponent } from './gpn-contact.component';

describe('GpnContactComponent', () => {
  let component: GpnContactComponent;
  let fixture: ComponentFixture<GpnContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpnContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpnContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
