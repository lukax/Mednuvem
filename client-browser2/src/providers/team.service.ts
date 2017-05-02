import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { LoginService } from './login.service';
import * as Constants from './constants';
import { Team, TeamMember } from './patient';

@Injectable()
export class TeamService {

	constructor(public loginService: LoginService) {

	}

	get(): Observable<Team> {
		return this.loginService.AuthGet(Constants.API_URL +  `/teams`)
			.map(this.extractData);
	}

	addMember(member: TeamMember): Promise<void> {
		return this.loginService.AuthPost(Constants.API_URL + `/teams/member`, member)
			.map(this.extractData).toPromise();
	}

	removeMember(teamId: string, userId: string): Promise<void> {
		return this.loginService.AuthDelete(Constants.API_URL + `/teams/${teamId}/member/${userId}`)
			.map(this.extractData).toPromise();
	}

	createTeam(teamName: { name: string }): Promise<void> {
    return this.loginService.AuthPost(Constants.API_URL + `/teams`, teamName)
      .map(this.extractData).toPromise();
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
