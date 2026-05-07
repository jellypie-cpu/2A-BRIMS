import { TestBed } from '@angular/core/testing';

import { Blotter } from './blotter';

describe('Blotter', () => {
  let service: Blotter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Blotter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
