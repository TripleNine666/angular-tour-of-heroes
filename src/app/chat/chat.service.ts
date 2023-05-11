// chat.service.ts
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import {Message} from "../message";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: Socket) { }

  // Отправляем сообщение на сервер
  sendMessage(msg: string, heroName: string) {
    const message = {
      heroName,
      message: msg
    }
    this.socket.emit('message', message);
  }

  // Получаем сообщение с сервера как Observable
  getMessage(): Observable<Message> {
    return this.socket.fromEvent<Message>('message');
  }
}
