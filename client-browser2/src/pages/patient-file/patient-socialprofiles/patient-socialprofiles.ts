import { Component, Input, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SocialProfile } from '../../../providers/patient';

@Component({
  selector: 'social-profiles',
  templateUrl: 'patient-socialprofiles.html'
})
export class PatientSocialProfileComponent implements OnInit {

  @Input() data: SocialProfile[];

  constructor() {

  }

  ngOnInit() {
    console.log('asds');
    if(this.data == null || this.data.length == 0) {
      this.add();
    }
  }

  add() {
    if(this.data == null) {
      this.data = [];
    }
    this.data.push({type: 'Facebook', description: ''});
  }

}
