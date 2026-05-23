import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UnidadeService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/unidades';

  // Retorna a listagem completa de unidades com todos os detalhes e salas
  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  // Busca apenas a lista simplificada (ID e Nome) para preencher menus select
  listarParaSelect(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/lista`);
  }

  // Realiza a persistência de uma nova unidade de saúde no banco
  criar(unidade: any): Observable<any> {
    return this.http.post(this.API_URL, unidade);
  }

  // Atualiza os dados de uma unidade existente pelo seu identificador
  atualizar(id: number, unidade: any): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, unidade);
  }

  // Remove uma unidade de saúde do sistema
  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
