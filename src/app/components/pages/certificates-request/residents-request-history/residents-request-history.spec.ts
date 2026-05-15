import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentsRequestHistory } from './residents-request-history';

describe('ResidentsRequestHistory', () => {
  let component: ResidentsRequestHistory;
  let fixture: ComponentFixture<ResidentsRequestHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidentsRequestHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidentsRequestHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
