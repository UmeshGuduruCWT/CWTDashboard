import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriticalTasksOverDueComponent } from './critical-tasks-over-due.component';

describe('CriticalTasksOverDueComponent', () => {
  let component: CriticalTasksOverDueComponent;
  let fixture: ComponentFixture<CriticalTasksOverDueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriticalTasksOverDueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriticalTasksOverDueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
