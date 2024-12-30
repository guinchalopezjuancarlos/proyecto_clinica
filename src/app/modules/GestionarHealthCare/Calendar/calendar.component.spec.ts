import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarComponent } from './calendar.component';
import { NewReminderComponent } from './new-reminder/new-reminder.component';

describe('CalendarComponent', () => {
    let component: CalendarComponent;
    let fixture: ComponentFixture<CalendarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                CalendarComponent,
                NewReminderComponent
            ],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                HttpClientModule,
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CalendarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have built the calendar array of days on init', () => {
        expect(component.month.length).toBeGreaterThan(0);
    });

    it('should change visibility of modal of new reminder', () => {
        const compiled = fixture.debugElement.nativeElement;
        let newReminderComponent = compiled.querySelector('app-new-reminder');
        expect(newReminderComponent).toBeNull();
        component.openModalNewReminder();
        fixture.detectChanges();
        newReminderComponent = compiled.querySelector('app-new-reminder');
        expect(component.reminderModalVisible).toBeTruthy();
        expect(newReminderComponent).toBeDefined();
    });
});
