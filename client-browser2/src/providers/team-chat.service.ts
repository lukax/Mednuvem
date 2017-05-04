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
  connection: Connection;

  chatMessageSubject = new Subject<TeamChatMessage>();

  constructor() {
    this.connection = new Connection(Constants.SERVER_URL_WS, true);

    this.connection.clientMethods["receiveMessage"] = (socketId, message) => {
      this.chatMessageSubject.next({ message: message });
    };
  }

  subscribeToChat(): Observable<TeamChatMessage> {
    return this.chatMessageSubject.asObservable();
  }

}
