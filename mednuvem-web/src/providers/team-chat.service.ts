import {Injectable, OnDestroy} from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { LoginService } from './login.service';
import * as Constants from './constants';
import {TeamChatMessage, TeamMember} from './patient';
import {Connection} from "../websocket-manager/Connection";
import {Subject} from "rxjs/Subject";
import Timer = NodeJS.Timer;

@Injectable()
export class TeamChatService implements OnDestroy {
  private _chatMessageSubject: Subject<TeamChatMessage> = new Subject<TeamChatMessage>();
  private _refreshSubject: Subject<any> = new Subject<any>();
  private _connection: Connection;
  private _isConnected: boolean = false;
  private _connectionRetryTimeout: Timer;

  constructor(public loginService: LoginService) {
    this.setupConnection();
    this.retryConnection();
  }

  ngOnDestroy() {
    clearTimeout(this._connectionRetryTimeout);
  }

  getChatObservable(): Observable<TeamChatMessage> {
    return this._chatMessageSubject.asObservable();
  }

  getRefreshObservable(): Observable<any> {
    return this._refreshSubject.asObservable();
  }

  sendMessage(message: string) {
    if(!this.isConnected) return;
    this._connection.invoke("SendMessage", this._connection.connectionId, message);
  }

  isConnected() {
    return this._isConnected;
  }

  private retryConnection() {
    this._connectionRetryTimeout = setTimeout(() => {
      this.setupConnection();
      this.retryConnection();
    }, 5000);
  }

  private async setupConnection() {
    let isLoggedIn = await this.loginService.isLoggedIn();
    if(!isLoggedIn) return;

    if(this._isConnected) return; this._isConnected = true;

    this._connection = new Connection(Constants.SERVER_URL_WS + '/chat?access_token=' + this.loginService.getAccessToken(), false);
    this._connection.clientMethods["receiveMessage"] = (socketId, teamChatMessage: TeamChatMessage) => {
      this._chatMessageSubject.next(teamChatMessage);
    };
    this._connection.clientMethods["refresh"] = (socketId) => {
      this._refreshSubject.next();
    };
    this._connection.connectionMethods.onConnected = () => {
      console.log("[TeamChatService]: Connection ID: " + this._connection.connectionId);
    };
    this._connection.connectionMethods.onDisconnected = () => {
      this._isConnected = false;
      console.log("[TeamChatService]: Disconnected");
    };

    this.loginService.userLoadedEvent.subscribe(() => { // if there's any change in user, close connection
      this._connection.close();
    });
    this._connection.start();
  }

}
