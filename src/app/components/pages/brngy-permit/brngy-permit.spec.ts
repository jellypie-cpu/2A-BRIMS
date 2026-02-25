import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrngyPermit } from './brngy-permit';

describe('BrngyPermit', () => {
  let component: BrngyPermit;
  let fixture: ComponentFixture<BrngyPermit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrngyPermit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrngyPermit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
