import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, UserPlus } from 'lucide-angular';
import { AdminService } from '../../service/admin.service';
import { ToastService } from '../../service/toast.service';

@Component({
  selector: 'app-cadastrar-colaborador-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './cadastrar-colaborador-form.html',
})
export class CadastrarColaboradorForm {
  private fb = inject(NonNullableFormBuilder);
  private adminService = inject(AdminService);
  private toast = inject(ToastService);

  colaboradorSalvo = output<void>();

  protected readonly icons = { UserPlus };

  formColaborador = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    // Validação estrita para exatamente 11 números
    cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    tipoColaborador: ['OPERACIONAL', [Validators.required]],
  });

  // Remove qualquer caractere que não seja número enquanto o usuário digita
  limparCpf() {
    const valorOriginal = this.formColaborador.controls.cpf.value;
    const apenasNumeros = valorOriginal.replace(/\D/g, '');

    // Atualiza o formulário apenas com os números (limite de 11 via HTML)
    this.formColaborador.controls.cpf.setValue(apenasNumeros, { emitEvent: false });
  }

  cadastrar() {
    if (this.formColaborador.valid) {
      // Envia os dados limpos para a API
      const payload = this.formColaborador.getRawValue();

      this.adminService.cadastrarColaborador(payload).subscribe({
        next: () => {
          this.toast.show('Colaborador registrado!', 'success');
          this.formColaborador.reset({ tipoColaborador: 'OPERACIONAL' });
          this.colaboradorSalvo.emit();
        },
        error: (err) => {
          const msg = err.error?.mensagem || 'Erro: CPF duplicado ou dados inválidos';
          this.toast.show(msg, 'error');
        },
      });
    }
  }
}
