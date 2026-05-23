import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  History,
  FilePieChart,
  Database,
  Search,
  Activity,
  Download,
  ShieldAlert,
  CheckCircle,
  Clock,
  Filter,
  FileJson,
  LayoutList,
  Info,
  Terminal,
} from 'lucide-angular';
import { AdminService } from '../../service/admin.service';
import { ToastService } from '../../service/toast.service';
import { CadastrarColaboradorForm } from '../cadastrar-colaborador-form/cadastrar-colaborador-form';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, CadastrarColaboradorForm, FormsModule],
  templateUrl: './dashboard-admin.html',
})
export class DashboardAdmin implements OnInit {
  private adminService = inject(AdminService);
  private toast = inject(ToastService);

  protected readonly icons = {
    History,
    FilePieChart,
    Database,
    Search,
    Activity,
    Download,
    ShieldAlert,
    CheckCircle,
    Clock,
    Filter,
    FileJson,
    LayoutList,
    Info,
    Terminal,
  };

  logs = signal<any[]>([]);
  filtro = signal('');

  // Sinais para capturar os retornos do Oracle
  ocupacaoUnidade = signal<number | null>(null);
  resultadoJson = signal<any>(null);
  relatorioAnalitico = signal<string | null>(null);
  historicoPaciente = signal<any>(null);

  logsFiltrados = computed(() => {
    const termo = this.filtro().toLowerCase();
    return this.logs().filter(
      (log) =>
        log.tabelaNome?.toLowerCase().includes(termo) ||
        log.operacao?.toLowerCase().includes(termo) ||
        (log.dadosNovos && log.dadosNovos.toLowerCase().includes(termo)),
    );
  });

  unidades = signal([
    { id: 1, nome: 'Unidade Central - SP' },
    { id: 2, nome: 'Unidade Paulista' },
  ]);

  usuarios = signal([
    { id: 1, nome: 'Admin (Admin)' },
    { id: 11, nome: 'Joao Silva (Paciente)' },
  ]);

  ngOnInit() {
    this.carregarLogs();
  }

  carregarLogs() {
    this.adminService.getLogs().subscribe({
      next: (data) => this.logs.set(data),
      error: () => this.toast.show('Erro ao sincronizar auditoria', 'error'),
    });
  }

  consultarOcupacao(unidadeId: string) {
    if (!unidadeId) return;
    this.adminService.getOcupacaoUnidade(Number(unidadeId)).subscribe((res) => {
      this.ocupacaoUnidade.set(res);
      this.toast.show('Cálculo da Function 2 recebido!', 'info');
    });
  }

  testarConversaoJson(id: string) {
    if (!id) return;
    this.adminService.getUsuarioJson(Number(id)).subscribe((res) => {
      try {
        this.resultadoJson.set(typeof res === 'string' ? JSON.parse(res) : res);
      } catch {
        this.resultadoJson.set(res);
      }
      this.toast.show('JSON da Function 1 gerado!', 'success');
    });
  }

  testarRelatorioAnalitico() {
    this.adminService.getRelatorioNavegacao().subscribe((res) => {
      this.relatorioAnalitico.set(res);
      this.toast.show('LAG/LEAD da Procedure 2 executado!', 'info');
    });
  }

  testarHistorico(id: string) {
    if (!id) return;
    this.adminService.getHistoricoPaciente(Number(id)).subscribe((res) => {
      try {
        this.historicoPaciente.set(typeof res === 'string' ? JSON.parse(res) : res);
      } catch {
        this.historicoPaciente.set(res);
      }
      this.toast.show('Procedure 1: Histórico carregado!', 'success');
    });
  }
}
