import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NewReminderComponent } from './new-reminder.component';

describe('NewReminderComponent', () => {
    let component: NewReminderComponent;
    let fixture: ComponentFixture<NewReminderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NewReminderComponent],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                HttpClientModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NewReminderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the NewReminderComponent', () => {
        expect(component).toBeTruthy();
    });

    it('should write a 30 character reminder and submit successfuly', () => {
        const str30 = '123456789012345678901234567890'; // 30 characters
        component.reminderForm.get('title').setValue(str30);
        component.reminderForm.get('date').setValue('2020-10-25');
        component.reminderForm.get('time').setValue('11:30');
        expect(component.reminderForm.valid).toBeTruthy();

        spyOn(component.submitReminder, 'emit');
        fixture.detectChanges();
        const submitButton: HTMLInputElement = fixture.debugElement.query(By.css('#btn-submit')).nativeElement;
        submitButton.click();

        expect(component.submitReminder.emit).toHaveBeenCalledTimes(1);
    });

    it('should not allow submitting reminder with more than 30 chars', () => {
        const str31 = '1234567890123456789012345678901'; // 31 characters
        component.reminderForm.get('title').setValue(str31);
        component.reminderForm.get('date').setValue('2020-10-25');
        component.reminderForm.get('time').setValue('11:30');
        expect(component.reminderForm.valid).toBeFalsy();

        spyOn(component.submitReminder, 'emit');
        fixture.detectChanges();
        const submitButton: HTMLInputElement = fixture.debugElement.query(By.css('#btn-submit')).nativeElement;
        submitButton.click();

        expect(component.submitReminder.emit).not.toHaveBeenCalled();
    });
});
