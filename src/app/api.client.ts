// Angular Modules
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { ApiResponse } from './models/api-response';


@Injectable()
export class ApiService {

    private DOMAIN_URL = "https://api.nginfosolutions.com/api/";

    constructor(
        // Angular Modules
        private http: HttpClient
    ) { }
    public get(url: string): Observable<ApiResponse<any>> {
        return this.http.get<ApiResponse<any>>(this.DOMAIN_URL + url);
    }
    public getWithToken(url: string): Observable<ApiResponse<any>> {
        return this.http.get<ApiResponse<any>>(this.DOMAIN_URL + url,
            { headers: new HttpHeaders({ 'No-Auth': 'false' }) });
    }
    public post(url: any, data: any) {
        var reqHeader = new HttpHeaders({ 'No-Auth': 'false' });
        return this.http.post(this.DOMAIN_URL + url, data);
    }

    public put(url: string, body: { id: any; group_Name: any; created_At: Date; status: boolean; }): Observable<ApiResponse<any>> {
        return this.http.get<ApiResponse<any>>(this.DOMAIN_URL + url);
    }
    public delete(url: string) {
        var reqHeader = new HttpHeaders({ 'No-Auth': 'false' });
        return this.http.delete(this.DOMAIN_URL + url);
    }
    login(url: any, email: any, password: any) {
        var reqHeader = new HttpHeaders({ 'No-Auth': 'True' });
        return this.http.post<any>(this.DOMAIN_URL + url, {
            email: email,
            password: password,
        }, { headers: reqHeader })
    }
}