import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyInformation } from './my-information';

describe('MyInformation', () => {
  let component: MyInformation;
  let fixture: ComponentFixture<MyInformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyInformation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyInformation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
