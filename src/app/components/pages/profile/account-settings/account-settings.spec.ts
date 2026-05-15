import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileAccountSettings } from './account-settings';

describe('ProfileAccountSettings', () => {
  let component: ProfileAccountSettings;
  let fixture: ComponentFixture<ProfileAccountSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileAccountSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileAccountSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
