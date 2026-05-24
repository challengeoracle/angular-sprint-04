import { Component, inject, OnInit, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, X, Calendar, Clock, User, MapPin } from 'lucide-angular';
import { AgendamentoService } from '../../service/agendamento.service';
import { UnidadeService } from '../../service/unidade.service';
import { ToastService } from '../../service/toast.service';

@Component({
  selector: 'app-cadastrar-agendamento-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './cadastrar-agendamento-form.html',
})
export class CadastrarAgendamentoForm implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private agendamentoService = inject(AgendamentoService);
  private unidadeService = inject(UnidadeService);
  private toast = inject(ToastService);

  fechar = output(); // Evento para avisar o pai para fechar o modal
  sucesso = output(); // Evento para avisar que salvou e precisa atualizar a lista

  unidades = signal<any[]>([]);
  medicos = signal<any[]>([]);

  // UX: Slots de horários sugeridos
  horariosDisponiveis = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
  horarioSelecionado = signal('');

  protected readonly icons = { X, Calendar, Clock, User, MapPin };

  form = this.fb.group({
    unidadeId: [null as any, Validators.required],
    medicoId: [null as any, Validators.required],
    especialidade: ['', [Validators.required, Validators.minLength(3)]],
    data: ['', Validators.required], // Campo apenas para a data
    tipo: ['CONSULTA', Validators.required],
    salaId: null,
  });

  ngOnInit() {
    this.unidadeService.listarParaSelect().subscribe((res) => this.unidades.set(res));
    this.agendamentoService.listarMedicosParaSelect().subscribe((res) => this.medicos.set(res));
  }

  selecionarHorario(h: string) {
    this.horarioSelecionado.set(h);
  }

  salvar() {
    if (this.form.invalid || !this.horarioSelecionado()) {
      this.toast.show('Preencha todos os campos e escolha um horário.', 'warning');
      return;
    }

    const raw = this.form.getRawValue();

    // Monta o ISO String esperado pela API: YYYY-MM-DDTHH:mm:ss
    const dataHoraInicio = `${raw.data}T${this.horarioSelecionado()}:00`;

    // Calcula fim (30 min depois)
    const [h, m] = this.horarioSelecionado().split(':');
    const dataFim = new Date(`${raw.data}T${h}:${m}:00`);
    dataFim.setMinutes(dataFim.getMinutes() + 30);
    const dataHoraFim = dataFim.toISOString().split('.')[0];

    const body = {
      unidadeId: raw.unidadeId,
      salaId: raw.salaId,
      medicoId: raw.medicoId,
      especialidade: raw.especialidade,
      dataHoraInicio,
      dataHoraFim,
      tipo: raw.tipo,
    };

    this.agendamentoService.criar(body).subscribe({
      next: () => {
        this.toast.show('Agendamento realizado!', 'success');
        this.sucesso.emit();
        this.fechar.emit();
      },
      error: (err) => this.toast.show(err.error?.mensagem || 'Horário indisponível.', 'error'),
    });
  }
}
