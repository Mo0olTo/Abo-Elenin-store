import { Component, inject } from '@angular/core';
import { Button } from '../../../../shared/ui/button/button';
import { TextField } from '../../../../shared/ui/text-field/text-field';
import { LoginFacade } from '../../facade/login.facade';
import { LoginStore } from '../../store/login.store';

@Component({
  selector: 'app-login',
  imports: [Button, TextField],
  providers: [LoginStore, LoginFacade],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  protected readonly facade = inject(LoginFacade);

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.facade.submit();
  }
}
