import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/api.client';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-investment',
  templateUrl: './add-investment.component.html',
  styleUrls: ['./add-investment.component.scss']
})
export class AddInvestmentComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  addInvestments: FormGroup;
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
  message: string | undefined;
  constructor(private formBuilder: FormBuilder, private api: ApiService, public toast: ToastrService, public activeModal: NgbActiveModal) { }
  ngOnInit(): void {
    this.addInvestments = this.formBuilder.group({
      investment_Name: ['', [Validators.required]],
      plan: ['', [Validators.required]],
      total_interest: ['', [Validators.required]],
      rate_of_Int: ['', [Validators.required]],
      payment_percentage: ['', [Validators.required]],
      maturity_value: ['', [Validators.required]],
      duration_In_Days: ['', [Validators.required]],
      no_of_payments: ['', [Validators.required]],
      emi: ['', [Validators.required]],
      first_payment:['', [Validators.required]],
      last_payment: ['', [Validators.required]],
      selectedOption: new FormControl('option1'),
      depositType: new FormControl('1', [Validators.required]),
    });

  }

  get f() { return this.addInvestments.controls; }
  saveaddInvestment() {
    this.submitted = true;
    if (!this.addInvestments.valid) {
      return;
    }
    this.spinLoader = true;

    const url = "admin/add_investment";
    const body = {
      "investment_Name": this.addInvestments.get("investment_Name").value,
      "amount": this.addInvestments.get("plan").value,
      "total_Interest": this.addInvestments.get("total_interest").value,
      "rate_Of_Int": this.addInvestments.get("rate_of_Int").value,
      "maturity_Value": this.addInvestments.get("maturity_value").value,
      "duration_In_Days": this.addInvestments.get("duration_In_Days").value,
      "no_Of_Payments": this.addInvestments.get("no_of_payments").value,
      "emi": this.addInvestments.get("emi").value,
      "payment_Percentage": this.addInvestments.get("payment_percentage").value,
      "investment_Type": this.addInvestments.get("depositType").value,
      "first_Payment": this.addInvestments.get("first_payment").value,
      "last_Payment": this.addInvestments.get("last_payment").value,

      
    };

    this.api.post(url, body).subscribe(
      (res: any) => {
        // Reset form and state upon successful submission
        this.addInvestments.reset();
        this.submitted = false;
        this.errors = [];
        this.toast.success('Investment added successfully', 'Success');
        this.spinLoader = false;
      },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.errors = [error.error.Message];
        this.toast.error(this.errors[0], 'Validation Failed');
        this.spinLoader = false; // Reset loader state
      }
    );
  }

  submitForm() {
    if (this.registerForm.valid) {
      console.log('Form is valid. Submitting...');
    } else {
      console.log('Form is invalid. Cannot submit.');
      this.markFormGroupTouched(this.registerForm);
    }
  }

  // Utility method to mark all fields in the form group as touched
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}




