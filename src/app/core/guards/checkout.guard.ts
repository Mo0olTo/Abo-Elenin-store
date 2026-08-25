import { Observable } from 'rxjs';
import { CanDeactivateFn } from '@angular/router';

export interface CanLeaveCheckout {
  canDeactivate(): Observable<boolean> | boolean;
}

export const checkoutGuard: CanDeactivateFn<CanLeaveCheckout> = (component) => {
  return component.canDeactivate();
};
