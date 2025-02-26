import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/api.client';
import { ApiResponse } from 'src/app/models/api-response';
import { MakePaymentComponent } from '../make-payment/make-payment.component';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
interface Investor {
  name: string;
}
@Component({
  selector: 'app-inverstor-details',
  templateUrl: './inverstor-details.component.html',
  styleUrls: ['./inverstor-details.component.scss']
})
export class InverstorDetailsComponent {
  dtOptions: DataTables.Settings = {};
  customers: any[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  photo_url: string | ArrayBuffer;
  loading: boolean = true;
  userInfo: any;
  name: string;
  principleAmountPerWeek: number;
  interestAmountPerWeek: number;
  totalAmountPerWeek: number;
  weeksArray: number[];
  activeDate: Date;
  investorInfo: any;
  investor_id: string;
  inverstorInfo1: any;
  investors: any;
  investorInfo1: any;
  investment_type:any

  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute, private modalService: NgbModal) { }
  fetchInvestorInfo(Investment_ID: string) {
    this.api.get(`admin/get_investor_info?investorId=${Investment_ID}`).subscribe(
      (response: any) => {
        if (response.succeeded && response.data.investor_Info) {
          this.investorInfo = response?.data;
          this.investorInfo1 = response?.data.receipttDetails;
          this.investment_type = response?.data.investment_Details.Investment_Type;
        }
      },
      (error: any) => {
        console.error('Error fetching investor info:', error);
      }
    );
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.investor_id = params['investor_id'];
      console.log('Investor ID:', this.investor_id);
      if (this.investor_id) {
        this.fetchInvestorInfo(this.investor_id);
      } else {
        console.error('Investor ID is undefined or invalid');
      }
    });
  }
  open(Disbursement_Id, idx, amount) {
    const options = { windowClass: 'custom-ngb-modal-window', backdropClass: 'custom-ngb-modal-backdrop' };
    const modalRef = this.modalService.open(MakePaymentComponent, options);
    modalRef.componentInstance.selected_id = this.investorInfo1.Id
    modalRef.componentInstance.ID = this.investorInfo1?.Id
    modalRef.componentInstance.payments = this.investorInfo?.payments;
    modalRef.componentInstance.EMI = amount;//this.investorInfo.investment_Details.EMI;

    modalRef.componentInstance.disbursement_Id = this.investorInfo?.payments[idx]?.Disbursement_Id
    modalRef.result.then((data) => {
    },
      (error) => {
        if (error == "Success") {
        }
      });
  }
  @ViewChild('investorDetails', { static: false }) investorDetails: ElementRef;

  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }
  async Order_details_generatePDF(action = 'open') {
    let body = [];

    // Table Header
    let headers = [
      { text: 'Week', color: '#f7970f', bold: 'true' },
      { text: 'Date', color: '#f7970f', bold: 'true' },
      
     
    ];
    if (this.investorInfo?.investment_Details?.Investment_Type === 'Fixed Interest') {
      headers.push({ text: 'Milk Profit', color: '#f7970f', bold: 'true' });
    }

    // Conditionally add the Interest/Profit header
    if (this.investorInfo?.investment_Details?.Investment_Type !== 'Fixed Interest') {
      headers.push({ text: 'Principle Invest', color: '#f7970f', bold: 'true' });
      headers.push({ text: 'Milk Profit', color: '#f7970f', bold: 'true' });
    }

    // Always add the Net Profit header
    headers.push({ text: 'Net Profit', color: '#f7970f', bold: 'true' });

    // Push headers to body
    body.push(headers);

    // Make sure investorInfo and payments exist before looping
    if (this.investorInfo?.payments) {
      this.investorInfo.payments.forEach((payment, index) => {
        let row = [
          (index + 1).toString(), // Week number
          payment.Payable_Date, // Date
        
        ];
        if (this.investorInfo?.investment_Details?.Investment_Type === 'Fixed Interest') {
          row.push(`₹ ${payment.Princpial.toFixed(2)}/-`);
         
        }
        // Conditionally add Interest/Profit column
        if (this.investorInfo?.investment_Details?.Investment_Type !== 'Fixed Interest') {
          row.push(`₹ ${payment.Princpial.toFixed(2)}/-`);
          row.push(`₹ ${payment.Interest.toFixed(2)}/-`);
        }

        // Add Net Profit column
        row.push(`₹ ${(payment.Princpial + payment.Interest).toFixed(2)}/-`);

        body.push(row);
      });
    }

    let docDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 40, 40, 40],
      background: [
        {
          image: await this.getBase64ImageFromURL("assets/img/logo.png"),
          fit: [300, 300],
          opacity: 0.3,
          absolutePosition: { x: 150, y: 250 },
          rotate: 45 // Rotation angle (45 degrees)
        }
      ],
      content: [
        {
          image: await this.getBase64ImageFromURL("assets/img/logo.png"),
          height: 50,
          width: 50,
          alignment: 'center'
        },
        {
          text: { text: 'NG info solutions Pvt. Ltd', bold: true, fontSize: 18, color: '#0f8b89' },
          style: 'sectionHeader'
        },
        {
          text: { text: 'Milk & Dairy Farms. Investments', bold: false, fontSize: 16, color: 'black' },
          style: 'sectionHeader'
        },
        {
          text: { text: 'Mobile Number:7075323265', bold: false, fontSize: 15, color: 'black' },
          style: 'sectionHeader'
        },
        {
          layout: 'noBorders',
          table: {
            headerRows: 1,
            widths: ['*', 'auto'],
            body: [
              [
                {
                  text: 'InvestorDetails',
                  color: '#0f8b89',
                  bold: true,
                  fontSize: 18,
                  fillColor: '#e0f2f1',
                  margin: [5, 5, 0, 5]
                },
                { text: ' ', fillColor: '#e0f2f1' }
              ],
              [{ text: 'Investor Name', color: '#f7970f', bold: true }, { text: [this.investorInfo?.investor_Info?.FirstName, ' ', this.investorInfo?.investor_Info?.LastName], color: '#f7970f' }],
              [{ text: 'Investment Scheme', color: '#f7970f', bold: true }, { text: `₹ ${this.investorInfo?.investment_Details?.Amount}`, color: '#f7970f' }],
              [{ text: 'Investment ID', bold: true }, { text: this.investorInfo?.investor_Info?.Investment_ID }],
              [{ text: 'Date Of Investment', bold: true }, { text: this.investorInfo?.receipttDetails?.Date_Of_Investment }],
              [{ text: 'Mobile Number', bold: true }, { text: this.investorInfo?.investor_Info?.Mobile_Number }],
              [{ text: 'Account Number', bold: true }, { text: this.investorInfo?.investor_Info?.Account_No }],
              [{ text: 'Bank Name', bold: true }, { text: this.investorInfo?.investor_Info?.Bank_Name }],
              [{ text: 'Branch Name', bold: true }, { text: this.investorInfo?.investor_Info?.Branch_Name }],
              [{ text: 'IFSC Code', bold: true }, { text: this.investorInfo?.investor_Info?.IFSC_Code }],
              [{ text: 'Address', bold: true }, { text: this.investorInfo?.investor_Info?.Address }],
            ]
          },
          margin: [0, 20, 0, 20]
        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: headers.map(() => '*'), // Dynamic width based on the number of headers

            // Center align the table
            alignment: 'center',

            // widths: ['10%', '20%', '20%', '25%', '25%'],
             body: body
          }
        },
        // Add the two points at the bottom
        {
          text: [
            { text: 'Notes:', bold: true },
            '\n\n',
            { text: '1. ', bold: true },
            'The amount will be credited to your registered bank account, and no modifications can be made once the transaction has been initiated.\n\n',
            { text: '2. ', bold: true },
            'If you do not receive the funds by the disbursement date, kindly notify us within one week. Requests submitted after this period cannot be processed.'
          ],
          margin: [0, 20, 0, 0], // Add margin for spacing
          fontSize: 12,
          color: 'black'
        }
      ],
      styles: {
        sectionHeader: {
          alignment: 'center',
          fontStyle: 'Poppins',
          fontWight: 900
        },
        text: {
          fontSize: 14,
          margin: [15, 15, 15, 15]
        }
      },
      
      defaultStyle: {
        alignment: 'justify'
      }
    };

    if (action === 'download') {
      pdfMake.createPdf(docDefinition).download();
    } else if (action === 'print') {
      pdfMake.createPdf(docDefinition).print();
    } else {
      pdfMake.createPdf(docDefinition).open();
    }
  }
  sendWhatsAppMessage(phoneNumber: string) {
    const whatsappLink = this.generateWhatsAppLink(this.investorInfo.investor_Info.Mobile_Number);
    window.open(whatsappLink, '_blank');
  }
  generateWhatsAppLink(phoneNumber: string) {
    return `https://wa.me/${this.investorInfo.investor_Info.Mobile_Number}`;
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}