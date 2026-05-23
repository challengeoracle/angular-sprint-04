import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, LogIn } from 'lucide-angular';
import { AuthService } from '../../service/auth.service';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../service/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, LucideAngularModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  protected readonly icons = { LogIn };

  // Atualizado para bater com o JSON do seu Postman: email e senha
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.form.valid) {
      // O objeto enviado será exatamente { email: '...', senha: '...' }
      this.authService.login(this.form.value).subscribe({
        next: () => {
          this.toast.show('Bem-vindo ao Medix!', 'success');
        },
        error: () => {
          this.toast.show('E-mail ou senha incorretos', 'error');
        },
      });
    }
  }
}
