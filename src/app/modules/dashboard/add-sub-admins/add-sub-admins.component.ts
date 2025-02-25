import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/api.client';
import { UtilsService } from 'src/app/utils/utilities-service';

@Component({
  selector: 'app-add-sub-admins',
  templateUrl: './add-sub-admins.component.html',
  styleUrls: ['./add-sub-admins.component.css']
})
export class AddSubAdminsComponent implements OnInit {
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
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      role_Id: ['3', [Validators.required]],
      email: ['', [Validators.required]],
      address: [''],
      mobile_Number: ['', [Validators.required]]
    });
  }
  get f() { return this.addVisitors.controls; }
  saveaddVisitor() {
    this.submitted = true;
    if (!this.addVisitors.valid) {
      return;
    }
    this.spinLoader = true;

    const encryptedUserId = localStorage.getItem('user_id');
    const decryptedUserId = this.util.decrypt_Text(encryptedUserId);

    const url = "user/create_user";
    // const body = {
    //   "id": 0,
    //   "visitor_Name": this.addVisitors.get("visitor_Name").value,
    //   "contact_No": this.addVisitors.get("contact_No").value,
    //   "email_ID": this.addVisitors.get("email_ID").value,
    //   "purpose_Visit": this.addVisitors.get("purpose_Visit").value,
    //   "date_Of_Visit": this.addVisitors.get("date_Of_Visit").value,
    //   "address": this.addVisitors.get("address").value,
    //   "scheme_Id": 0,
    //   "c_O": this.addVisitors.get("c_O").value,
    //   "created_By": decryptedUserId,

    // };

    this.api.post(url, this.addVisitors.value).subscribe(
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
