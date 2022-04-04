import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NPSClientEntriesComponent } from './npsclient-entries.component';

describe('NPSClientEntriesComponent', () => {
  let component: NPSClientEntriesComponent;
  let fixture: ComponentFixture<NPSClientEntriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NPSClientEntriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NPSClientEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
