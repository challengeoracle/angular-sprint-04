import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ChatMessage, MedixAiService } from '../../service/medix-ai.service';
import { LucideAngularModule, Bot, Send } from 'lucide-angular';

@Component({
  selector: 'app-medix-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './medix-ai-chat.html',
  styleUrls: ['./medix-ai-chat.css'],
})
export class MedixAiChat implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef<HTMLDivElement>;

  messages: ChatMessage[] = [];
  userInput = '';
  isLoading = false;

  icons = { Send, Bot };

  constructor(
    private aiService: MedixAiService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
  ) {}

  ngOnInit(): void {
    this.messages = this.aiService.getHistory();
    this.scrollToBottomAsync();
  }

  enviarMensagem(): void {
    const userMsg = this.userInput.trim();

    if (!userMsg || this.isLoading) {
      return;
    }

    this.userInput = '';
    this.isLoading = true;

    this.aiService.addUserMessage(userMsg);
    this.messages = this.aiService.getHistory();

    this.cdr.detectChanges();
    this.scrollToBottomAsync();

    this.aiService
      .sendMessage(userMsg)
      .pipe(
        finalize(() => {
          this.ngZone.run(() => {
            this.isLoading = false;
            this.messages = this.aiService.getHistory();
            this.cdr.detectChanges();
            this.scrollToBottomAsync();
          });
        }),
      )
      .subscribe({
        next: (res) => {
          this.ngZone.run(() => {
            this.aiService.addBotResponse(res.response);
            this.messages = this.aiService.getHistory();
            this.cdr.detectChanges();
            this.scrollToBottomAsync();
          });
        },
        error: (err) => {
          console.error('Erro na API Medix AI:', err);

          this.ngZone.run(() => {
            this.aiService.addBotResponse(
              'Sistema temporariamente indisponível. Tente novamente mais tarde.',
            );

            this.messages = this.aiService.getHistory();
            this.cdr.detectChanges();
            this.scrollToBottomAsync();
          });
        },
      });
  }

  limparConversa(): void {
    this.aiService.clearHistory();
    this.aiService.resetSession();

    this.messages = this.aiService.getHistory();
    this.isLoading = false;

    this.cdr.detectChanges();
    this.scrollToBottomAsync();
  }

  private scrollToBottomAsync(): void {
    setTimeout(() => {
      this.scrollToBottom();
    }, 0);
  }

  private scrollToBottom(): void {
    try {
      const el = this.myScrollContainer?.nativeElement;

      if (!el) {
        return;
      }

      el.scrollTop = el.scrollHeight;
    } catch {}
  }
}
