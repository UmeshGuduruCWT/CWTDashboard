import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonsLearntComponent } from './lessons-learnt.component';

describe('LessonsLearntComponent', () => {
  let component: LessonsLearntComponent;
  let fixture: ComponentFixture<LessonsLearntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LessonsLearntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonsLearntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
