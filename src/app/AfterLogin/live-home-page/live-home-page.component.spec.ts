import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveHomePageComponent } from './live-home-page.component';

describe('LiveHomePageComponent', () => {
  let component: LiveHomePageComponent;
  let fixture: ComponentFixture<LiveHomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveHomePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
