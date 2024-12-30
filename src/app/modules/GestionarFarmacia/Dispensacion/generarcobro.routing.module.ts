import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerarCobroComponent } from './generarcobro.component';

const routes: Routes = [{ path: '', component: GenerarCobroComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerarCobroRoutingModule { }
