import {Component, ViewChild} from '@angular/core';
import {AlertController, LoadingController, NavParams, ViewController} from 'ionic-angular';
import { PatientCalendarEvent } from '../../../providers/patient';
import {CalendarService} from "../../../providers/calendar.service";
import {PatientAutoCompleteService} from "../../../providers/patient-autocomplete.service";
import {AutoCompleteComponent} from "ionic2-auto-complete/dist";

@Component({
  templateUrl: 'schedule-options.html'
})
export class ScheduleOptionsPage {

  modalData: {
    action: string,
    event: PatientCalendarEvent
  };

  @ViewChild('searchbar')
  searchbar: AutoCompleteComponent;

  constructor(params: NavParams,
              public viewCtrl: ViewController,
              public calendarSvc: CalendarService,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public patientAutoCompleteService: PatientAutoCompleteService) {
    this.modalData = {
      action: params.get('action'),
      event: params.get('event')
    };
    this.modalData.event.start = new Date(this.modalData.event.start).toISOString();
    this.modalData.event.end = new Date(this.modalData.event.end).toISOString();
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  async saveOrUpdate() {
    let loading = this.loadingCtrl.create();
    await loading.present();
    try {
      this.modalData.event.title = this.searchbar.getValue();
      await this.calendarSvc.saveOrUpdate(this.modalData.event).toPromise();
      await loading.dismiss();
      this.viewCtrl.dismiss(this.modalData.event);
    } catch(ex) {
      await loading.dismiss();
      this.alertCtrl.create({title: 'Oops... não foi possível completar ação.', buttons: [{ text: 'OK' }]}).present();
    }
  }


}
