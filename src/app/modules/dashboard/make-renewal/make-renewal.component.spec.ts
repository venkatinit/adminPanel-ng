import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeRenewalComponent } from './make-renewal.component';

describe('MakeRenewalComponent', () => {
  let component: MakeRenewalComponent;
  let fixture: ComponentFixture<MakeRenewalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MakeRenewalComponent]
    });
    fixture = TestBed.createComponent(MakeRenewalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
