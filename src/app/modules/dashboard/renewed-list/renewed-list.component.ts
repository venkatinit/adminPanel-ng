import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/api.client';
import { ApiResponse } from 'src/app/models/api-response';

@Component({
  selector: 'app-renewed-list',
  templateUrl: './renewed-list.component.html',
  styleUrls: ['./renewed-list.component.scss']
})
export class RenewedListComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  visitors: any[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  loading: boolean = true;
  investorInfo: any;
  showInvestorDetails: boolean = false; // To control the visibility of investor details

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
    };
    this.loadVisitors();
  }

  loadVisitors() {
    this.api.get('admin/get_all_renewal_accounts').subscribe((res: ApiResponse<any>) => {
      this.visitors = res.data;
      this.dtTrigger.next(0);
      this.loading = false;
    }, (error) => {
      console.error(error);
    });
  }

  navigateToDetails(investor: any) {
    this.fetchInvestorInfo(investor.Investment_Id);
    this.showInvestorDetails = true; // Show investor details screen
  }

  fetchInvestorInfo(Investment_Id: string) {
    this.api.get(`admin/get_investment_details_by_id?investment_id=${Investment_Id}`).subscribe(
      (response: any) => {
        if (response.succeeded && response.data.length > 0) {
          this.investorInfo = response.data[0];
        }
      },
      (error: any) => {
        console.error('Error fetching investor info:', error);
      }
    );
  }
  @ViewChild('investorDetails', { static: false }) investorDetails: ElementRef;
  printSheet() {
    let printContents = this.investorDetails.nativeElement.innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }
  sendWhatsAppMessage(phoneNumber: string) {
    const whatsappLink = this.generateWhatsAppLink(this.investorInfo.investor_Info.Mobile_Number);
    window.open(whatsappLink, '_blank');
  }
  generateWhatsAppLink(phoneNumber: string) {
    return `https://wa.me/${this.investorInfo.investor_Info.Mobile_Number}`;
  }
  backToList() {
    this.showInvestorDetails = true; // Go back to the renewed list
    // window.location.reload;
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
