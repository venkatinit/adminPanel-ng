import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/api.client';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UtilsService } from 'src/app/utils/utilities-service';
@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.scss']
})
export class MakePaymentComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  makePayments: FormGroup;
  customers: any[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  loading: boolean = true;
  maxDate = new Date();
  bsConfig = { showWeekNumbers: false, dateInputFormat: 'DD-MMM-YYYY' };
  registerForm: FormGroup;
  branchForm: FormGroup;
  errors: string[] = [];
  messages: string[] = [];
  submitted = false;
  spinLoader = false;
  thumb_images: string = "../../../../assets/img/file_upload.png";
  thumb_nail_url: any = "../../../../assets/img/file_upload.png"

  message: string | undefined;
  @Input() selected_id;
  @Input() ID;
  @Input() disbursement_Id;
  @Input() payments: any[];
  @Input() EMI;
  constructor(private formBuilder: FormBuilder, private api: ApiService, private util: UtilsService, public toast: ToastrService, public activeModal: NgbActiveModal) { }
  ngOnInit(): void {
    this.makePayments = this.formBuilder.group({
      Date_Of_Payment: ['', [Validators.required]],
      Mode_Of_Payment: ['', [Validators.required]],
      Transaction_Id: ['', [Validators.required]],
      Amount_Paid: [{ value: this.EMI, disabled: true }, Validators.required],
      Attachment: ['', [Validators.required]],
      // Paid_By: ['', [Validators.required]],
      // Is_last_payment: ['', [Validators.required]]

    });
    console.log("Payments array: ", this.payments);




  }
  get f() { return this.makePayments.controls; }

  closeModal() {
    this.activeModal.dismiss();
  }
  savemakePayment() {
    this.submitted = true;
    if (!this.makePayments.valid) {
      return;
    }
    this.spinLoader = true;
    const payments = this.payments; // assuming the data object holds the payments array

    // Determine if the current payment is the last payment
    let isLastPayment = false;
    if (payments && payments.length > 0) {
      const lastPayment = payments[payments.length - 1];
      // Check if the payment being processed is the last one
      if (lastPayment.Disbursement_Id === this.disbursement_Id) {
        isLastPayment = true;
      }
    }
    const encryptedUserId = localStorage.getItem('user_id');
    const decryptedUserId = this.util.decrypt_Text(encryptedUserId);

    const url = "admin/make_payment";
    const formData = new FormData();
    formData.append("Id", this.selected_id);
    formData.append("Investment_Id", this.ID);
    formData.append("Disbursement_Id", this.disbursement_Id);
    formData.append("Date_Of_Payment", this.makePayments?.get('Date_Of_Payment')?.value);
    formData.append("Mode_Of_Payment", this.makePayments?.get("Mode_Of_Payment")?.value);
    formData.append("Transaction_Id", this.makePayments?.get("Transaction_Id")?.value);
    formData.append("Amount_Paid", this.EMI);
    formData.append("Attachment", this.thumb_nail_url);
    formData.append("Paid_By", decryptedUserId);
    formData.append("Is_last_payment", isLastPayment ? "true" : "false");

    this.api.post(url, formData).subscribe(
      (res: any) => {
        this.makePayments.reset();
        this.submitted = false;
        this.toast.success('Payment Saved Successfully!');
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
  onThumbNailFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.thumb_images = event.target.result;
        }
        reader.readAsDataURL(event.target.files[i]);
      }
      this.thumb_nail_url = event.target.files[0];
    }
  }
}