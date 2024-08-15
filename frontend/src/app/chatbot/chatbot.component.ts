import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  question: string = '';
  messages: { text: string, type: string }[] = [];
  isOpen: boolean = false;

  constructor(private http: HttpClient) {}

  generateAnswer() {
    if (!this.question.trim()) return;

    const userMessage = { text: this.question, type: 'user' };
    this.messages.push(userMessage);
    this.question = '';

    const requestData = {
      contents: [{ parts: [{ text: `${userMessage.text} in single string chat without comments` }] }]
    };

    this.http.post<any>(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBYOhBkzDl6qp2KhM7kRgEtgMVWLKzcCfY',
      requestData
    ).subscribe({
      next: response => {
        const botMessage = {
          text: response.candidates[0].content.parts[0].text,
          type: 'bot'
        };
        this.messages.push(botMessage);
      },
      error: error => {
        console.error('Error generating answer:', error);
      }
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }
}
