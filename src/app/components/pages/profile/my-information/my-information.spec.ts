import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileMyInformation } from './my-information';

describe('ProfileMyInformation', () => {
  let component: ProfileMyInformation;
  let fixture: ComponentFixture<ProfileMyInformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileMyInformation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileMyInformation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
