// dashboard-paciente.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  LucideAngularModule,
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  Activity,
  Plus,
  RefreshCw,
  FileText,
  ChevronRight,
  History,
} from 'lucide-angular';
import { AgendamentoService } from '../../service/agendamento.service';
import { UnidadeService } from '../../service/unidade.service';
import { ToastService } from '../../service/toast.service';
import { CadastrarAgendamentoForm } from '../cadastrar-agendamento-form/cadastrar-agendamento-form';

@Component({
  selector: 'app-dashboard-paciente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, CadastrarAgendamentoForm],
  templateUrl: './dashboard-paciente.html',
})
export class DashboardPaciente implements OnInit {
  private service = inject(AgendamentoService);
  private unidadeService = inject(UnidadeService);
  private fb = inject(NonNullableFormBuilder);
  private toast = inject(ToastService);

  protected readonly icons = {
    Calendar,
    Clock,
    MapPin,
    User,
    CheckCircle,
    XCircle,
    Activity,
    Plus,
    RefreshCw,
    FileText,
    ChevronRight,
    History,
  };

  dashboardData = signal<any>(null);
  unidades = signal<any[]>([]);
  medicos = signal<any[]>([]);
  exibirModal = signal(false);

  form = this.fb.group({
    unidadeId: [null as any, Validators.required],
    salaId: [1, Validators.required], // Valor padrão para simplificar
    medicoId: [null as any, Validators.required],
    especialidade: ['', Validators.required],
    dataHoraInicio: ['', Validators.required],
    dataHoraFim: ['', Validators.required],
    tipo: ['CONSULTA', Validators.required],
  });

  ngOnInit() {
    this.carregarDados();
    this.carregarLookups();
  }

  carregarDados() {
    this.service.getDashboard().subscribe((res) => this.dashboardData.set(res));
  }

  carregarLookups() {
    this.unidadeService.listarParaSelect().subscribe((res) => this.unidades.set(res));
    this.service.listarMedicosParaSelect().subscribe((res) => this.medicos.set(res));
  }

  // Métodos para Prova de Requisito (Procedures/Functions)
  baixarHistorico() {
    const id = this.dashboardData()?.idPaciente || 1;
    this.service.getHistoricoJson(id).subscribe((res) => {
      console.log('Dados da Procedure:', res);
      this.toast.show('Histórico clínico recuperado via Procedure.', 'info');
    });
  }

  confirmar(id: number) {
    this.service.confirmar(id).subscribe(() => {
      this.toast.show('Consulta confirmada!', 'success');
      this.carregarDados();
    });
  }

  cancelar(id: number) {
    if (confirm('Deseja cancelar?')) {
      this.service.cancelar(id).subscribe(() => {
        this.toast.show('Agendamento cancelado.', 'info');
        this.carregarDados();
      });
    }
  }

  agendar() {
    if (this.form.valid) {
      this.service.criar(this.form.getRawValue()).subscribe({
        next: () => {
          this.toast.show('Agendado com sucesso!', 'success');
          this.exibirModal.set(false);
          this.carregarDados();
        },
        error: (err) => this.toast.show(err.error?.mensagem || 'Erro no agendamento.', 'error'),
      });
    }
  }
}
