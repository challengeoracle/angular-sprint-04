import { Component, inject } from '@angular/core';
import { ToastService } from '../../service/toast.service';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, CheckCircle, XCircle, Info, X, AlertTriangle } from 'lucide-angular';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './toast.html',
})
export class ToastComponent {
  service = inject(ToastService);

  protected readonly icons = {
    check: CheckCircle,
    x: X,
    errorIcon: XCircle,
    info: Info,
    warning: AlertTriangle, // Novo ícone para alertas
  };
}
