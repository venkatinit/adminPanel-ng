import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/api.client';
import { ApiResponse } from 'src/app/models/api-response';
import { AddInvestmentComponent } from '../add-investment/add-investment.component';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AddSubAdminsComponent } from '../add-sub-admins/add-sub-admins.component';


@Component({
  selector: 'app-list-sub-admins',
  templateUrl: './list-sub-admins.component.html',
  styleUrls: ['./list-sub-admins.component.css']
})
export class ListSubAdminsComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  investment: any = [];
  investment_remove: any;
  dtTrigger: Subject<any> = new Subject<any>();
  errors: string[] = [];
  messages: string[] = [];
  submitted = false;
  spinLoader = false;
  constructor(private modalService: NgbModal, private api: ApiService, private toast: ToastrService) { }
  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.api.get('user/get_all_users?roleId=3').subscribe((res: ApiResponse<any>) => {
      this.investment = res.data;
      this.dtTrigger.next(0);
    }, (error) => {
      console.log(error);
    })
  }
  open() {
    const options = { windowClass: 'custom-ngb-modal-window', backdropClass: 'custom-ngb-modal-backdrop' };
    const modalRef = this.modalService.open(AddSubAdminsComponent, options);
    modalRef.result.then((data) => {
    },
      (error) => {
        if (error == "Success") {
          // this.LoadBrands();
        }
      });
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  deleteInvestment(Id: number) {
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
        this.api.get(`admin/delete_investment_master?id=${Id}`).subscribe(
          (res: any) => {
            this.investment_remove = res;
            Swal.fire(
              'Removed!',
              'Item removed successfully.',
              'success'
            )
          })

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Item is safe.',
          'error'
        )
      }
    })
  }
}
