import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentForm } from './residents-form';

describe('ResidentForm', () => {
  let component: ResidentForm;
  let fixture: ComponentFixture<ResidentForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidentForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidentForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
