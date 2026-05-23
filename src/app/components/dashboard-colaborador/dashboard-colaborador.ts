import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  LucideAngularModule,
  Hospital,
  MapPin,
  Plus,
  Trash2,
  Save,
  Pencil,
  X,
} from 'lucide-angular';
import { UnidadeService } from '../../service/unidade.service';
import { ToastService } from '../../service/toast.service';

@Component({
  selector: 'app-dashboard-colaborador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './dashboard-colaborador.html',
})
export class DashboardColaborador implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private unidadeService = inject(UnidadeService);
  private toast = inject(ToastService);

  protected readonly icons = { Hospital, MapPin, Plus, Trash2, Save, Pencil, X };

  unidades = signal<any[]>([]);
  editandoId = signal<number | null>(null);

  form = this.fb.group({
    nome: ['', [Validators.required]],
    endereco: ['', [Validators.required]],
    salas: this.fb.array([]), // Array dinâmico de salas
  });

  get salas() {
    return this.form.controls.salas as FormArray;
  }

  ngOnInit() {
    this.carregarUnidades();
  }

  carregarUnidades() {
    this.unidadeService.listar().subscribe((res) => this.unidades.set(res));
  }

  adicionarSala() {
    const salaForm = this.fb.group({
      numero: ['', Validators.required],
      nome: ['', Validators.required],
      disponibilidade: ['', Validators.required],
    });
    this.salas.push(salaForm);
  }

  removerSala(index: number) {
    this.salas.removeAt(index);
  }

  prepararEdicao(unidade: any) {
    this.editandoId.set(unidade.id);
    this.form.patchValue({ nome: unidade.nome, endereco: unidade.endereco });

    this.salas.clear();
    unidade.salas.forEach((s: any) => {
      this.salas.push(
        this.fb.group({
          numero: [s.numero, Validators.required],
          nome: [s.nome, Validators.required],
          disponibilidade: [s.disponibilidade, Validators.required],
        }),
      );
    });
  }

  cancelarEdicao() {
    this.editandoId.set(null);
    this.form.reset();
    this.salas.clear();
  }

  salvar() {
    if (this.form.invalid) return;

    const id = this.editandoId();
    const acao = id
      ? this.unidadeService.atualizar(id, this.form.value)
      : this.unidadeService.criar(this.form.value);

    acao.subscribe({
      next: () => {
        this.toast.show(id ? 'Unidade atualizada!' : 'Unidade criada!', 'success');
        this.cancelarEdicao();
        this.carregarUnidades();
      },
      error: () => this.toast.show('Erro ao salvar unidade', 'error'),
    });
  }

  excluir(id: number) {
    if (confirm('Deseja excluir esta unidade?')) {
      this.unidadeService.excluir(id).subscribe(() => {
        this.toast.show('Unidade removida', 'success');
        this.carregarUnidades();
      });
    }
  }
}
