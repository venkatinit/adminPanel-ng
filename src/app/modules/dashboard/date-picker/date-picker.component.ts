import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/api.client';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent {
  currentDate = new Date();
  weeks: any[][] = [];
  slots: any;
  selectedDate: Date | null = null;
  showCalendar = false;
  allInvestments: any;
  investment_Id: any = 0;
  noOfSlotsPerDay: any = 0;

  constructor(public http: HttpClient, private api: ApiService,) {
    this.api.get('admin/get_all_investment_master').subscribe((response: any) => {
      if (response.succeeded) {
        this.allInvestments = response.data;
        this.investment_Id = this.allInvestments[0].Id;
        this.noOfSlotsPerDay = this.allInvestments[0].no_Of_Slots ?? 30;

      }
    });

  }
  loadCalendar($event: any) {
    this.investment_Id = Number($event.target.value);
    var obj = this.allInvestments.find((x: any) => x.Id == this.investment_Id);
    this.noOfSlotsPerDay = obj.no_Of_Slots ?? 30;
  }
}
