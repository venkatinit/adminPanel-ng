import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable, of, BehaviorSubject, forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  api_url = environment.API_URL;  
  public current_user: User | undefined;
  constructor(private httpClient:HttpClient) { 
  }


  
  AddUser(user:User):Observable<any>{
    return this.httpClient.post(`${this.api_url}/user/`,user);
  }
 
}

