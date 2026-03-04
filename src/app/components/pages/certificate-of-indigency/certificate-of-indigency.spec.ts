import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateOfIndigency } from './certificate-of-indigency';

describe('CertificateOfIndigency', () => {
  let component: CertificateOfIndigency;
  let fixture: ComponentFixture<CertificateOfIndigency>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificateOfIndigency]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificateOfIndigency);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
