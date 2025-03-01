import { Component, HostListener, Input, OnChanges, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { format } from 'date-fns';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/api.client';

@Component({
  selector: 'app-date-calender',
  templateUrl: './date-calender.component.html',
  styleUrls: ['./date-calender.component.scss']
})
export class DateCalenderComponent implements OnInit, OnChanges {
  @Input() investmentId!: number; // Accept `investmentId` from parent
  @Input() noOfSlotsPerDay!: number; // Accept `no of slots from parent` from parent

  currentDate = new Date();
  weeks: any[][] = [];
  slots: any;
  selectedDate: Date | null = null;
  showCalendar = false;

  constructor(public http: HttpClient, private api: ApiService) { }

  ngOnInit() {

    this.generateCalendar();

  }

  ngOnChanges() {

  }

  generateCalendar() {
    this.weeks = [];
    this.slots = [];

    this.fetchFares().subscribe((response) => {
      this.slots = response.data;
      const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
      const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);

      let dayIndex = firstDay.getDay();
      let daysInMonth = [];
      let i = 0;

      for (let day = 1; day <= lastDay.getDate(); day++) {
        daysInMonth.push({
          date: new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day),
          slots: Number(this.noOfSlotsPerDay) - Number(this.slots[i]?.no_of_slots || 0),
        });
        i += 1;
      }

      let week: any[] = new Array(dayIndex).fill(null);
      daysInMonth.forEach((day) => {
        week.push(day);
        if (week.length === 7) {
          this.weeks.push(week);
          week = [];
        }
      });

      if (week.length) {
        while (week.length < 7) {
          week.push(null);
        }
        this.weeks.push(week);
      }
    });
  }
  prevMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar();
  }
  // prevMonth() {
  //   this.currentDate.setMonth(this.currentDate.getMonth() - 1);
  //   this.generateCalendar();
  // }

  // nextMonth() {
  //   this.currentDate.setMonth(this.currentDate.getMonth() + 1);
  //   this.generateCalendar();
  // }

  fetchFares(): Observable<{ [key: string]: number }> {
    const cmonth = format(this.currentDate, 'yyyy-MM');
    const month = Number(cmonth.split('-')[1]);
    const year = Number(cmonth.split('-')[0]);

    return this.http.get<{ [key: string]: number }>(
      `https://api.nginfosolutions.com/api/admin/get_slots?month=${month}&year=${year}&investmentId=${this.investmentId}`
    );
  }

  clearSelection() {
    this.selectedDate = null;
    this.showCalendar = false;
  }

  selectToday() {
    this.selectedDate = new Date();
    this.showCalendar = false;
  }

  toggleCalendar() {
    this.generateCalendar();
    this.showCalendar = !this.showCalendar;
  }
  selectDate(day: any) {
    if (day) {
      this.selectedDate = day.date;
      this.showCalendar = false; // Hide calendar after selecting
    }
  }
  hideCalendar() {
    this.showCalendar = false;
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.date-picker')) {
      this.hideCalendar();
    }
  }
}