import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);

  // Montamos as URLs base dinamicamente usando o environment
  private readonly ADMIN_URL = `${environment.apiUrl}/admin`;
  private readonly AGENDAMENTOS_URL = `${environment.apiUrl}/agendamentos`;

  // REQUISITO: Cadastro de Colaboradores
  cadastrarColaborador(dto: any): Observable<any> {
    return this.http.post(`${this.ADMIN_URL}/colaboradores`, dto);
  }

  // REQUISITO: Visualização de Logs
  getLogs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.ADMIN_URL}/logs`);
  }

  // PROVA SPRINT 3: Function de Conversão JSON
  getUsuarioJson(id: number): Observable<string> {
    return this.http.get(`${this.ADMIN_URL}/usuario/${id}/json`, { responseType: 'text' });
  }

  // PROVA SPRINT 3: Function de Cálculo Matemático
  getOcupacaoUnidade(unidadeId: number): Observable<number> {
    return this.http.get<number>(`${this.AGENDAMENTOS_URL}/ocupacao-unidade/${unidadeId}`);
  }

  // PROVA SPRINT 3: Procedure Histórico Paciente JSON
  getHistoricoPaciente(pacienteId: number): Observable<string> {
    return this.http.get(`${this.AGENDAMENTOS_URL}/teste-historico/${pacienteId}`, {
      responseType: 'text',
    });
  }

  // PROVA SPRINT 3: Procedure Analítica LAG/LEAD
  getRelatorioNavegacao(): Observable<string> {
    return this.http.get(`${this.AGENDAMENTOS_URL}/teste-navegacao`, { responseType: 'text' });
  }
}
