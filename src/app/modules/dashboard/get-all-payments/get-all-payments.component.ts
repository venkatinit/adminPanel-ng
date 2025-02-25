import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/api.client';
import { ApiResponse } from 'src/app/models/api-response';
import { AddInvestmentComponent } from '../add-investment/add-investment.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-get-all-payments',
  templateUrl: './get-all-payments.component.html',
  styleUrls: ['./get-all-payments.component.scss']
})      
export class GetAllPaymentsComponent {
  dtOptions: DataTables.Settings = {};
  investors: any = [];
  // investment_remove:any;
  dtTrigger: Subject<any> = new Subject<any>();
  errors: string[] = [];
  messages: string[] = [];
  submitted = false;
  spinLoader = false;
  constructor(private modalService: NgbModal, private api: ApiService,private toast:ToastrService) { }
  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 1000,
    };
    this.api.get('admin/get_all_payments').subscribe((res: ApiResponse<any>) => {
      this.investors = res.data;
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
 
  // deleteInvestment(Id){
  //   this.api.get(`admin/delete_investment_master?id=${Id}`).subscribe((res:any)=>{
  //     this.investment_remove=res
 
  //   this.toast.success('Investment Deleted Successfully!');
  //   window.location.reload()
  //   },
  //   (error: any) => {
  //     console.log(error);
  //     this.submitted = false;
  //     this.errors = [error.error.Message];
  //     this.toast.error(this.errors[0], "Delete Not possible. Some Investors Already Exists  ");
  //     this.spinLoader = false; // Reset loader state
  //   }
  // )
    
  // }
  
}