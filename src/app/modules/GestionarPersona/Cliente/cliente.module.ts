import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteRoutingModule } from './cliente-routing.module';
import { ClienteComponent } from './cliente.component';
import { SharedAppModule } from 'src/app/core/shared/shared.module';
import { ClienteFormComponent } from './cliente-form/cliente-form.component';


@NgModule({
  declarations: [
    ClienteComponent,
    ClienteFormComponent
  ],
  imports: [
    CommonModule,
    ClienteRoutingModule,
    SharedAppModule
  ]
})
export class ClienteModule { }
