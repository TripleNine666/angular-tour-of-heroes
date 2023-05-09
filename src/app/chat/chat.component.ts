
import { Component, OnInit } from '@angular/core';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  // Сообщения чата
  messages: string[] = [];

  // Текст текущего сообщения
  messageText: string = '';

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    // Подписываемся на получение сообщений от сервиса
    this.chatService.getMessage().subscribe((msg) => {
      this.messages.push(msg);
    });
  }

  // Отправляем сообщение по нажатию на кнопку или Enter
  sendMessage() {
    if (this.messageText) {
      this.chatService.sendMessage(this.messageText);
      this.messageText = '';
    }
  }

}

