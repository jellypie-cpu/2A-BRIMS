import { ComponentFixture, TestBed } from '@angular/core/testing';

import { COI } from './coi';

describe('COI', () => {
  let component: COI;
  let fixture: ComponentFixture<COI>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [COI]
    })
    .compileComponents();

    fixture = TestBed.createComponent(COI);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
