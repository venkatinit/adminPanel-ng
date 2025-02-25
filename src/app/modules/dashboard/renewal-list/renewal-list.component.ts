import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/api.client';
import { ApiResponse } from 'src/app/models/api-response';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MakeRenewalComponent } from '../make-renewal/make-renewal.component';
import * as XLSX from 'xlsx';
import { UtilsService } from 'src/app/utils/utilities-service';
@Component({
  selector: 'app-renewal-list',
  templateUrl: './renewal-list.component.html',
  styleUrls: ['./renewal-list.component.scss']
})
export class RenewalListComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  customers: any[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  photo_url: string | ArrayBuffer;
  loading: boolean = true;
  investors: any;
  investorInfo1: any;
  investorInfo: any;
  // @Input() selected_id: number;
  // @Input() disbursement_Id: number;


  constructor(private api: ApiService, private router: Router, private modalService: NgbModal, public activeModal: NgbActiveModal, private util: UtilsService) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 1000,
    };
    var role_name = this.util.decrypt_Text(localStorage.getItem('role_name'));
    var id = this.util.decrypt_Text(localStorage.getItem('user_id'));
    var endpoint = 'admin/get_renewals';
    if (role_name == 'Sub Admin') {
      endpoint = endpoint + '?subAdminId=' + id;
    }
    this.api.get(endpoint).subscribe((res: ApiResponse<any>) => {
      this.investors = res.data;
      this.dtTrigger.next(0);
      this.loading = false;
    }, (error) => {
      console.log(error);
    });
  }
  navigateToDetails(investment_Id: any) {
    this.router.navigate(['/dashboard/investor-details'], {
      queryParams: { investor_id: investment_Id.Investor_Id },
    });
  }

  open(investment_Id: number) {
    const options = { windowClass: 'custom-ngb-modal-window', backdropClass: 'custom-ngb-modal-backdrop' };
    const modalRef = this.modalService.open(MakeRenewalComponent, options);

    modalRef.componentInstance.Investement_id = investment_Id;


    modalRef.result.then((data) => {
      // Handle the result from modal if needed
    }, (error) => {
      if (error == "Success") {
        // Handle success scenario
      }
    });
  }
  @ViewChild('customersTable') customersTable: any; // Reference to the table element
  exportToExcel(): void {
    const dataToExport = this.investors.map((investor) => ({
      'Investor ID': investor.Investmentor_Id,
      'Full Name': `${investor.FirstName} ${investor.LastName}`, // Concatenate first name and last name
      'Mobile Number': investor.Mobile_Number,
      'Account_No': investor.Account_No,
      'Bank_Name  ': investor.Bank_Name,
      'Branch_Name': investor.Branch_Name,
      'IFSC_Code': investor.IFSC_Code,
      //  'C/O': investor.C/O,
    }));
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Investors');

    const fileName = 'disbursement_pending_list_' + new Date().getTime() + '.xlsx';
    XLSX.writeFile(wb, fileName);
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  close() {
    this.activeModal.close('Success');
  }

}
