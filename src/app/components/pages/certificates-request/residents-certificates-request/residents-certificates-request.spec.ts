import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentsCertificatesRequest } from './residents-certificates-request';

describe('ResidentsCertificatesRequest', () => {
  let component: ResidentsCertificatesRequest;
  let fixture: ComponentFixture<ResidentsCertificatesRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidentsCertificatesRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidentsCertificatesRequest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
