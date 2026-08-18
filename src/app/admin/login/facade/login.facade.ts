import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, finalize, take, tap } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { isFirebaseAuthError, LoginCredentials } from '../models/login.model';
import { LoginStore } from '../store/login.store';

@Injectable()
export class LoginFacade {
  private readonly store = inject(LoginStore);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly email = this.store.email;
  readonly password = this.store.password;
  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly canSubmit = this.store.canSubmit;
  readonly hasError = this.store.hasError;

  setEmail(email: string): void {
    this.store.setEmail(email);
  }

  setPassword(password: string): void {
    this.store.setPassword(password);
  }

  submit(): void {
    if (!this.canSubmit()) {
      return;
    }

    this.store.setLoading(true);
    this.store.setError(null);

    const credentials: LoginCredentials = {
      email: this.email().trim(),
      password: this.password(),
    };

    this.authService
      .login(credentials.email, credentials.password)
      .pipe(
        take(1),
        tap(() => void this.router.navigateByUrl('/admin/dashboard')),
        catchError((error: unknown) => {
          this.store.setError(this.toUserMessage(error));
          return EMPTY;
        }),
        finalize(() => this.store.setLoading(false)),
      )
      .subscribe();
  }

  private toUserMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const message = this.identityToolkitMessage(error);
      if (message === 'TOO_MANY_ATTEMPTS_TRY_LATER') {
        return 'Too many attempts. Please try again later.';
      }

      return 'Invalid email or password';
    }

    if (isFirebaseAuthError(error) && error.code === 'auth/too-many-requests') {
      return 'Too many attempts. Please try again later.';
    }

    return 'Invalid email or password';
  }

  private identityToolkitMessage(error: HttpErrorResponse): string | null {
    const payload = error.error as { error?: { message?: unknown } } | null;
    const message = payload?.error?.message;
    return typeof message === 'string' ? message : null;
  }
}
