import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
// Importe o serviço do chatbot (ajuste o caminho se necessário)
import { MedixAiService } from './medix-ai.service';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  // Injeta o serviço da IA para controlar o ciclo de vida do chat
  private aiService = inject(MedixAiService);

  // URL base conforme seu ambiente local
  private readonly API_URL = 'http://localhost:8080/auth';

  isLoggedIn = signal<boolean>(!!localStorage.getItem('token'));

  /**
   * Realiza o login e redireciona o usuário para o dashboard específico
   * baseado na ROLE contida no token decodificado.
   */
  login(credentials: any) {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        this.isLoggedIn.set(true);

        // Decodifica para saber para onde enviar o usuário
        const user = this.getUser();

        if (user?.role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else if (user?.role === 'COLABORADOR') {
          this.router.navigate(['/colaborador']);
        } else {
          this.router.navigate(['/paciente']);
        }
      }),
    );
  }

  /**
   * Método que faltava: Decodifica o JWT para recuperar os dados do usuário.
   * O seu Java envia 'sub' (email) e 'role' no payload.
   */
  getUser(): any {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      // Decodifica o payload do JWT
      const decoded: any = jwtDecode(token);
      return {
        email: decoded.sub,
        role: decoded.role, // 'ADMIN', 'COLABORADOR' ou 'PACIENTE'
      };
    } catch (error) {
      this.logout(); // Se o token for inválido, limpa tudo
      return null;
    }
  }

  /**
   * Registro de novos usuários (Pacientes)
   */
  signup(user: any): Observable<any> {
    return this.http.post(`${this.API_URL}/login/register`, user);
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn.set(false);

    // Limpa a memória da conversa da Medix AI para não vazar contexto entre contas
    this.aiService.clearHistory();

    this.router.navigate(['/login']);
  }
}
