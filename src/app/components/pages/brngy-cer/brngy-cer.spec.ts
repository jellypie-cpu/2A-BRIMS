import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrngyCer } from './brngy-cer';

describe('BrngyCer', () => {
  let component: BrngyCer;
  let fixture: ComponentFixture<BrngyCer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrngyCer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrngyCer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
