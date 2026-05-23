import { Welcome } from './components/welcome/welcome';
import { Login } from './components/login/login';
import { DashboardAdmin } from './components/dashboard-admin/dashboard-admin';
import { Routes } from '@angular/router';

import { authGuard } from './auth-guard';
import { roleGuard } from './role-guard';
import { DashboardColaborador } from './components/dashboard-colaborador/dashboard-colaborador';
import { DashboardPaciente } from './components/dashboard-paciente/dashboard-paciente';
import { MedixAiChat } from './components/medix-ai-chat/medix-ai-chat';

export const routes: Routes = [
  {
    path: '',
    component: Welcome,
    title: 'MEDIX - Bem vindo',
  },
  {
    path: 'login',
    component: Login,
    title: 'MEDIX - Login',
  },
  {
    path: 'admin',
    component: DashboardAdmin,
    canActivate: [authGuard, roleGuard],
    title: 'MEDIX - Admin',
    data: { role: 'ADMIN' }, // Apenas ADMIN entra aqui
  },
  {
    path: 'colaborador',
    component: DashboardColaborador,
    canActivate: [authGuard, roleGuard],
    title: 'MEDIX - Gerenciar Unidades',
    data: { role: 'COLABORADOR' }, // Apenas COLABORADOR entra aqui
  },
  {
    path: 'paciente',
    component: DashboardPaciente,
    canActivate: [authGuard, roleGuard],
    title: 'MEDIX - Agendamentos',
    data: { role: 'PACIENTE' },
  },
  {
    path: 'medix-ai',
    component: MedixAiChat,
    canActivate: [authGuard, roleGuard],
    title: 'MEDIX - Agendamentos',
    data: { role: 'PACIENTE' },
  },
];
