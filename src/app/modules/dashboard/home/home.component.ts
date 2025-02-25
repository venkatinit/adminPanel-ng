import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ADTSettings } from "angular-datatables/src/models/settings";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { ApiService } from "src/app/api.client";
import { ApiResponse } from "src/app/models/api-response";
import { UtilsService } from "src/app/utils/utilities-service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  dtOptions: DataTables.Settings = {};
  customers: any[] = [];
  dtTrigger: Subject<any> = new Subject<any>();

  count_details: any;
  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute, public toast: ToastrService, private util: UtilsService) { }
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
    };
    var role_name = this.util.decrypt_Text(localStorage.getItem('role_name'));
    var id = this.util.decrypt_Text(localStorage.getItem('user_id'));
    var endpoint = `admin/get_dashboard`;
    if (role_name == 'Sub Admin') {
      endpoint = endpoint + '?subAdminId=' + id;
    }

    this.api.get(endpoint).subscribe(
      (res: ApiResponse<any>) => {
        this.count_details = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
    this.api.get('admin/get_all_users?status=pending').subscribe((res: ApiResponse<any>) => {
      this.customers = res.data;
      this.dtTrigger.next(0);
      this.loading = false;
    }, (error) => {
      console.log(error);
    })
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  navigateToDetails(investor: any) {
    this.router.navigate(['/dashboard/new-investors-details'], {
      queryParams: { investor_id: investor.Investor_Id },
    });
  }
}
