import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificatesRequest } from './certificates-request';

describe('CertificatesRequest', () => {
  let component: CertificatesRequest;
  let fixture: ComponentFixture<CertificatesRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificatesRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificatesRequest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
