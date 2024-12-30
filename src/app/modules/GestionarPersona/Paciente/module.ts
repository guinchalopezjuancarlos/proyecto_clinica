import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacienteRoutingModule } from './routing.module';
import { PacienteComponent } from './component';
import { SharedAppModule } from 'src/app/core/shared/shared.module';
import { FormComponent } from './form/form.component';


@NgModule({
  declarations: [
    PacienteComponent,
    FormComponent
  ],
  imports: [
    CommonModule,
    PacienteRoutingModule,
    SharedAppModule
  ]
})
export class Module { }
