import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/api.client';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {
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
  constructor(private formBuilder: FormBuilder, private api: ApiService, public toast: ToastrService, public activeModal: NgbActiveModal) { }
  ngOnInit(): void {
    this.makePayments = this.formBuilder.group({
      Date_Of_Payment: ['', [Validators.required]],
      Mode_Of_Payment: ['', [Validators.required]],
      Transaction_Id: ['', [Validators.required]],
      Amount_Paid: ['', [Validators.required]],
      Attachment: ['', [Validators.required]],
      Paid_By: ['', [Validators.required]],
      Is_last_payment: ['', [Validators.required]]

    });
  }
  get f() { return this.makePayments.controls; }

  savemakePayment() {
    this.submitted = true;
    if (!this.makePayments.valid) {
      return;
    }
    this.spinLoader = true;
    const url = "admin/make_payment";
    const formData = new FormData();
    formData.append("Id", this.selected_id);
    formData.append("Investment_Id", this.ID);
    formData.append("Disbursement_Id", this.disbursement_Id);
    formData.append("Date_Of_Payment", this.makePayments?.get('Date_Of_Payment')?.value);
    formData.append("Mode_Of_Payment", this.makePayments?.get("Mode_Of_Payment")?.value);
    formData.append("Transaction_Id", this.makePayments?.get("Transaction_Id")?.value);
    formData.append("Amount_Paid", this.makePayments?.get("Amount_Paid")?.value);
    formData.append("Attachment", this.thumb_nail_url);
    formData.append("Paid_By", this.makePayments?.get("Paid_By")?.value);
    formData.append("Is_last_payment", this.makePayments?.get("Is_last_payment")?.value);

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
