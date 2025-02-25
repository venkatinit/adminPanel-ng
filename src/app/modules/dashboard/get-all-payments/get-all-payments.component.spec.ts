import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllPaymentsComponent } from './get-all-payments.component';

describe('GetAllPaymentsComponent', () => {
  let component: GetAllPaymentsComponent;
  let fixture: ComponentFixture<GetAllPaymentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetAllPaymentsComponent]
    });
    fixture = TestBed.createComponent(GetAllPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
