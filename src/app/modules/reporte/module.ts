import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutingModule } from './routing.module';
import { ReporteComponent } from './component';

import { SharedAppModule } from 'src/app/core/shared/shared.module';



@NgModule({
  declarations: [
    ReporteComponent

  ],
  imports: [
    CommonModule,
    RoutingModule,
    SharedAppModule,

  ]
})
export class Module { }
