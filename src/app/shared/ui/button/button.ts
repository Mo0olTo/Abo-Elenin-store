import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  readonly label = input.required<string>();
  readonly type = input<'button' | 'submit'>('button');
  readonly variant = input<'primary' | 'ghost' | 'danger'>('primary');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly loadingLabel = input('Please wait...');
  readonly clicked = output<void>();

  protected readonly buttonClass = computed(() => {
    const base =
      'inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60';

    if (this.variant() === 'danger') {
      return `${base} bg-red-600 text-white hover:bg-red-500`;
    }

    if (this.variant() === 'ghost') {
      return `${base} bg-transparent text-slate-200 hover:bg-slate-800`;
    }

    return `${base} bg-slate-900 text-white hover:bg-slate-800`;
  });

  protected onClick(): void {
    if (this.disabled() || this.loading()) {
      return;
    }

    this.clicked.emit();
  }
}
