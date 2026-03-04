import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentsInformation } from './residents-information';

describe('ResidentsInformation', () => {
  let component: ResidentsInformation;
  let fixture: ComponentFixture<ResidentsInformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidentsInformation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidentsInformation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
