import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecetaRoutingModule } from './routing.module';
import { RecetaComponent } from './component';
import { SharedAppModule } from 'src/app/core/shared/shared.module';
import { FormComponent } from './form/form.component';


@NgModule({
  declarations: [
    RecetaComponent,
    FormComponent
  ],
  imports: [
    CommonModule,
    RecetaRoutingModule,
    SharedAppModule
  ]
})
export class Module { }
