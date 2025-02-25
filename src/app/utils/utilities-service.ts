import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {


  constructor(private httpClient: HttpClient) { }
  public post(url: string, object: any): Observable<any> {

    return this.httpClient.post(url, object);
  }
  //   public put(url: string, object: any): Observable<any> {

  //     return this.httpClient.put(url, object);
  // }

  public get(url: string): Observable<any> {

    return this.httpClient.get(url);
  }
  //   public delete(url: string): Observable<any> {

  //     return this.httpClient.delete(url);
  // }


  encrypt_Text(data: any) {
    if (data == null) {
      return null;
    }
    var output = "";
    output = CryptoJS.AES.encrypt(data, "rsygjxzium$#@!").toString();
    return output;
  }
  decrypt_Text(data: any) {
    if (data == null) {
      return null;
    }
    var output = "";
    output = CryptoJS.AES.decrypt(data, "rsygjxzium$#@!").toString(CryptoJS.enc.Utf8);
    return output;
  }
}