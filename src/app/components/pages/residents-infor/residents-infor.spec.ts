import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentsInfor } from './residents-infor';

describe('ResidentsInfor', () => {
  let component: ResidentsInfor;
  let fixture: ComponentFixture<ResidentsInfor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidentsInfor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidentsInfor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
