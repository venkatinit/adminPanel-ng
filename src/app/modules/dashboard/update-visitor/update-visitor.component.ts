import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/api.client';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/utils/utilities-service';

@Component({
  selector: 'app-update-visitor',
  templateUrl: './update-visitor.component.html',
  styleUrls: ['./update-visitor.component.scss']
})
export class UpdateVisitorComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  updateVisitors: FormGroup;
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
  @Input() visitorId;
  @Input() get_visitor_Name;
  @Input() get_contact_NO;
  @Input() get_email_Id;
  @Input() get_purpose_Visit;
  @Input() get_date_of_Visit;
  @Input() get_Address;
  @Input() get_co;
  @Input() get_scheme_Id;
  @Input() get_created_On;
  @Input() date_of_visit;
  message: string | undefined;
  constructor(private formBuilder: FormBuilder,private util:UtilsService, private router:Router, private api: ApiService, public toast: ToastrService, public activeModal: NgbActiveModal) { }
  ngOnInit(): void {
    this.updateVisitors = this.formBuilder.group({
      visitor_Name: ['', [Validators.required]],
      contact_No: ['', [Validators.required]],
      email_ID: ['', [Validators.required]],
      purpose_Visit: ['', [Validators.required]],
      date_of_visit: [{ value: this.date_of_visit, disabled: true }, [Validators.required]],
      address: ['', [Validators.required]],
      dateOfReching: ['', [Validators.required]],
      scheme_Id: ['', [Validators.required]],
      created_By: ['', [Validators.required]],
    });
  }
  get f() { return this.updateVisitors.controls; }
  saveupdateVisitor() {
    this.submitted = true;
    if (this.updateVisitors.valid) {
      return;
    }
    this.spinLoader = true;
    const encryptedUserId = localStorage.getItem('user_id');
    const decryptedUserId = this.util.decrypt_Text(encryptedUserId);

    const url = "admin/update_visitor";
    const body = {
      "id": this.visitorId,
      "visitor_Name": this.updateVisitors.get("visitor_Name").value,
      "contact_No": this.updateVisitors.get("contact_No").value,
      "email_ID": this.updateVisitors.get("email_ID").value,
      "purpose_Visit": this.updateVisitors.get("purpose_Visit").value,
      "date_Of_Visit": this.updateVisitors.get("date_of_visit").value,
      "address": this.updateVisitors.get("address").value,
      "scheme_Id": 0,
      "c_O": this.updateVisitors.get("dateOfReching").value,
      "created_By": decryptedUserId
    };

    this.api.post(url, body).subscribe(
      (res: any) => {
        // Reset form and state upon successful submission
         this.updateVisitors.reset();
        this.submitted = false;
        this.errors = [];
        this.toast.success('Visitor Updated successfully', 'Success');
        this.router.navigate(['dashboard/visitors']);
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
  // submitForm() {
  //   if (this.registerForm.valid) {
  //     console.log('Form is valid. Submitting...');
  //   } else {
  //     console.log('Form is invalid. Cannot submit.');
  //     this.markFormGroupTouched(this.registerForm);
  //   }
  // }
  // Utility method to mark all fields in the form group as touched
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  closeModal() {
    this.activeModal.dismiss();
  }
}