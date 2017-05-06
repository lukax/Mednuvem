import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { LoginService } from './login.service';
import * as Constants from './constants';
import {TeamChatMessage} from './patient';
import {Connection} from "../websocket-manager/Connection";
import {Subject} from "rxjs/Subject";

@Injectable()
export class TeamChatService {
  private connection: Connection;
  private chatMessageSubject = new Subject<TeamChatMessage>();

  constructor(public loginService: LoginService) {
    this.loginService.isLoggedIn().then(() => {
      this.setup();
    });
  }

  getChatObservable(): Observable<TeamChatMessage> {
    return this.chatMessageSubject.asObservable();
  }

  sendMessage(message: string) {
    this.connection.invoke("SendMessage", this.connection.connectionId, message);
  }

  connectChat() {
    this.connection.start();
  }

  private setup() {
    this.connection = new Connection(Constants.SERVER_URL_WS + '/chat?access_token=' + this.loginService.getAccessToken(), true);
    this.connection.clientMethods["receiveMessage"] = (socketId, teamChatMessage: TeamChatMessage) => {
      this.chatMessageSubject.next(teamChatMessage);
    };
    this.connection.connectionMethods.onConnected = () => {
      console.log("You are now connected! Connection ID: " + this.connection.connectionId);
    };
    this.connection.connectionMethods.onDisconnected = () => {
      this.chatMessageSubject.error("Desconectado.");
      console.log("Disconnected!");
      this.loginService.isLoggedIn().then(() => {
        setTimeout(() => {
          this.connection.start();
        }, 5000);
      });
    };

    this.loginService.userLoadedEvent.subscribe(() => {
      this.connection.start();
    });
  }

}
