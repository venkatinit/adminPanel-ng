import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/api.client';
import { ApiResponse } from 'src/app/models/api-response';
import { UtilsService } from 'src/app/utils/utilities-service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
@Component({
  selector: 'app-slots-calender',
  templateUrl: './slots-calender.component.html',
  styleUrls: ['./slots-calender.component.scss']
})
export class SlotsCalenderComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  customers: any[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  service: any[] = [];
  addSlots: FormGroup;
  errors: string[] = [];
  messages: string[] = [];
  submitted = false;
  spinLoader = false;
  delete_service: any;
  action = 'create';
  cateId: any;
  created_date: any;
  constructor(private api: ApiService, private formBuilder: FormBuilder, private router: Router, private toast: ToastrService, private util: UtilsService) { }
  ngOnInit(): void {
    this.addSlots = this.formBuilder.group({
      service_name: ['', [Validators.required]],
    });
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
    };
    this.getSlots();
  }
  getSlots() {
    this.api.get('get_service_groups').subscribe((res: ApiResponse<any>) => {
      this.service = res.data;
      this.dtTrigger.next(0);

    }, (error) => {
      console.log(error);
    })
  }
  get f() { return this.addSlots.controls; }
  saveaddSlots() {
    this.submitted = true;
    if (!this.addSlots.valid) {
      return;
    }
    this.spinLoader = true;
    const encryptedUserId = localStorage.getItem('id');
    const decryptedUserId = this.util.decrypt_Text(encryptedUserId);
    const url = "create_service_group";
    const body = {
      "id": 0,
      "group_Name": this.addSlots.get("service_name").value,
      "created_At": new Date(),

    };
    this.api.post(url, body).subscribe(
      (res: any) => {
        this.addSlots.reset();
        this.submitted = false;
        this.errors = [];
        this.toast.success('Service added successfully', 'Success');
        this.spinLoader = false;
        this.getSlots();
      },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.errors = [error.error.Message];
        this.toast.error(this.errors[0], 'Service Not added  successfully');
        this.spinLoader = false;
      }
    );
  }
  updateById(id: number) {
    this.action = 'update';
    this.cateId = id;


    this.api.get(`get_service_group_by_id/${id}`).subscribe(
      (res: any) => {
        if (res && res.data && res.succeeded && res.data.status) {
          this.addSlots.controls['service_name'].setValue(res.data.group_Name);
          this.submitted = false;
          this.errors = [];
        }
        this.spinLoader = false;
      },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.errors = [error.error.Message];
        this.toast.error(this.errors[0], 'Service Not added successfully');
        this.spinLoader = false;
      }
    );
  }
  upadateSlots() {
    this.submitted = true;
    if (!this.addSlots.valid) {
      return;
    }
    this.spinLoader = true;
    const encryptedUserId = localStorage.getItem('id');
    const decryptedUserId = this.util.decrypt_Text(encryptedUserId);
    const url = "update_service_group";
    const body = {
      "id": this.cateId,
      "group_Name": this.addSlots.get("service_name").value,
      "created_At": new Date(),
      "status": true
    };

    this.api.put(url, body).subscribe(
      (res: any) => {
        this.addSlots.reset();
        this.submitted = false;
        this.errors = [];
        this.toast.success('Service Updated successfully', 'Success');
        this.spinLoader = false;
        this.getSlots();

      },
      (error: any) => {
        console.log(error);
        this.submitted = false;
        this.errors = [error.error.Message];
        this.toast.error(this.errors[0], 'Service Not Updated successfully');
        this.spinLoader = false;
      }
    );
  }
  deleteService(id: number) {
    Swal.fire({
      position: 'center',
      title: 'Are you sure?',
      text: 'You want to delete this Record.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think'
    }).then((result) => {
      if (result.value) {
        this.api.delete(`delete_service_group/${id}`).subscribe(
          (res: any) => {
            this.delete_service = res
            window.location.reload();
            Swal.fire(
              'Removed!',
              'Item removed successfully.',
              'success'
            )
          })

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Item is safe',
          'error'
        )
      }
    })
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}