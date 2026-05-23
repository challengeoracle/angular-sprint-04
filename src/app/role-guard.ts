import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './service/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getUser();

  const expectedRole = route.data?.['role'] ?? '';

  // Verificamos se o usuário existe antes de acessar a role
  if (authService.isLoggedIn() && user && user.role === expectedRole) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
