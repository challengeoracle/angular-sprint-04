import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatMessage, MedixAiService } from '../../service/medix-ai.service';
// Importação correta do módulo e dos ícones
import { LucideAngularModule, Bot, Send } from 'lucide-angular';

@Component({
  selector: 'app-medix-ai-chat',
  standalone: true,
  // O LucideAngularModule deve estar aqui para o ngtsc reconhecer <lucide-icon>
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './medix-ai-chat.html',
  styleUrls: ['./medix-ai-chat.css'],
})
export class MedixAiChat implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  messages: ChatMessage[] = [];
  userInput: string = '';
  isLoading: boolean = false;

  // Definição dos ícones para uso no template
  icons = { Send, Bot };

  constructor(private aiService: MedixAiService) {}

  ngOnInit(): void {
    this.messages = this.aiService.getHistory();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  enviarMensagem(): void {
    if (!this.userInput.trim() || this.isLoading) return;

    const userMsg = this.userInput.trim();
    this.userInput = '';
    this.isLoading = true;

    this.aiService.sendMessage(userMsg).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro na API Medix AI:', err);
        this.aiService.addBotResponse(
          'Sistema temporariamente indisponível. Tente novamente mais tarde.',
        );
        this.isLoading = false;
      },
    });
  }
}
