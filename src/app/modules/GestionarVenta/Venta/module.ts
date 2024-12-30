import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentaRoutingModule } from './routing.module';
import { VentaComponent } from './component';
import { SharedAppModule } from 'src/app/core/shared/shared.module';
import { FormComponent } from './form/form.component';


@NgModule({
  declarations: [
    VentaComponent,
    FormComponent
  ],
  imports: [
    CommonModule,
    VentaRoutingModule,
    SharedAppModule
  ]
})
export class Module { }
