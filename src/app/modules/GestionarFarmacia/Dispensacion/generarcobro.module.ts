import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenerarCobroRoutingModule } from './generarcobro.routing.module';
import { GenerarCobroComponent } from './generarcobro.component';
import { SharedAppModule } from 'src/app/core/shared/shared.module';



@NgModule({
  declarations: [
    GenerarCobroComponent,

  ],
  imports: [
    CommonModule,
    GenerarCobroRoutingModule,
    SharedAppModule
  ]
})
export class GenerarCobroModule { }
