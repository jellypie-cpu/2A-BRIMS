import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaranggayClearance } from './baranggay-clearance';

describe('BaranggayClearance', () => {
  let component: BaranggayClearance;
  let fixture: ComponentFixture<BaranggayClearance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaranggayClearance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaranggayClearance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
