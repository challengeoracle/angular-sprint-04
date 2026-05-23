import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  // Mantendo 'text' como a propriedade principal da mensagem
  msg = signal<{ text: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  show(text: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') {
    this.msg.set({ text, type });
    setTimeout(() => this.msg.set(null), 3000);
  }
}
