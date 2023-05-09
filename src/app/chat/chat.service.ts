// chat.service.ts
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: Socket) { }

  // Отправляем сообщение на сервер
  sendMessage(msg: string) {
    this.socket.emit('message', msg);
  }

  // Получаем сообщение с сервера как Observable
  getMessage(): Observable<string> {
    return this.socket.fromEvent<string>('message');
  }
}
