import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';

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
  private readonly apiUrl = `${environment.apiUrl}/api/chat/ask`;

  private readonly historyKey = 'medix-ai-chat-history';
  private readonly sessionKey = 'medix-ai-session-id';

  private history: ChatMessage[] = this.loadHistory();

  constructor(private http: HttpClient) {}

  getHistory(): ChatMessage[] {
    return this.history;
  }

  sendMessage(message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.apiUrl, {
      sessionId: this.getSessionId(),
      message,
    });
  }

  addUserMessage(message: string): void {
    this.history.push({
      sender: 'user',
      text: message,
      timestamp: new Date(),
    });

    this.saveHistory();
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
    this.history = [
      {
        sender: 'bot',
        text: 'Olá! Eu sou a Medix AI. Como posso ajudar você hoje?',
        timestamp: new Date(),
      },
    ];

    this.saveHistory();
  }

  resetSession(): void {
    localStorage.removeItem(this.sessionKey);
  }

  private getSessionId(): string {
    let sessionId = localStorage.getItem(this.sessionKey);

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem(this.sessionKey, sessionId);
    }

    return sessionId;
  }

  private saveHistory(): void {
    localStorage.setItem(this.historyKey, JSON.stringify(this.history));
  }

  private loadHistory(): ChatMessage[] {
    const stored = localStorage.getItem(this.historyKey);

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
