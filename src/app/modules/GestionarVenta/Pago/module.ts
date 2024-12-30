import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagoRoutingModule } from './routing.module';
import { PagoComponent } from './component';
import { SharedAppModule } from 'src/app/core/shared/shared.module';
import { FormComponent } from './form/form.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PagoComponent,
    FormComponent
  ],
  imports: [
    CommonModule,
    PagoRoutingModule,
    SharedAppModule,
    ReactiveFormsModule,
    
  ]
})
export class Module { }
