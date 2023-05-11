import {Component, Input, OnInit} from '@angular/core';
import { ChatService } from './chat.service';
import { Message } from "../message";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @Input() heroName!: string ;

  // Сообщения чата
  messages: Message[] = [];

  // Текст текущего сообщения
  messageText: string = '';

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    if(!this.heroName) {
      this.heroName = 'null'
    }
    // Подписываемся на получение сообщений от сервиса
    this.chatService.getMessage().subscribe((msg) => {
      if(msg.heroName !== this.heroName){
        this.messages.push({message: msg.message, heroName: msg.heroName, mine: false, time: msg.time});
      }
    });
  }

  // Отправляем сообщение по нажатию на кнопку или Enter
  sendMessage() {
    if (this.messageText) {
      this.chatService.sendMessage(this.messageText, this.heroName);
      this.messages.push({message: this.messageText, heroName: this.heroName, mine: true, time: new Date().toLocaleTimeString()});
      this.messageText = '';
    }
  }

}

