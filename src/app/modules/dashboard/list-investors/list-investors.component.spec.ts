import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInvestorsComponent } from './list-investors.component';

describe('ListInvestorsComponent', () => {
  let component: ListInvestorsComponent;
  let fixture: ComponentFixture<ListInvestorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListInvestorsComponent]
    });
    fixture = TestBed.createComponent(ListInvestorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
