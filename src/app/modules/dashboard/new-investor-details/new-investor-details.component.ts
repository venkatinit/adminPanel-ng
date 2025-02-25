import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/api.client';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from 'src/app/utils/utilities-service';
import { ApiResponse } from 'src/app/models/api-response';
@Component({
  selector: 'app-new-investor-details',
  templateUrl: './new-investor-details.component.html',
  styleUrls: ['./new-investor-details.component.scss']
})
export class NewInvestorDetailsComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  customers: any[] = [];
  subAdmins: any[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  loading: boolean = true;
  isModalOpen = false;
  name = 'Angular';
  maxDate = new Date();
  bsConfig = { showWeekNumbers: false, dateInputFormat: 'DD-MMM-YYYY' };
  NewInvestorForm: FormGroup;
  errors: string[] = [];
  messages: string[] = [];
  submitted = false;
  spinLoader = false;
  investorInfo: any;
  investorInfo1: any;
  investor_id: any;
  subAdmin_id: number = 0;
  thumb_images: string = "../../../../assets/img/";
  message: string | undefined;
  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private api: ApiService, public toast: ToastrService, public util: UtilsService, public activeModal: NgbActiveModal) { }
  getMemberdetails(Investment_ID: string) {
    this.api.get(`admin/get_investor_info?investorId=${Investment_ID}`).subscribe((response: any) => {
      if (response.succeeded && response.data.investor_Info) {
        this.investorInfo = response.data.investor_Info;
        this.investorInfo1 = response.data.receipttDetails;
        this.NewInvestorForm.patchValue({
          name: this.investorInfo['FirstName'],
          lname: this.investorInfo['LastName'],
          email: this.investorInfo['Email'],
          mobile_no: this.investorInfo['Mobile_Number'],
          bank_account_number: this.investorInfo['Account_No'],
          bank_name: this.investorInfo['Bank_Name'],
          ifsc_code: this.investorInfo['IFSC_Code'],
          address: this.investorInfo['Address'],
          branch_name: this.investorInfo['Branch_Name'],
          co: this.investorInfo['C_O'],
          Date_Of_Investment: this.investorInfo1['Date_Of_Investment'],
          Transaction_Id: this.investorInfo1['Transaction_Id'],
          Attachment: `https://api.nginfosolutions.com/images/${this.investorInfo1['Attachment']}`,
        });
      }
    }, (error) => {
      console.log(error);
    });
  }

  loadSubAdmins() {
    this.api.get('user/get_all_users?roleId=3').subscribe((res: ApiResponse<any>) => {
      this.subAdmins = res.data;
    }, (error) => {
      console.error(error);
    });
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.investor_id = params['investor_id'];
      console.log('Investor ID:', this.investor_id);
      if (this.investor_id) {
        this.getMemberdetails(this.investor_id);
      } else {
        console.error('Investor ID is undefined or invalid');
      }
    });
    this.NewInvestorForm = this.formBuilder.group({
      name: ['', Validators.required],
      lname: ['', Validators.required],
      mobile_no: ['', Validators.required],
      bank_account_number: ['', Validators.required],
      bank_name: ['', Validators.required],
      branch_name: ['', Validators.required],
      ifsc_code: ['', Validators.required],
      address: ['', Validators.required],
      co: ['', Validators.required],
      email: ['', Validators.required],
      remainder_date: ['', Validators.required],
      Date_Of_Investment: ['', Validators.required],
      Transaction_Id: ['', Validators.required],
      subAdmin_id: ['', Validators.required],
      Attachment: ['']
    });
    this.loadSubAdmins();
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.NewInvestorForm.get('Attachment')?.setValue(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  removeAttachment() {
    this.NewInvestorForm.get('Attachment')?.setValue(null);
  }
  openModal() {
    this.isModalOpen = true;
  }

  closeModal(event: Event) {
    event.stopPropagation();
    this.isModalOpen = false;
  }

  saveNewInvestorForm() {
    this.submitted = true;
    if (!this.NewInvestorForm.valid) {
      return;
    }
    this.spinLoader = true;
    const url = "admin/update_user";
    const body = {
      "userId": this.investorInfo.UserId,
      "firstName": this.NewInvestorForm.get("name")?.value,
      "lastName": this.NewInvestorForm.get("lname")?.value,
      "userType": "U",
      "bank_Name": this.NewInvestorForm.get("bank_name")?.value,
      "branch_Name": this.NewInvestorForm.get("branch_name")?.value,
      "c_O": this.NewInvestorForm.get("co")?.value,
      "account_No": this.NewInvestorForm.get("bank_account_number")?.value,
      "ifsC_Code": this.NewInvestorForm.get("ifsc_code")?.value,
      "email": this.NewInvestorForm.get("email")?.value,
      "address": this.NewInvestorForm.get("address")?.value,
      "mobile_Number": this.NewInvestorForm.get("mobile_no")?.value
    };
    this.api.post(url, body).subscribe((res: any) => {
      this.submitted = false;
      this.NewInvestorForm.reset();
    },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.errors = [error.error.Message];
      }
    );
  }
  get f() { return this.NewInvestorForm.controls; }
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  acceptInvestor() {
    const URL = `admin/verify_user`;
    const body = {
      "user_Id": this.investorInfo.UserId,
      "status": "accept",
      "subAdminId": this.NewInvestorForm.get("subAdmin_id")?.value
    }
    this.api.post(URL, body).subscribe((res: any) => {
      this.toast.success(res.message);
      this.NewInvestorForm.reset();
      this.acceptReceipt();
    },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.errors = [error.error.Message];
        this.toast.error(this.errors[0], "Validation Failed");
        this.spinLoader = false; // Reset loader state
      }
    );
  }
  acceptReceipt() {
    const URL1 = `admin/verify_receipt`;
    const body = {
      "receiptId": this.investorInfo1.Id,
      "status": "accept"
    }

    this.api.post(URL1, body).subscribe(res => (
      {

      }
    ))
  }
  rejectInvestor() {
    const URL = `admin/verify_user`;
    const body = {
      "user_Id": this.investorInfo.UserId,
      "status": "reject"
    }
    this.api.post(URL, body).subscribe(res => (
      {}
    ))
  }
  rejectReceipt() {
    const URL2 = `admin/verify_receipt`;
    const body = {
      "receiptId": this.investorInfo1.Id,
      "status": "reject"
    }
    this.api.post(URL2, body).subscribe((res: any) => {
      this.toast.success(res.message);
      this.NewInvestorForm.reset();
      this.rejectReceipt();
    },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.errors = [error.error.Message];
        this.toast.error(this.errors[0], "Validation Failed");
        this.spinLoader = false; // Reset loader state
      }
    );
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}