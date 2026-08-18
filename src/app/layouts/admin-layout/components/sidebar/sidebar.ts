import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { Button } from '../../../../shared/ui/button/button';

@Component({
  selector: 'app-admin-sidebar',
  imports: [RouterLink, RouterLinkActive, Button],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected logout(): void {
    this.authService
      .logout()
      .pipe(take(1))
      .subscribe(() => {
        void this.router.navigateByUrl('/admin/login');
      });
  }
}
