import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitaMedicaRoutingModule } from './routing.module';
import { CitaMedicaComponent } from './component';
import { SharedAppModule } from 'src/app/core/shared/shared.module';
import { FormComponent } from './form/form.component';


@NgModule({
  declarations: [
    CitaMedicaComponent,
    FormComponent
  ],
  imports: [
    CommonModule,
    CitaMedicaRoutingModule,
    SharedAppModule
  ]
})
export class Module { }
