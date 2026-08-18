import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService
    .isLoggedIn()
    .pipe(map((loggedIn) => (loggedIn ? router.createUrlTree(['/admin/dashboard']) : true)));
};
