import { EventEmitter, HostListener } from '@angular/core';
import { Component, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Reminder } from '../reminder';




@Component({
  selector: 'app-new-reminder',
  templateUrl: './new-reminder.component.html',
  styleUrls: ['./new-reminder.component.scss']
})
export class NewReminderComponent implements OnInit {
  @Input() selectedReminder: Reminder = new Reminder();
  @Output() submitReminder: EventEmitter<Reminder> = new EventEmitter();
  @Output() changeVisibility: EventEmitter<boolean> = new EventEmitter();
  @Output() deleteReminder: EventEmitter<Reminder> = new EventEmitter();

  editMode = true;

  weatherForecast = null;
  reminderForm: FormGroup;
  submit = false;

  constructor() {}

  ngOnInit() {
    this.buildForm();
  }

  @HostListener('document:keydown.escape', ['$event']) 
  onEscKeyPressed(event: KeyboardEvent) {
    this.exit();
  }

  buildForm() {
    const date = moment(this.selectedReminder.fecha).format('YYYY-MM-DD');
    this.reminderForm = new FormGroup({
      horario: new FormControl(this.selectedReminder.horario, [Validators.required, Validators.maxLength(30)]),
      fecha: new FormControl(date, Validators.required),
      paciente: new FormControl(this.selectedReminder.paciente.nombre, [Validators.required, Validators.maxLength(300)]),
    });

    if (this.selectedReminder.id) {
      this.editMode = false;
      this.reminderForm.disable();
    }
  }

  enableFormEdit() {
    this.editMode = !this.editMode;
    this.reminderForm.enable();
  }

  onSubmit() {
    this.submit = true;
    if (!this.reminderForm.valid) {
      return;
    }

    const formDate = this.reminderForm.get('fecha').value;
    const formHorario = this.reminderForm.get('horario').value;

    const date = moment(formDate).toDate();

    const valuesToSubmit = new Reminder(
      date,
      formHorario
    );

    if (this.selectedReminder.id) {
      valuesToSubmit.id = this.selectedReminder.id;
    }

    this.submitReminder.emit({ ...valuesToSubmit });
  }

  fieldHasError(fieldName: string) {
    return this.submit && !this.reminderForm.get(fieldName).valid;
  }

  onDelete() {
    if (confirm('Are you sure you wish to delete this reminder?')) {
      this.deleteReminder.emit(this.selectedReminder);
    }
  }

  exit() {
    this.changeVisibility.emit(false);
  }
}
