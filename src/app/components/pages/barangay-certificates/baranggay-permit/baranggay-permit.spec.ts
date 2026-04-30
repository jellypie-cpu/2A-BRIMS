import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaranggayPermit } from './baranggay-permit';

describe('BaranggayPermit', () => {
  let component: BaranggayPermit;
  let fixture: ComponentFixture<BaranggayPermit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaranggayPermit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaranggayPermit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
