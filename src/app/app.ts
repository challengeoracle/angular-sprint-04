import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import {
  LogOut,
  LucideAngularModule,
  User,
  Activity,
  Briefcase,
  Calendar,
  Settings,
  Hospital,
  Bot,
} from 'lucide-angular';
import { AuthService } from './service/auth.service';
import { ToastComponent } from './components/toast/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, LucideAngularModule, ToastComponent],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('medix');

  // Injeções
  protected authService = inject(AuthService);
  private router = inject(Router);

  protected readonly icons = {
    user: User,
    logout: LogOut,
    activity: Activity,
    briefcase: Briefcase,
    calendar: Calendar,
    settings: Settings,
    hospital: Hospital,
    bot: Bot,
  };

  get user() {
    return this.authService.getUser();
  }

  handleLogout() {
    this.authService.logout();
  }

  // Agora funciona pois o router está injetado
  navigateBasedOnRole() {
    const user = this.authService.getUser();

    if (!this.authService.isLoggedIn() || !user) {
      this.router.navigate(['/']);
      return;
    }

    switch (user.role) {
      case 'ADMIN':
        this.router.navigate(['/admin']);
        break;
      case 'COLABORADOR':
        this.router.navigate(['/colaborador']);
        break;
      case 'PACIENTE':
        this.router.navigate(['/paciente']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }
}
