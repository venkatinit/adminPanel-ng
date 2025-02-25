import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/api.client';
import { ApiResponse } from 'src/app/models/api-response';
import { DataTableDirective } from 'angular-datatables';
import * as XLSX from 'xlsx';
import { UtilsService } from 'src/app/utils/utilities-service';
@Component({
  selector: 'app-list-investors',
  templateUrl: './list-investors.component.html',
  styleUrls: ['./list-investors.component.scss']
})
export class ListInvestorsComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  loading: boolean = true;
  investors: any[] = [];
  selectedStatus: string = 'ALL'; // Default status
  statusMapping: { [key: string]: string } = {
    ALL: 'All Investors',
    pending: 'Pending Investors',
    accept: 'Accepted Investors',
    reject: 'Rejected Investors'
  };
  allStatus = [
    { name: 'All', status: 'ALL' },
    { name: 'Pending', status: 'pending' },
    { name: 'Accept', status: 'accept' },
    { name: 'Reject', status: 'reject' },
  ];

  constructor(private api: ApiService, private router: Router, private util: UtilsService,) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
    };

    this.fetchInvestors();
  }

  fetchInvestors() {
    const statusQuery = this.selectedStatus; // Get the current selected status
    var role_name = this.util.decrypt_Text(localStorage.getItem('role_name'));
    var id = this.util.decrypt_Text(localStorage.getItem('user_id'));
    var endpoint = `admin/get_all_users?status=${statusQuery}`;
    if (role_name == 'Sub Admin') {
      endpoint = endpoint + '&subAdminId=' + id;
    }

    this.api.get(endpoint).subscribe(
      (res: ApiResponse<any>) => {
        this.investors = res.data;
        this.dtTrigger.next(0);

      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    );
  }

  onStatusChange() {
    this.fetchInvestors(); // Fetch the data based on the new status
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  navigateToDetails(investor: any) {
    this.router.navigate(['/dashboard/investor-details'], {
      queryParams: { investor_id: investor.Investor_Id },
    });
  }
  exportToExcel(): void {
    const dataToExport = this.investors.map((investor) => ({
      'Investment Date': investor.Date_Of_Investment,
      'Investor ID': investor.Investor_Id,
      'Full Name': `${investor.FirstName} ${investor.LastName}`, // Concatenate first name and last name
      // 'Investment Name': investor.FirstName,
      'Mobile Number': investor.Mobile_Number,
      'Plan': investor.Amount,
      'C/O': investor.C_O,
      'Account_No': investor.Account_No,
      'Bank_Name  ': investor.Bank_Name,
      'Branch_Name': investor.Branch_Name,
      'IFSC_Code': investor.IFSC_Code,
    }));
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Investors');
    const fileName = 'Today Investors' + new Date().getTime() + '.xlsx';
    XLSX.writeFile(wb, fileName);
  }
}
function decrypt_Text(arg0: string) {
  throw new Error('Function not implemented.');
}

