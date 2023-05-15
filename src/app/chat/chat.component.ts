import {Component, Input, OnInit} from '@angular/core';
import { ChatService } from './chat.service';
import { Message } from "../message";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @Input() heroKey!: string ;

  // Сообщения чата
  messages: Message[] = [];

  // Текст текущего сообщения
  messageText: string = '';

  constructor(private chatService: ChatService) {


  }

  ngOnInit(): void {

    let sub = this.chatService.getMessages().subscribe(messages => {
      this.messages = messages.map(msg => {
        return {...msg, mine: this.heroKey === msg.heroKey}
      })
      sub.unsubscribe()
    })

    // Подписываемся на получение сообщений от сервиса
    this.chatService.getMessage().subscribe((msg) => {
      if(msg.heroKey === this.heroKey){
        this.messages.push({message: msg.message, heroKey: msg.heroKey, heroName: msg.heroName, mine: true, time: msg.time});
      } else {
        this.messages.push({message: msg.message, heroKey: msg.heroKey, heroName: msg.heroName, mine: false, time: msg.time});
      }
    });

  }

  // Отправляем сообщение по нажатию на кнопку или Enter
  sendMessage() {
    if (this.messageText) {
      const time = new Date().toLocaleTimeString()
      this.chatService.sendMessage(this.messageText, this.heroKey, time);
      this.messageText = '';
  }
  }
}

