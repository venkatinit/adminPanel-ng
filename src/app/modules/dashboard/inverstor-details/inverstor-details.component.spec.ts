import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InverstorDetailsComponent } from './inverstor-details.component';

describe('InverstorDetailsComponent', () => {
  let component: InverstorDetailsComponent;
  let fixture: ComponentFixture<InverstorDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InverstorDetailsComponent]
    });
    fixture = TestBed.createComponent(InverstorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
