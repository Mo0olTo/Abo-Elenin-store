import { computed, Injectable, signal } from '@angular/core';

@Injectable()
export class CheckoutStore {
  private readonly savingSignal = signal(false);
  private readonly completedSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly saving = this.savingSignal.asReadonly();
  readonly completed = this.completedSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly hasError = computed(() => this.error() !== null);

  setSaving(saving: boolean): void {
    this.savingSignal.set(saving);
  }

  setCompleted(completed: boolean): void {
    this.completedSignal.set(completed);
  }

  setError(message: string | null): void {
    this.errorSignal.set(message);
  }
}
