import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import * as Constants from './constants';
import * as ClientOAuth2 from 'client-oauth2';
import * as jwt_decode from 'jwt-decode';
import md5 from 'md5';

export interface User {
  name: string;
  company: string;
  email: string;
  email_hash: string;
}

@Injectable()
export class LoginService {
  public userLoadedEvent: EventEmitter<any> = new EventEmitter<any>();

  private authHeaders: Headers;
  private auth = new ClientOAuth2(Constants.CLIENT_OAUTH2_CONFIG);
  private accessToken: string = null;

  constructor(private http: Http,
              private storage: Storage) {
  }

  login(username: string, password: string): Promise<any> {
    return this.auth.owner.getToken(username, password, { body: { client_id: Constants.CLIENT_OAUTH2_CONFIG.clientId, client_secret: Constants.CLIENT_OAUTH2_CONFIG.clientSecret } })
      .then((user) => {
        console.log("[LOGIN]");
        console.log(user);
        return this.storage.set('accessToken', user.accessToken).then(() => {
          this.accessToken = user.accessToken;
          this.userLoadedEvent.emit(this.getUser());
        });
      });
  }

  logout(): Promise<any> {
    console.log("[LOGOUT]");
    return this.storage.set('accessToken', null).then(() => {
      this.accessToken = null;
      this.userLoadedEvent.emit(this.getUser());
    });
  }

  register(user): Observable<Response> {
    let options = this._setRequestOptions();
    let body = JSON.stringify(user);
    return this.http.post(Constants.API_URL + '/account/register', body, options).catch((err) => this.handleError(err));
  }

  isLoggedIn(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if(this.accessToken == null) {
        this.storage.get('accessToken').then((token) => {
          this.accessToken = token;
          let isOk = token != null;
          resolve(isOk); 
        }).catch(err => reject(err));
      } else {
        resolve(true);
      }
    });
  }

  getUser(): User {
    if(this.accessToken == null) {
      return null;
    }
    let usr = jwt_decode(this.accessToken);
    usr.email_hash = md5(usr.email);
    return usr;
  }

  getAccessToken(): string {
    return this.accessToken;
  }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response && error.status > 0) {
      if (error.status === 401) {
        this.logout();
        return Observable.throw('Por favor, faça login novamente.');
      }
      let body = null;
      try {
        body = error.json() || '';
      } catch(ex) {
        body = { message: 'Não foi possível completar ação.' };
      }
      let msg = '';
      for(let field in body){
          if(body[field] instanceof Array){
            body[field].forEach(x => msg += x + '<br>');
          }
          else{
            msg += body[field] + '<br>';
          }
      }
      errMsg = msg;
      //const err = body.error || JSON.stringify(body);
      //errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : 'Não foi possível conectar.';
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  /**
   * Example of how you can make auth request using angulars http methods.
   * @param options if options are not supplied the default content type is application/json
   */
  AuthGet(url: string, options?: RequestOptions): Observable<Response> {
    if (options) {
      options = this._setRequestOptions(options);
    }
    else {
      options = this._setRequestOptions();
    }
    return this.http.get(url, options).catch((err) => this.handleError(err));
  }
   /**
   * @param options if options are not supplied the default content type is application/json
   */
  AuthPut(url: string, data: any, options?: RequestOptions): Observable<Response> {
    let body = JSON.stringify(data);
    if (options) {
      options = this._setRequestOptions(options);
    }
    else {
      options = this._setRequestOptions();
    }
    return this.http.put(url, body, options).catch((err) => this.handleError(err));
  }
  /**
   * @param options if options are not supplied the default content type is application/json
   */
  AuthDelete(url: string, options?: RequestOptions): Observable<Response> {
    if (options) {
      options = this._setRequestOptions(options);
    }
    else {
      options = this._setRequestOptions();
    }
    return this.http.delete(url, options).catch((err) => this.handleError(err));
  }
  /**
   * @param options if options are not supplied the default content type is application/json
   */
  AuthPost(url: string, data: any, options?: RequestOptions): Observable<Response> {
    let body = JSON.stringify(data);
    if (options) {
      options = this._setRequestOptions(options);
    }
    else {
      options = this._setRequestOptions();
    }
    return this.http.post(url, body, options).catch((err) => this.handleError(err));
  }

  private _setAuthHeaders(accessToken: string, tokenType = "Bearer") {
    this.authHeaders = new Headers();
    this.authHeaders.append('Authorization', tokenType + " " + accessToken);
    this.authHeaders.append('Content-Type', 'application/json');
  }
  private _setRequestOptions(options?: RequestOptions) {
    this._setAuthHeaders(this.accessToken);
    if (options) {
      options.headers.append(this.authHeaders.keys[0], this.authHeaders.values[0]);
    }
    else {
      options = new RequestOptions({ headers: this.authHeaders });
    }
    return options;
  }

}




