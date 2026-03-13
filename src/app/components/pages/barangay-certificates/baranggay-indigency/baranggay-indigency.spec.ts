import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaranggayIndigency } from './baranggay-indigency';

describe('BaranggayIndigency', () => {
  let component: BaranggayIndigency;
  let fixture: ComponentFixture<BaranggayIndigency>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaranggayIndigency]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaranggayIndigency);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
