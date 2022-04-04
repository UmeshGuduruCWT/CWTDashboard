import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NpsImplementationComponent } from './nps-implementation.component';

describe('NpsImplementationComponent', () => {
  let component: NpsImplementationComponent;
  let fixture: ComponentFixture<NpsImplementationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpsImplementationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpsImplementationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
