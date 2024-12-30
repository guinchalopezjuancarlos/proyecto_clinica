import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicamentoRoutingModule } from './routing.module';
import { MedicamentoComponent } from './component';
import { SharedAppModule } from 'src/app/core/shared/shared.module';
import { FormComponent } from './form/form.component';


@NgModule({
  declarations: [
    MedicamentoComponent,
    FormComponent
  ],
  imports: [
    CommonModule,
    MedicamentoRoutingModule,
    SharedAppModule
  ]
})
export class Module { }
