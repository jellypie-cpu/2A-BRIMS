import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaranggayIndigencyForm } from './baranggay-indigency-form';

describe('BaranggayIndigencyForm', () => {
  let component: BaranggayIndigencyForm;
  let fixture: ComponentFixture<BaranggayIndigencyForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaranggayIndigencyForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaranggayIndigencyForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
