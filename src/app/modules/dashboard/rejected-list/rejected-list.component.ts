
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/api.client';
import { ApiResponse } from 'src/app/models/api-response';

@Component({
  selector: 'app-rejected-list',
  templateUrl: './rejected-list.component.html',
  styleUrls: ['./rejected-list.component.scss']
})
export class RejectedListComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  loading: boolean = true;
  investors: any[] = [];

  constructor(private api: ApiService, private router: Router) { }
  // fetchInvestorById(investorId: string) {
  //   this.api.get(`admin/get_investor_info?investorId=${investorId}`).subscribe((res: ApiResponse<any>) => {
  //     // Assuming the response contains the investor details
  //     const investorData = res.data.investor_Info;
  //     this.router.navigate(['dashboard/investor-details'], {
  //       queryParams: { investment_ID: res.data.Investment_ID }
  //     });
  //     // Here you can do something with the data, such as displaying it in a modal or navigating to another page
  //     console.log(investorData);
  //   }, (error) => {
  //     console.log(error);
  //   });
  // }
  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 1000,
    };
    // Fetch all investors initially
    this.fetchAllInvestors();
  }

  fetchAllInvestors() {
    this.api.get('admin/get_all_users?status=reject').subscribe((res: ApiResponse<any>) => {
      this.investors = res.data;
      this.dtTrigger.next(0);
      this.loading = false;
    }, (error) => {
      console.log(error);
    });
  }
  
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  // loadMemberDetails(Investment_ID: any) {
  //   console.log("Navigating with Investment_ID:", Investment_ID);
  //   this.router.navigate(['/dashboard/inverstor-details'], {
  //     queryParams: { Investment_ID: Investment_ID }
  //   });
  // }
  navigateToDetails(investor: any) {
    this.router.navigate(['/dashboard/investor-details'], {
      queryParams: { investor_id: investor.Investment_ID },
    });
  }
}
