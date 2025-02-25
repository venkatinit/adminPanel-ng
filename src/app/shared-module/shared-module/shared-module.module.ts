import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberDirective } from '../numbers-only.directive';
import { SaveButtonComponent } from '../save-button/save-button.component';
import { DataTablesModule } from 'angular-datatables';



@NgModule({
  declarations:[SaveButtonComponent,NumberDirective],
  imports: [
    CommonModule,
    DataTablesModule

  ],
  exports:[SaveButtonComponent,NumberDirective,DataTablesModule]

})
export class SharedModuleModule { }
