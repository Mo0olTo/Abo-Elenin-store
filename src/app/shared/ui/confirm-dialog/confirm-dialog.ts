import { Component, input, output } from '@angular/core';
import { Button } from '../button/button';

@Component({
  selector: 'app-confirm-dialog',
  imports: [Button],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
})
export class ConfirmDialog {
  readonly open = input(false);
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly cancelLabel = input('Cancel');
  readonly confirmLabel = input('Confirm');
  readonly confirmVariant = input<'primary' | 'danger'>('danger');

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
}
