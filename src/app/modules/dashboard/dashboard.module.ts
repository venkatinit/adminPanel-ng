import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModuleModule } from 'src/app/shared-module/shared-module/shared-module.module';

import { HomeComponent } from './home/home.component';
import { ListInvestorsComponent } from './list-investors/list-investors.component';
import { InverstorDetailsComponent } from './inverstor-details/inverstor-details.component';
import { DisbursementListComponent } from './disbursement-list/disbursement-list.component';
import { RenewalListComponent } from './renewal-list/renewal-list.component';
import { NewInvestorDetailsComponent } from './new-investor-details/new-investor-details.component';
import { AddInvestmentComponent } from './add-investment/add-investment.component';
import { ListInvestmentComponent } from './list-investment/list-investment.component';
import { RejectedListComponent } from './rejected-list/rejected-list.component';
import { MakePaymentComponent } from './make-payment/make-payment.component';
import { GetAllPaymentsComponent } from './get-all-payments/get-all-payments.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { VisitorsComponent } from './visitors/visitors.component';
import { AddVisitorComponent } from './add-visitor/add-visitor.component';
import { UpdateVisitorComponent } from './update-visitor/update-visitor.component';
import { RenewedListComponent } from './renewed-list/renewed-list.component';
import { MakeRenewalComponent } from './make-renewal/make-renewal.component';
import { AddSubAdminsComponent } from './add-sub-admins/add-sub-admins.component';
import { ListSubAdminsComponent } from './list-sub-admins/list-sub-admins.component';
import { DateCalenderComponent } from './date-calender/date-calender.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { DateCalendarComponent } from './date-calendar/date-calendar.component';

@NgModule({
  declarations: [
    HomeComponent,
    ListInvestorsComponent,
    InverstorDetailsComponent,
    DisbursementListComponent,
    RenewalListComponent,
    NewInvestorDetailsComponent,
    AddInvestmentComponent,
    ListInvestmentComponent,
    RejectedListComponent,
    MakePaymentComponent,
    GetAllPaymentsComponent,
    UpdateUserComponent,
    VisitorsComponent,
    AddVisitorComponent,
    UpdateVisitorComponent,
    RenewedListComponent,
    MakeRenewalComponent,
    AddSubAdminsComponent,
    ListSubAdminsComponent,
    DateCalenderComponent,
    DatePickerComponent,
    DateCalendarComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModuleModule,
    DataTablesModule,
    NgApexchartsModule,
    RouterModule,
  ],
  providers: [NgbActiveModal]
})
export class DashboardModule { }
