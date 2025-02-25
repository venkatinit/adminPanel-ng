import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewedListComponent } from './renewed-list.component';

describe('RenewedListComponent', () => {
  let component: RenewedListComponent;
  let fixture: ComponentFixture<RenewedListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RenewedListComponent]
    });
    fixture = TestBed.createComponent(RenewedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
