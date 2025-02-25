import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/api.client';
import { ApiResponse } from 'src/app/models/api-response';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddVisitorComponent } from '../add-visitor/add-visitor.component';
import { UpdateVisitorComponent } from '../update-visitor/update-visitor.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
  selector: 'app-visitors',
  templateUrl: './visitors.component.html',
  styleUrls: ['./visitors.component.scss']
})
export class VisitorsComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  visitors: any[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  loading: boolean = true;
  visitor_remove: any;
  constructor(private api: ApiService, private router: Router, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,


    };
    this.loadVisitors();
  }

  loadVisitors() {
    this.api.get('admin/get_all_visitors').subscribe((res: ApiResponse<any>) => {
      this.visitors = res.data;
      this.dtTrigger.next(0);
      this.loading = false;
    }, (error) => {
      console.error(error);
    });
  }

  open() {
    const options = { windowClass: 'custom-ngb-modal-window', backdropClass: 'custom-ngb-modal-backdrop' };
    const modalRef = this.modalService.open(AddVisitorComponent, options);
    modalRef.result.then((data) => {
      this.loadVisitors(); // Reload visitors after adding a new one
    }, (error) => {
      if (error === "Success") {
        this.loadVisitors(); // Reload visitors on success
      }
    });
  }

  UpdateVisitor(item: any, visitor_id: number) {
    const modalRef = this.modalService.open(UpdateVisitorComponent);
    modalRef.componentInstance.visitorId = item.Id;
    modalRef.componentInstance.get_visitor_Name = item.Visitor_Name;
    modalRef.componentInstance.get_contact_NO = item.Contact_No;
    modalRef.componentInstance.get_email_Id = item.Email_ID;
    modalRef.componentInstance.get_purpose_Visit = item.Purpose_Visit;
    modalRef.componentInstance.get_date_of_Visit = item.Date_Of_Visit;
    modalRef.componentInstance.get_Address = item.Address;
    modalRef.componentInstance.get_co = item.C_O;
    modalRef.componentInstance.get_scheme_Id = item.Scheme_Id;
    modalRef.componentInstance.get_created_On = item.Created_On;




    modalRef.componentInstance?.visitorUpdated?.subscribe(() => {
      this.loadVisitors(); // Refresh the visitor list on update
    });

    // modalRef.result.then((result) => {
    //   console.log('Closed with:', result);
    // }, (reason) => {
    //   console.log('Dismissed:', reason);
    // });
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
        this.api.delete(`admin/delete_visitor?visitorId=${Id}`).subscribe(
          (res: any) => {
            this.visitor_remove = res;
            Swal.fire(
              'Removed!',
              'Item removed successfully.',
              'success'
            )
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
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
