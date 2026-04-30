import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlotterForm } from './blotter-form';

describe('BlotterForm', () => {
  let component: BlotterForm;
  let fixture: ComponentFixture<BlotterForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlotterForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlotterForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
