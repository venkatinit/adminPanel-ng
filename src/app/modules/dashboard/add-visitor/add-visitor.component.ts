import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/api.client';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UtilsService } from 'src/app/utils/utilities-service';
import { Route, Router } from '@angular/router';
@Component({
  selector: 'app-add-visitor',
  templateUrl: './add-visitor.component.html',
  styleUrls: ['./add-visitor.component.scss']
})
export class AddVisitorComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  addVisitors: FormGroup;
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
  constructor(private formBuilder: FormBuilder, private router: Router, private api: ApiService, public toast: ToastrService, private util: UtilsService, public activeModal: NgbActiveModal) { }
  ngOnInit(): void {
    this.addVisitors = this.formBuilder.group({
      visitor_Name: ['', [Validators.required]],
      contact_No: ['', [Validators.required]],
      email_ID: ['', [Validators.required]],
      purpose_Visit: ['', [Validators.required]],
      date_Of_Visit: ['', [Validators.required]],
      address: ['', [Validators.required]],
      c_O: ['', [Validators.required]],
      scheme_Id: ['', [Validators.required]],
      created_By: ['', [Validators.required]],
    });
  }
  get f() { return this.addVisitors.controls; }
  saveaddVisitor() {
    this.submitted = true;
    if (this.addVisitors.valid) {
      return;
    }
    this.spinLoader = true;

    const encryptedUserId = localStorage.getItem('user_id');
    const decryptedUserId = this.util.decrypt_Text(encryptedUserId);

    const url = "admin/create_visitor";
    const body = {
      "id": 0,
      "visitor_Name": this.addVisitors.get("visitor_Name").value,
      "contact_No": this.addVisitors.get("contact_No").value,
      "email_ID": this.addVisitors.get("email_ID").value,
      "purpose_Visit": this.addVisitors.get("purpose_Visit").value,
      "date_Of_Visit": this.addVisitors.get("date_Of_Visit").value,
      "address": this.addVisitors.get("address").value,
      "scheme_Id": 0,
      "c_O": this.addVisitors.get("c_O").value,
      "created_By": decryptedUserId,

    };

    this.api.post(url, body).subscribe(
      (res: any) => {
        // Reset form and state upon successful submission
        this.addVisitors.reset();
        this.submitted = false;
        this.errors = [];
        this.toast.success('Visitor added successfully', 'Success');
        this.router.navigate(['/dashboard/visitors']);
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