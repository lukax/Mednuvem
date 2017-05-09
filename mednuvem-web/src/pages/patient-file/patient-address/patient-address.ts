import { Component, Input, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Address } from '../../../providers/patient';

@Component({
  selector: 'patient-address',
  templateUrl: 'patient-address.html'
})
export class PatientAddressComponent implements OnInit {

  @Input() data: Address;

  constructor() {

  }

  ngOnInit() {
    if(this.data == null) {
      this.add();
    }
  }

  add() {
    if(this.data == null) {
      this.data = new Address();
    }
  }

}
