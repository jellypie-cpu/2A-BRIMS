import { TestBed } from '@angular/core/testing';

import { Resident } from './resident';

describe('Resident', () => {
  let service: Resident;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Resident);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
