import { Day } from './day';
import { Component, OnInit } from '@angular/core';
import { Reminder } from './reminder';
import * as moment from 'moment';
import { BackendService } from 'src/services/backend.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  month: Day[];
  calendarView = new Date();
  selectedReminder: Reminder;
  today = new Date(2020, 9, 31);
  reminders: Reminder[] = [];
  reminderModalVisible = false;
  successMessage = '';
  allCitasMedicas:any = [];
  constructor(
    private backendService: BackendService,
    ) {

  }
  ngOnInit() {
    this.loadData();

  }
  loadData(): void {
    this.backendService.getCitasMedicas().subscribe({
      next: (data) => {
        this.allCitasMedicas = data.map((citamedica: any) => ({
          ...citamedica,
          id: citamedica.id.toString()
        }));
        console.log(this.allCitasMedicas);
        this.buildCalendarDays();
      },
      error: (error) => {
        console.error('Error al obtener usuarios', error);
      }
    });
  }
  buildCalendarDays() {
    this.month = [];
    const lastDayToAdd = this.getDayToAddOnCalendar();
    let currentDayToAdd = this.getFirstDayToAddOnCalendar();

    do {
      const currentDayReminders = this.allCitasMedicas.filter(r => this.compareDates(r.fecha, currentDayToAdd));
      this.month.push(new Day(currentDayToAdd, currentDayReminders));
      currentDayToAdd = moment(currentDayToAdd).add(1, 'day').toDate();
    } while (currentDayToAdd.toISOString() !== lastDayToAdd.toISOString());
  }

  getFirstDayToAddOnCalendar() {
    const firstDayToAdd = moment(this.calendarView).startOf('month').toDate();
    let dayToAddOnCalendar = firstDayToAdd;
    if (firstDayToAdd.getDay() > 0) {
      dayToAddOnCalendar = moment(firstDayToAdd).subtract(firstDayToAdd.getDay(), 'days').toDate();
    }
    return dayToAddOnCalendar;
  }

  getDayToAddOnCalendar() {
    const nextMonth = moment(this.calendarView).add(1, 'month');
    let lastDayToAdd = moment(nextMonth).startOf('month').toDate();
    if (lastDayToAdd.getDay() > 0) {
      lastDayToAdd = moment(lastDayToAdd).add(7 - lastDayToAdd.getDay(), 'days').toDate();
    }
    return lastDayToAdd;
  }

  compareDates(dateA: Date, dateB: Date): boolean {
    return moment(dateA).format('L') === moment(dateB).format('L');
  }

  showOtherMonth(type: 'previous' | 'next') {
    this.successMessage = '';
    const firstDay = moment(this.calendarView).startOf('month').toDate();
    this.calendarView = moment(firstDay).add(1, 'month').toDate();
    if (type === 'previous') {
      this.calendarView = moment(firstDay).subtract(1, 'month').toDate();
    }
    this.buildCalendarDays();
  }

  openModalNewReminder(day: Day = new Day()) {
    this.successMessage = '';
    this.selectedReminder = new Reminder(day.date);
    this.reminderModalVisible = true;
  }

  openModalReminderDetails(reminder: Reminder) {
    console.log("cita medica: "+ reminder.paciente.nombre);
    this.successMessage = '';
    this.selectedReminder = reminder;
    this.reminderModalVisible = true;
  }

  onReminderModalSubmit(newReminder: Reminder) {
    this.reminderModalVisible = false;
    this.addOrEditReminder(newReminder);
  }

  addOrEditReminder(reminder: Reminder) {
    this.reminders = this.updatedRemindersList(reminder, this.reminders);
    localStorage.setItem('reminders', JSON.stringify(this.reminders));
    const dayIndex = this.month.findIndex((day: Day) => this.compareDates(day.date, reminder.fecha));
    this.month[dayIndex].reminders = this.updatedRemindersList(reminder, this.month[dayIndex].reminders);
    this.successMessage = `Reminder ${this.selectedReminder.id ? 'updated' : 'added'} successfully.`;
  }

  updatedRemindersList(reminder: Reminder, reminders: Reminder[]): Reminder[] {
    let indexToUpdate = reminders.findIndex((rem) => rem.id === reminder.id);
    if (indexToUpdate >= 0) {
      reminders[indexToUpdate] = reminder;
      return reminders;
    }

    indexToUpdate = 0;
    reminders.forEach((rem, index) => {
      if (moment(reminder.fecha).isSameOrAfter(rem.fecha)) {
        indexToUpdate = index + 1;
      }
    });
    reminders.splice(indexToUpdate, 0, reminder);
    return reminders;
  }

  onChangeReminderVisibility(newValue) {
    this.reminderModalVisible = newValue;
  }

  onReminderDelete(reminder: Reminder) {
    this.reminderModalVisible = false;
    const indexToDelete = this.reminders.findIndex((rem) => rem.id === reminder.id);
    if (indexToDelete >= 0) {
      this.reminders.splice(indexToDelete, 1);
      localStorage.setItem('reminders', JSON.stringify(this.reminders));
    }
    const dayIndex = this.month.findIndex((day: Day) => this.compareDates(day.date, reminder.fecha));
    const dayReminderIndex = this.month[dayIndex].reminders.findIndex((rem) => rem.id === reminder.id);
    if (indexToDelete >= 0) {
      this.month[dayIndex].reminders.splice(dayReminderIndex, 1);
    }
    this.successMessage = 'Reminder deleted successfully.';
  }

  isWeekend(value) {
    return new Date(value).getDay() === 0 || new Date(value).getDay() === 6;
  }

  isDayFromOtherMonth(value) {
    return new Date(value).getMonth() !== this.calendarView.getMonth();
  }
}
