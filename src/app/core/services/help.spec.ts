import { TestBed } from '@angular/core/testing';

import { Help } from './help';

describe('Help', () => {
  let service: Help;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Help);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
