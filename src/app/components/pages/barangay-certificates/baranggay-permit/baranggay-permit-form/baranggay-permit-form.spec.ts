import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaranggayPermitForm } from './baranggay-permit-form';

describe('BaranggayPermitForm', () => {
  let component: BaranggayPermitForm;
  let fixture: ComponentFixture<BaranggayPermitForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaranggayPermitForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaranggayPermitForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
