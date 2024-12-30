import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorRoutingModule } from './routing.module';
import { DoctorComponent } from './component';
import { SharedAppModule } from 'src/app/core/shared/shared.module';
import { FormComponent } from './form/form.component';


@NgModule({
  declarations: [
    DoctorComponent,
    FormComponent
  ],
  imports: [
    CommonModule,
    DoctorRoutingModule,
    SharedAppModule
  ]
})
export class Module { }
