import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursementListComponent } from './disbursement-list.component';

describe('DisbursementListComponent', () => {
  let component: DisbursementListComponent;
  let fixture: ComponentFixture<DisbursementListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisbursementListComponent]
    });
    fixture = TestBed.createComponent(DisbursementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
