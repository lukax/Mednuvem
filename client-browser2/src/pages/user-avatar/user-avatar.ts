import {Component, Input, OnInit, OnChanges} from "@angular/core";
import md5 from 'md5';

@Component({
  selector: 'user-avatar',
  templateUrl: 'user-avatar.html'
})
export class UserAvatarComponent implements OnInit, OnChanges {

  @Input() email: string;
  @Input() size: number = 40;

  emailHash: string;

  constructor() {

  }

  ngOnInit() {
    this.getEmailHash();
  }

  ngOnChanges() {
    this.getEmailHash();
  }

  getEmailHash() {
    if(this.email) {
      this.emailHash = md5(this.email);
    }
  }

}
