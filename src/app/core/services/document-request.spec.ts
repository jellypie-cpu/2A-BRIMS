import { TestBed } from '@angular/core/testing';

import { DocumentRequest } from './document-request';

describe('DocumentRequest', () => {
  let service: DocumentRequest;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentRequest);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
