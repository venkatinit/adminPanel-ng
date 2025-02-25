import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateCalenderComponent } from './date-calender.component';

describe('DateCalenderComponent', () => {
  let component: DateCalenderComponent;
  let fixture: ComponentFixture<DateCalenderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DateCalenderComponent]
    });
    fixture = TestBed.createComponent(DateCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
