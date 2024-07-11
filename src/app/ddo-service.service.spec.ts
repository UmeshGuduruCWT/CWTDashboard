import { TestBed } from '@angular/core/testing';

import { DdoServiceService } from './ddo-service.service';

describe('DdoServiceService', () => {
  let service: DdoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DdoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
