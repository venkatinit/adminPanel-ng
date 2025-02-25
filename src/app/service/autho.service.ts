import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

import { UtilsService } from '../utils/utilities-service';

import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // loginUSer(loginUserData: any) 
  // {
  //   throw new Error('Method not implemented.');
  // }
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  api_url = environment.API_URL;

  public get currentUserValue(): User {
    var user_data = this.util.decrypt_Text(localStorage.getItem('currentUser'));
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(user_data|| null));

    return this.currentUserSubject.value;
  }


  constructor(private httpClient: HttpClient, public router: Router, public util: UtilsService) {
    var user_data = this.util.decrypt_Text(localStorage.getItem('currentUser'));
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(user_data|| null));
    this.currentUser = this.currentUserSubject.asObservable();
  }
  login(username: any, password: any) {
    var reqHeader = new HttpHeaders({ 'No-Auth': 'True' });
    return this.httpClient.post<any>(`${this.api_url}api/Account/login`, {
      mobileNumber: username,
      password: password
    }, { headers: reqHeader })
  }

  activateAccount(username: any, token: any, password: any) {
    var reqHeader = new HttpHeaders({ 'No-Auth': 'True' });
  }
  getAccessToken() {
    var access_token = this.util.decrypt_Text(localStorage.getItem('access_token'));
    return access_token;
  }
  getUserId() {
    var uid = this.util.decrypt_Text(localStorage.getItem('user_id'));
    return uid;//encodeURIComponent(uid);
  }
  getUserName() {
    return this.util.decrypt_Text(localStorage.getItem('user_data'));


  }

  logout() {
    localStorage.clear();
    if (localStorage.removeItem('access_token') == null) {
      this.router.navigate(['/login']);
    }
  }
}