import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarangayCertificates } from './barangay-certificates';

describe('BarangayCertificates', () => {
  let component: BarangayCertificates;
  let fixture: ComponentFixture<BarangayCertificates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarangayCertificates]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarangayCertificates);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
