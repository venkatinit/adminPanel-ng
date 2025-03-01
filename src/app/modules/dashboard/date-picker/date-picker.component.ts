import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/api.client';
import { Observable } from 'rxjs/internal/Observable';
import { format } from 'date-fns';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent {
  currentDate = new Date();
  weeks: any[][] = [];
  investments: any = [];
  allotments: any = [];
  mergedData: any = [];
  selectedInvestmentId!: number;
  slots: any;
  selectedDate: Date | null = null;
  showCalendar = false;
  allInvestments: any;
  investment_Id: any = 0;
  noOfSlotsPerDay: any = 0;
  selected_month: any = 0;
  selected_year: any = 0;

  constructor(public http: HttpClient, private api: ApiService,) {
    this.api.get('admin/get_all_investment_master').subscribe((response: any) => {
      if (response.succeeded) {
        this.allInvestments = response.data;
        this.investment_Id = this.allInvestments[0].Id;
        this.noOfSlotsPerDay = this.allInvestments[0].no_Of_Slots ?? 30;
        this.fetchInvestments();
        this.generateCalendar();
      }
    });

  }
  loadCalendar($event: any) {
    this.weeks = [];
    this.slots = [];
    this.investment_Id = Number($event.target.value);
    var obj = this.allInvestments.find((x: any) => x.Id == this.investment_Id);
    this.noOfSlotsPerDay = obj.no_Of_Slots ?? 30;
    this.loadAllocations();
    this.generateCalendar()

  }
  fetchInvestments() {
    this.api.get('admin/get_all_investment_master').subscribe((res: any) => {
      if (res.succeeded && res.data) {
        this.investments = res.data;
        this.selectedInvestmentId = this.investments[0]?.Id || 0;
        this.loadAllocations();

      }
    }, (error) => {
      console.error("Error fetching investments", error);
    });

  }
  loadAllocations() {
    this.api.get('admin/get_investment_slots?investment_id=' + this.investment_Id + '&month=' + this.selected_month + '&year=' + this.selected_year).subscribe((res: any) => {
      if (res.succeeded && res.data) {
        this.allotments = res.data;
        this.mergedData = [
          {
            title: 'Balance',
            investmentId: this.mergedData[0]?.investmentId || 0,  // Fallback to 0 if the first row is undefined
            days45: (this.mergedData[0]?.days45 || 0) - (this.mergedData[1]?.days45 || 0),
            days90: (this.mergedData[0]?.days90 || 0) - (this.mergedData[1]?.days90 || 0),
            days180: (this.mergedData[0]?.days180 || 0) - (this.mergedData[1]?.days180 || 0),
            days360: (this.mergedData[0]?.days360 || 0) - (this.mergedData[1]?.days360 || 0)
          }
        ];
      }
    }, (error) => {
      console.error("Error fetching investments", error);
    });
  }
  onInvestmentChange() {
    this.loadAllocations();

    this.generateCalendar();
  }

  generateCalendar() {
    this.weeks = [];
    this.slots = [];
    this.allotments = [];
    this.mergedData = [];
    this.fetchFares().subscribe((response) => {
      this.slots = response.data;
      const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
      const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);

      let dayIndex = firstDay.getDay();
      let daysInMonth = [];
      let i = 0;
      var data = this.allotments[0];
      for (let day = 1; day <= lastDay.getDate(); day++) {

        var days45 = (data['days45'] / 30)
        var days90 = (data['days90'] / 30)
        var days180 = (data['days180'] / 30)
        var days360 = (data['days360'] / 30)

        var newData = this.slots[i].investment_Members[0];
        if (newData) {
          newData['days45'] = (days45 - newData['days45']);
          newData['days90'] = (days90 - newData['days90']);
          newData['days180'] = (days180 - newData['days180']);
          newData['days360'] = (days360 - newData['days360']);
          // this.slots[i] = newData;
        }

        daysInMonth.push({
          date: new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day),
          slots: this.slots[i]?.investment_Members || [],
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
    const cmonth = format(this.currentDate, 'yyyy-MM');
    this.selected_month = Number(cmonth.split('-')[1]);
    this.selected_year = Number(cmonth.split('-')[0]);

    this.loadAllocations();
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    const cmonth = format(this.currentDate, 'yyyy-MM');
    this.selected_month = Number(cmonth.split('-')[1]);
    this.selected_year = Number(cmonth.split('-')[0]);

    this.loadAllocations();
    this.generateCalendar();
  }

  fetchFares(): Observable<{ data: any[] }> {
    const cmonth = format(this.currentDate, 'yyyy-MM');
    this.selected_month = Number(cmonth.split('-')[1]);
    this.selected_year = Number(cmonth.split('-')[0]);

    return this.http.get<{ data: any[] }>(
      `https://api.nginfosolutions.com/api/admin/get_slots?month=${this.selected_month}&year=${this.selected_year}&investmentId=${this.investment_Id}`
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
      this.showCalendar = false;
    }
  }

  hideCalendar() {
    this.showCalendar = false;
  }
}
