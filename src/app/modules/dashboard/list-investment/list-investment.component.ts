import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/api.client';
import { ApiResponse } from 'src/app/models/api-response';
import { AddInvestmentComponent } from '../add-investment/add-investment.component';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-list-investment',
  templateUrl: './list-investment.component.html',
  styleUrls: ['./list-investment.component.scss']
})
export class ListInvestmentComponent {
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
    this.api.get('admin/get_all_investment_master').subscribe((res: ApiResponse<any>) => {
      this.investment = res.data;
      this.dtTrigger.next(0);
    }, (error) => {
      console.log(error);
    })
  }
  open() {
    const options = { windowClass: 'custom-ngb-modal-window', backdropClass: 'custom-ngb-modal-backdrop' };
    const modalRef = this.modalService.open(AddInvestmentComponent, options);
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

  // deleteInvestment(Id) {
  //   this.api.get(`admin/delete_investment_master?id=${Id}`).subscribe((res: any) => {
  //     this.investment_remove = res

  //     this.toast.success('Investment Deleted Successfully!');
  //     window.location.reload()
  //   },
  //     (error: any) => {
  //       console.log(error);
  //       this.submitted = false;
  //       this.errors = [error.error.Message];
  //       this.toast.error(this.errors[0], "Delete Not possible. Some Investors Already Exists  ");
  //       this.spinLoader = false; // Reset loader state
  //     }
  //   )
  // }
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
            );
            window.location.reload();
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