import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DDODataComponent } from './ddodata.component';

describe('DDODataComponent', () => {
  let component: DDODataComponent;
  let fixture: ComponentFixture<DDODataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DDODataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DDODataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
