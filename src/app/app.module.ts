import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { DefaultLayoutComponent } from './components/default-layout/default-layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiService } from './api.client';
import { AuthGuard } from './gaurds/auth.gaurd';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { LoaderInterceptor } from './interceptors/loader-interceptor.service';
import { AuthService } from './service/autho.service';
import { ToastrModule } from 'ngx-toastr';
import { SharedModuleModule } from './shared-module/shared-module/shared-module.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { QuillModule } from 'ngx-quill';

import { DataTablesModule } from 'angular-datatables';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { DataGridConfig, EnumAutoFitMode, EnumDataGridMode, NgxUiHeroDataGridModule, NgxUiHeroModule } from 'ngx-ui-hero';


pdfMake.vfs = pdfFonts.pdfMake.vfs;

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    DefaultLayoutComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,ReactiveFormsModule,
    HttpClientModule,
    SharedModuleModule,
    NgSelectModule,
    DataTablesModule,
    QuillModule,
    BrowserAnimationsModule ,
    NgxUiHeroModule,

  ToastrModule.forRoot({
      timeOut: 1000,
      positionClass: "toast-top-right",
    }),
  ],
  providers: [ApiService,
    AuthGuard,
    AuthService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    // { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
