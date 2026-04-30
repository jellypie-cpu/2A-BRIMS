import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pagebar } from './pagebar';

describe('Pagebar', () => {
  let component: Pagebar;
  let fixture: ComponentFixture<Pagebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pagebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pagebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
