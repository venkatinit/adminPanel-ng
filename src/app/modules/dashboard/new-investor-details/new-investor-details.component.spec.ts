import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewInvestorDetailsComponent } from './new-investor-details.component';

describe('NewInvestorDetailsComponent', () => {
  let component: NewInvestorDetailsComponent;
  let fixture: ComponentFixture<NewInvestorDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewInvestorDetailsComponent]
    });
    fixture = TestBed.createComponent(NewInvestorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
