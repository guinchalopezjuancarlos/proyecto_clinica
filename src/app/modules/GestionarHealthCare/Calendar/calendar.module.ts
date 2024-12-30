import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarRoutingModule } from './routing.module';
import { CalendarComponent } from './calendar.component';
import { SharedAppModule } from 'src/app/core/shared/shared.module';
import { NewReminderComponent } from './new-reminder/new-reminder.component';



@NgModule({
  declarations: [
    CalendarComponent,
    NewReminderComponent,
  ],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    SharedAppModule
  ],
  exports: [
    CalendarComponent
  ]
})
export class CalendarModule { }
