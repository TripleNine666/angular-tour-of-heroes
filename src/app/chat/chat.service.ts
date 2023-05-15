// chat.service.ts
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import {combineLatest, Observable, of} from 'rxjs';
import {Message} from "../message";
import {Hero} from "../hero";
import { AngularFireDatabase } from "@angular/fire/compat/database";
import {join} from "@angular/compiler-cli";
import {map} from "rxjs/operators";
import {stateChanges} from "@angular/fire/database";
import {collection} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: Socket, private db: AngularFireDatabase) { }

  private messagesPath = '/messages'

  // Отправляем сообщение на сервер
  //TODO: Надо сделать обращение к DB /heroes чтобы получить hero.name и отправить на сервер, но в бд отправить ключ
  sendMessage(msg: string, heroKey: string, time: string) {
    let heroName: string;
    this.db.object<Hero>('/heroes/' + heroKey).valueChanges().subscribe(hero => {
      heroName = hero!.name;
      // emit message to the server with hero name
      const message = {
        heroName,
        message: msg,
        time,
        heroKey
      }
      this.socket.emit('message', message);
    })
    // push message to the db
    this.db.list<Message>(this.messagesPath).push({heroKey, message: msg, time})
  }

  // Получаем сообщение с сервера как Observable
  getMessage(): Observable<Message> {
    return this.socket.fromEvent<Message>('message');
  }

  getMessages(): Observable<Message[]> {
    // Получаем список сообщений из БД
    const messages = this.db.list<Message>('/messages').valueChanges();
    // Получаем список героев и ключи из БД
    const heroes = this.db.list<Hero>('/heroes').snapshotChanges();
    // Объединяем сообщения и герои с помощью оператора combineLatest
    return combineLatest([messages, heroes]).pipe(
      map(([messages, heroes]) => {
        // Для каждого сообщения находим соответствующего героя по ключу heroKey
        return messages.map(message => {
          const hero = heroes.find(hero => hero.key === message.heroKey);
          // Возвращаем новый объект с сообщением и именем героя
          return {...message, heroName: hero!.payload.val()!.name};
        });
      })
    );
  }
}
