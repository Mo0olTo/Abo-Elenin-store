import { computed, Injectable, signal } from '@angular/core';

@Injectable()
export class LoginStore {
  private readonly emailSignal = signal('');
  private readonly passwordSignal = signal('');
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly email = this.emailSignal.asReadonly();
  readonly password = this.passwordSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly canSubmit = computed(() => {
    return this.email().trim().length > 0 && this.password().length > 0 && !this.loading();
  });

  readonly hasError = computed(() => this.error() !== null);

  setEmail(email: string): void {
    this.emailSignal.set(email);
    this.errorSignal.set(null);
  }

  setPassword(password: string): void {
    this.passwordSignal.set(password);
    this.errorSignal.set(null);
  }

  setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }

  setError(message: string | null): void {
    this.errorSignal.set(message);
  }
}
