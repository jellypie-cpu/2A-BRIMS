import { TestBed } from '@angular/core/testing';

import { ConcernService } from './concerns';

describe('ConcernService', () => {
  let service: ConcernService;

describe('ConcernService', () => {
  let service: ConcernService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConcernService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

});