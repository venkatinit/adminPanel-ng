import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotsCalenderComponent } from './slots-calender.component';

describe('SlotsCalenderComponent', () => {
  let component: SlotsCalenderComponent;
  let fixture: ComponentFixture<SlotsCalenderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SlotsCalenderComponent]
    });
    fixture = TestBed.createComponent(SlotsCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
