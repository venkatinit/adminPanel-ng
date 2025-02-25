import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/api.client';
import { ApiResponse } from 'src/app/models/api-response';
import * as XLSX from 'xlsx';
import { MakePaymentComponent } from '../make-payment/make-payment.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/utils/utilities-service';

@Component({
  selector: 'app-disbursement-list',
  templateUrl: './disbursement-list.component.html',
  styleUrls: ['./disbursement-list.component.scss']
})
export class DisbursementListComponent {
  disbursements: FormGroup;
  dtOptions: DataTables.Settings = {};
  customers: any[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  photo_url: string | ArrayBuffer;
  loading: boolean = true;
  investors: any;
  errors: string[] = [];
  messages: string[] = [];
  submitted = false;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;
  constructor(private api: ApiService, private router: Router, private modalService: NgbModal, private formBuilder: FormBuilder, private util: UtilsService) { }
  ngOnInit() {
    this.disbursements = this.formBuilder.group({
      from_date: ['', [Validators.required]],
      to_date: ['', [Validators.required]],
    });

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 1000,
      scrollX: true,


    }

    this.getPendingDisbursements();
  }

  get f() { return this.disbursements.controls; }
  getPendingDisbursements() {

    var role_name = this.util.decrypt_Text(localStorage.getItem('role_name'));
    var id = this.util.decrypt_Text(localStorage.getItem('user_id'));
    var endpoint = `admin/get_pending_disbursements?fromDate=${this.disbursements?.get('from_date')?.value}&toDate=${this.disbursements?.get('to_date')?.value}`;
    if (role_name == 'Sub Admin') {
      endpoint = endpoint + '&subAdminId=' + id;
    }

    this.api.get(endpoint).subscribe(
      (res: ApiResponse<any>) => {
        this.investors = res.data;
        this.dtTrigger.next(0);
        this.loading = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  @ViewChild('customersTable') customersTable: any; // Reference to the table element
  exportToExcel(): void {
    const dataToExport = this.investors.map((investor) => ({
      'Investmentor ID': investor.Investmentor_Id,
      'Disbursement Date': investor.Payable_Date,
      'Full Name': `${investor.FirstName} ${investor.LastName}`, // Concatenate first name and last name
      // 'Investment Name': investor.FirstName,
      'Mobile Number': investor.Mobile_Number,
      'Payable_Amt': investor.Payable_Amt,
      'Account_No': investor.Account_No,
      'Bank_Name  ': investor.Bank_Name,
      'Branch_Name': investor.Branch_Name,
      'IFSC_Code': investor.IFSC_Code,
      // Add more fields as needed
    }));
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Investors');
    const fileName = 'disbursement_pending_list_' + new Date().getTime() + '.xlsx';
    XLSX.writeFile(wb, fileName);
  }
  // open(UserId, idx) {
  //   const options = { windowClass: 'custom-ngb-modal-window', backdropClass: 'custom-ngb-modal-backdrop' };
  //   const modalRef = this.modalService.open(MakePaymentComponent, options);
  //   modalRef.componentInstance.selected_id = UserId
  //   modalRef.componentInstance.investment_ID = this.investors[idx].Investmentor_Id

  //   modalRef.result.then((data) => {
  //   },
  //     (error) => {
  //       if (error == "Success") {

  //       }
  //     });
  // }
  // open(Disbursement_Id, idx) {
  //   const options = { windowClass: 'custom-ngb-modal-window', backdropClass: 'custom-ngb-modal-backdrop' };
  //   const modalRef = this.modalService.open(MakePaymentComponent, options);
  //   modalRef.componentInstance.selected_id = this.investorInfo1.Id
  //   modalRef.componentInstance.investment_ID = this.investorInfo1?.Investment_Id
  //   modalRef.componentInstance.disbursement_Id = this.investorInfo?.payments[idx]?.Disbursement_Id
  //   modalRef.result.then((data) => {
  //   },
  //     (error) => {
  //       if (error == "Success") {
  //       }
  //     });
  // }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}