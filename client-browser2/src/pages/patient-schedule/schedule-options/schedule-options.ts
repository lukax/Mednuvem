import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { CalendarEvent } from 'angular-calendar';

@Component({
  templateUrl: 'schedule-options.html'
})
export class ScheduleOptionsPage {

  modalData: {
    action: string,
    event: CalendarEvent
  };

  constructor(params: NavParams,
              public viewCtrl: ViewController) {
    this.modalData = {
      action: params.get('action'),
      event: params.get('event')
    };
  }

  dismiss() {
    let data = { 'foo': 'bar' };
    this.viewCtrl.dismiss(data);
  }
}
