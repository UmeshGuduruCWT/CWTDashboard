import { TestBed } from '@angular/core/testing';

import { DashboardactivateGuard } from './dashboardactivate.guard';

describe('DashboardactivateGuard', () => {
  let guard: DashboardactivateGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DashboardactivateGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
