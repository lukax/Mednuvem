import { Component, Input, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PhoneNumber } from '../../../providers/patient';

@Component({
  selector: 'phone-numbers',
  templateUrl: 'patient-phonenumbers.html'
})
export class PatientPhoneNumberComponent implements OnInit {

  @Input() data: PhoneNumber[];

  constructor() {

  }

  ngOnInit() {
    if(this.data == null || this.data.length == 0) {
      this.add();
    }
  }

  add() {
    if(this.data == null) {
      this.data = [];
    }
    this.data.push({type: 'Contato', number: ''});
  }

}
