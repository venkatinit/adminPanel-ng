import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListInvestorsComponent } from './list-investors/list-investors.component';
import { InverstorDetailsComponent } from './inverstor-details/inverstor-details.component';
import { RenewalListComponent } from './renewal-list/renewal-list.component';
import { DisbursementListComponent } from './disbursement-list/disbursement-list.component';
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
import { ListSubAdminsComponent } from './list-sub-admins/list-sub-admins.component';
import { DateCalenderComponent } from './date-calender/date-calender.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      title: 'home'
    },
  },
  { path: 'list-investors', component: ListInvestorsComponent },
  { path: 'new-investors-details', component: NewInvestorDetailsComponent },
  { path: 'new-investors-details/:Investment_ID', component: NewInvestorDetailsComponent },
  { path: 'rejected_list', component: RejectedListComponent },
  { path: 'renewal-list', component: RenewalListComponent },
  { path: 'disbursement-list', component: DisbursementListComponent },
  { path: 'add-investment', component: AddInvestmentComponent },
  { path: 'make-payment', component: MakePaymentComponent },
  { path: 'investor-details', component: InverstorDetailsComponent },
  { path: 'investor-details/:Investment_ID', component: InverstorDetailsComponent },
  { path: 'list-investment', component: ListInvestmentComponent },
  { path: 'get_all_payments', component: GetAllPaymentsComponent },
  { path: 'update_user', component: UpdateUserComponent },
  { path: 'visitors', component: VisitorsComponent },
  { path: 'add_visitor', component: AddVisitorComponent },
  { path: 'update_visitor', component: UpdateVisitorComponent },
  { path: 'renewed_list', component: RenewedListComponent },
  { path: 'make_renewel', component: MakeRenewalComponent },
  { path: 'list_sub_admins', component: ListSubAdminsComponent },
  { path: 'date_calender', component: DateCalenderComponent },
  { path: 'date_picker', component: DatePickerComponent },

];
@NgModule({
  imports: [RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
