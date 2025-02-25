import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInvestmentComponent } from './list-investment.component';

describe('ListInvestmentComponent', () => {
  let component: ListInvestmentComponent;
  let fixture: ComponentFixture<ListInvestmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListInvestmentComponent]
    });
    fixture = TestBed.createComponent(ListInvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
