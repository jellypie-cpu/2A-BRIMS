import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemInfo } from './system-info';

describe('SystemInfo', () => {
  let component: SystemInfo;
  let fixture: ComponentFixture<SystemInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
