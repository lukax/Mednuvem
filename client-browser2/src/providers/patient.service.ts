import { Injectable, Component } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { LoginService } from './login.service';
import * as Constants from './constants';

@Injectable()
export class MeetingService {

	constructor(public http: Http,
				public loginService: LoginService) {

	}

	createMeeting(meeting: any) : Observable<any> {
		return this.loginService.AuthPost(Constants.API_URL + '/Meeting/CreateMeeting', meeting)
			.map(this.extractData);
	}

	getHistory() {
		return this.loginService.AuthGet(Constants.API_URL + '/Meeting/History')
			.map(this.extractData);
	}

	private extractData(res: Response) {
		try{
	      	const body = res.json();
		    return body.data || body;
		} catch(ex) {
			return res.text();
		}
	}

}

export class Patient {
  id: string;
  name: string;
  taxIdNumber: string;
  address: string;
  email: string;
  phoneNumber: string;
  medicalInsurance: string;
  birthDate: Date;
  lastAppointment: Date;
  accountablePerson: string;
  notes: string;
  observations: string;
  medicalReceipt: string;
}
