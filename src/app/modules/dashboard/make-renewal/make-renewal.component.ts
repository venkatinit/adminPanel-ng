import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.client';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-make-renewal',
  templateUrl: './make-renewal.component.html',
  styleUrls: ['./make-renewal.component.scss']
})
export class MakeRenewalComponent implements OnInit {
  makeRenewals: FormGroup;
  allInvestments: any[] = [];
  filteredInvestments: any[] = [];
  @Input() Investement_id;
  submitted: boolean;
  dtOptions: DataTables.Settings = {};
  customers: any[] = [];
  loading: boolean = true;
  maxDate = new Date();
  bsConfig = { showWeekNumbers: false, dateInputFormat: 'DD-MMM-YYYY' };
  registerForm: FormGroup;
  branchForm: FormGroup;
  errors: string[] = [];
  messages: string[] = [];
  investment_Id:any;
  spinLoader = false;
  thumb_images: string = "../../../../assets/img/file_upload.png";
  thumb_nail_url: any = "../../../../assets/img/file_upload.png"
  message: string | undefined;
  last_investment_id: any;
 
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    public toast: ToastrService,
    public activeModal: NgbActiveModal
  ) { }
  ngOnInit(): void {
    this.makeRenewals = this.formBuilder.group({
      Plan_Id: ['', [Validators.required]],
      Date_Of_Renew: ['', [Validators.required]],
      Receipt_Mode: ['', [Validators.required]],
      Transaction_Id: ['', [Validators.required]],
      Attachment: ['', [Validators.required]]
    });
    // Fetch investments from the API
    this.api.get('admin/get_all_investment_master').subscribe((response: any) => {
      if (response.succeeded) {
        this.allInvestments = response.data;
        this.filteredInvestments = this.allInvestments.filter(investment => investment.Id === this.Investement_id);
      }
    });
  }
  get f() {
    return this.makeRenewals.controls;
  }
  closeModal() {
    this.activeModal.dismiss();
  }
  savemakeRenewal($event:any) {
    this.submitted = true;
    if (this.makeRenewals.invalid) {
      return;
    }
    this.spinLoader = true;
    const url = "admin/renew_investment";
    const formData = new FormData();
    formData.append("Last_Investment_Id", this.Investement_id);
    formData.append("Plan_Id", this.investment_Id);
    formData.append("Date_Of_Renew", this.makeRenewals.get("Date_Of_Renew")?.value);
    formData.append("Receipt_Mode", this.makeRenewals.get("Receipt_Mode")?.value);
    formData.append("Transaction_Id", this.makeRenewals.get("Transaction_Id")?.value);
    formData.append("Attachment", this.thumb_nail_url);

    this.api.post(url, formData).subscribe(
      (res: any) => {
        this.makeRenewals.reset();
        this.submitted = false;
        this.toast.success('Renewal Completed Successfully!');
        this.spinLoader = false;
      },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.errors = [error.error.Message];
        this.toast.error(this.errors[0], "Validation Failed");
        this.spinLoader = false;
      }
    );
  }

  onThumbNailFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.thumb_images = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      this.thumb_nail_url = event.target.files[0];
    }
  }
}
