import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit } from '@angular/core';
import {
  isSameDay,
  isSameMonth
} from 'date-fns';
import { Subject } from 'rxjs/Subject';
import {AlertController, ModalController} from 'ionic-angular';
import { ScheduleOptionsPage } from './schedule-options/schedule-options';
import { PatientCalendarEvent, EventAction, CalendarEventTimesChangedEvent } from '../../providers/patient';
import {CalendarService} from "../../providers/calendar.service";
export * from './schedule-options/schedule-options';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'calendar-events.html'
})
export class CalendarEventsPage implements OnInit{

  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  view: string = 'month';

  viewDate: Date = new Date();
  yearValues = new Date().getFullYear() + "," + (new Date().getFullYear() + 1);
  modalData: {
    action: string,
    event: PatientCalendarEvent
  };

  actions: EventAction[] = [{
    label: '<i class="fa fa-fw fa-pencil"></i>',
    onClick: ({event}: {event: PatientCalendarEvent}): void => {
      this.handleEvent('Edited', event);
    }
  }, {
    label: '<i class="fa fa-fw fa-times"></i>',
    onClick: ({event}: {event: PatientCalendarEvent}): void => {
      this.events = this.events.filter(iEvent => iEvent !== event);
      this.handleEvent('Deleted', event);
    }
  }];

  refresh: Subject<any> = new Subject();

  events: PatientCalendarEvent[] = [];
  searchText: string = '';
  isError: boolean = false;
  isLoading: boolean = false;
  activeDayIsOpen: boolean = true;

  constructor(private modalCtrl: ModalController,
              private calendarSvc: CalendarService,
              private alertCtrl: AlertController) {

  }

  ngOnInit() {
    this.loadEntries();
  }

  loadEntries() {
    this.isLoading = true;
    this.calendarSvc.search(this.searchText, 1, 100)
      .subscribe(data => {
        data.result.forEach(x => {
          x.start = <any>new Date(x.start);
          x.end = <any>new Date(x.end);
          x.color = colors.blue;
          x.actions = this.actions;
        });
        Object.assign(this.events, data.result);
        this.isLoading = false;
        this.refresh.next();
      }, err => {
        this.isError = true;
        this.isLoading = false;
      });
  }

  dayClicked({date, events}: {date: Date, events: PatientCalendarEvent[]}): void {

    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action?: string, event?: PatientCalendarEvent): void {
    event = event || new PatientCalendarEvent();
    action = action || 'clicked';
    this.modalData = {event, action};
    let modal = this.modalCtrl.create(ScheduleOptionsPage, this.modalData);
    modal.onDidDismiss(data => {
      if(data){
        this.loadEntries();
      }
    });
    modal.present();
  }

  async removeEvent(event: PatientCalendarEvent) {
    try {
      await this.calendarSvc.delete(event.id).toPromise();
      this.loadEntries();
    } catch(ex) {
      this.alertCtrl.create({title: 'Oops... não foi possível completar ação.', buttons: [{ text: 'OK' }]}).present();
    }
  }

}
