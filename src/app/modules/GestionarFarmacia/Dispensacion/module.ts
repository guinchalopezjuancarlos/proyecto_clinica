import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DispensacionRoutingModule } from './routing.module';
import { DispensacionComponent } from './component';
import { SharedAppModule } from 'src/app/core/shared/shared.module';



@NgModule({
  declarations: [
    DispensacionComponent,

  ],
  imports: [
    CommonModule,
    DispensacionRoutingModule,
    SharedAppModule
  ]
})
export class Module { }
