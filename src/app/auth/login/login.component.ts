import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, of } from 'rxjs';
import { ApiService } from 'src/app/api.client';
import { UtilsService } from 'src/app/utils/utilities-service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted: boolean = false;
  data: any;
  api_url = environment.API_URL;
  message: string | undefined;
  errors: string[] = [];
  messages: string[] = [];
  password;
  show = false;
  constructor(private formBuilder: FormBuilder, private router: Router, private api: ApiService, private util: UtilsService, public toast: ToastrService) { }
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      remember_me: ['', [Validators.required]]
    })
  }
  onClick() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }
  get f() {
    return this.loginForm.controls;
  }

  saveNewMember() {
    this.submitted = true;
    this.errors = [];
    this.messages = [];
    if (!this.loginForm.valid) {
      return;
    }
    const url = "admin/login";
    var body = {
      "email": this.loginForm.get("email"),
      "password": this.loginForm.get("password")
    }
    this.api.login(url, this.loginForm?.get("email")?.value, this.loginForm?.get("password")?.value)
      .pipe(catchError((error: any, caught: Observable<any>): Observable<any> => {
        console.error('There was an error!', error);
        return of();
      }))
      .subscribe(res => {
        if (res.succeeded) {
          localStorage.setItem('access_token', this.util.encrypt_Text(res.data?.token) || "");
          localStorage.setItem('user_id', this.util.encrypt_Text(res.data?.userId.toString()) || "");
          localStorage.setItem('role_name', this.util.encrypt_Text(res.data?.role_Name.toString()) || "");
          localStorage.setItem('currentUser', this.util.encrypt_Text(JSON.stringify(res.data)) || "");
          this.router.navigate(['/dashboard']);
        } else {
          this.toast.error(res.data.message, "Validation Failed");
        }
      });
  }
}
