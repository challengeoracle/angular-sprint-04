import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AgendamentoService {
  private http = inject(HttpClient);
  private readonly API_URL = 'https://sprint-04-java.onrender.com/agendamentos';

  // Carrega os dados estatísticos e listas para o Dashboard do Paciente
  getDashboard(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/dashboard`);
  }

  // Realiza a chamada para persistir um novo agendamento no banco
  criar(agendamento: any): Observable<any> {
    return this.http.post(this.API_URL, agendamento);
  }

  // Altera o status para CONFIRMADO (utilizado para reativar consultas)
  confirmar(id: number): Observable<void> {
    return this.http.patch<void>(`${this.API_URL}/${id}/confirmar`, {});
  }

  // Altera o status para CANCELADO no banco via PATCH
  cancelar(id: number): Observable<void> {
    return this.http.patch<void>(`${this.API_URL}/${id}/cancelar`, {});
  }

  // --- NOVOS MÉTODOS PARA INTEGRAÇÃO BACKEND X FRONTEND ---

  // Busca a lista simplificada de médicos para o menu <select> do agendamento
  listarMedicosParaSelect(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/medicos`);
  }

  // PROVA DO REQUISITO: Chama a Function Oracle para calcular tempo de ocupação
  getOcupacaoUnidade(unidadeId: number): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/ocupacao-unidade/${unidadeId}`);
  }

  // PROVA DO REQUISITO: Chama a Procedure que gera o histórico em JSON (CLOB)
  getHistoricoJson(pacienteId: number): Observable<string> {
    // Retorna como texto pois o banco devolve uma String formatada
    return this.http.get(`${this.API_URL}/teste-historico/${pacienteId}`, { responseType: 'text' });
  }

  // PROVA DO REQUISITO: Chama a Procedure analítica (LAG/LEAD)
  getRelatorioNavegacao(): Observable<string> {
    return this.http.get(`${this.API_URL}/teste-navegacao`, { responseType: 'text' });
  }
}
