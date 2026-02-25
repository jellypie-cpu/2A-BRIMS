import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlotterRecords } from './blotter-records';

describe('BlotterRecords', () => {
  let component: BlotterRecords;
  let fixture: ComponentFixture<BlotterRecords>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlotterRecords]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlotterRecords);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
