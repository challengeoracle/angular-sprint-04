import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export interface ChatResponse {
  response: string;
}

@Injectable({
  providedIn: 'root',
})
export class MedixAiService {
  private readonly apiUrl = 'https://sprint-04-java.onrender.com/api/chat/ask';
  private readonly storageKey = 'medix-ai-chat-history';

  private history: ChatMessage[] = this.loadHistory();

  constructor(private http: HttpClient) {}

  getHistory(): ChatMessage[] {
    return this.history;
  }

  sendMessage(message: string): Observable<ChatResponse> {
    const userMessage: ChatMessage = {
      sender: 'user',
      text: message,
      timestamp: new Date(),
    };

    this.history.push(userMessage);
    this.saveHistory();

    return this.http.post<ChatResponse>(this.apiUrl, { message }).pipe(
      tap((res) => {
        this.addBotResponse(res.response);
      }),
    );
  }

  addBotResponse(response: string): void {
    this.history.push({
      sender: 'bot',
      text: response,
      timestamp: new Date(),
    });

    this.saveHistory();
  }

  clearHistory(): void {
    this.history = [];
    localStorage.removeItem(this.storageKey);
  }

  private saveHistory(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.history));
  }

  private loadHistory(): ChatMessage[] {
    const stored = localStorage.getItem(this.storageKey);

    if (!stored) {
      return [
        {
          sender: 'bot',
          text: 'Olá! Eu sou a Medix AI. Como posso ajudar você hoje?',
          timestamp: new Date(),
        },
      ];
    }

    try {
      const parsed = JSON.parse(stored) as ChatMessage[];

      return parsed.map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    } catch {
      return [
        {
          sender: 'bot',
          text: 'Olá! Eu sou a Medix AI. Como posso ajudar você hoje?',
          timestamp: new Date(),
        },
      ];
    }
  }
}
