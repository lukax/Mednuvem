import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { LoginService } from './login.service';
import * as Constants from './constants';
import { PatientCalendarEvent } from './patient';

@Injectable()
export class CalendarService {

	constructor(public loginService: LoginService) {

	}

	search(searchText: string, pageNumber: number, pageSize: number): Observable<PagedListResult<PatientCalendarEvent>> {
		return this.loginService.AuthGet(Constants.API_URL +  `/calendar?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${searchText}`)
			.map(this.extractData);
	}

	findOne(id: string): Observable<PatientCalendarEvent> {
		return this.loginService.AuthGet(Constants.API_URL + '/calendar/' + id)
			.map(this.extractData);
	}

	saveOrUpdate(event: PatientCalendarEvent): Observable<string> {
		if(event.id != null){
			return this.loginService.AuthPut(Constants.API_URL + '/calendar/' + event.id, event)
				.map(this.extractData);
		} else {
			return this.loginService.AuthPost(Constants.API_URL + '/calendar', event)
				.map(this.extractData);
		}
	}

	delete(id: string): Observable<void> {
		return this.loginService.AuthDelete(Constants.API_URL + '/calendar/' + id)
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

export class PagedListResult<T> {
	result: T[];
	totalCount: number;
	totalPages: number;
}
