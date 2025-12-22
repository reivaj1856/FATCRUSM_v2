import { Component, inject } from '@angular/core';

import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthServiceStore } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { hasEmailError, isRequired } from '../../../segurity/validators';
import { toast } from 'ngx-sonner';
import { BotonGoogleComponent } from '../button-google/boton-google.component';
import { DataAccessService } from '../../../services/data-access.service';

interface FormSignIn {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule, BotonGoogleComponent, RouterLink],
  templateUrl: './sign-in.component.html',
})
export default class SignInComponent {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthServiceStore);
  private _dataService = inject(DataAccessService);

  constructor(private router: Router, public auth: AuthServiceStore) {}

  isRequired(field: 'email' | 'password') {
    return isRequired(field, this.form);
  }
  isEmailRequired() {
    return hasEmailError(this.form);
  }

  form = this._formBuilder.group<FormSignIn>({
    email: this._formBuilder.control('', [
      Validators.required,
      Validators.email,
    ]),
    password: this._formBuilder.control('', Validators.required),
  });

  async submit() {
    if (this.form.invalid) return;

    try {
      const { email, password } = this.form.value;
      if (!email || !password) return;

      await this._authService.singIn(email, password);
      await this._authService.reloadUser();

      if (await this._dataService.obtenerValorAdminPorCorreo(email)) {
        toast.success('Administrador detectado');
      } else {
        toast.success('Inicio de sesion autenticado');
      }
      this.router.navigateByUrl('/content');
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      toast.error('Ups, ocurrió un error');
    }
  }

  async submitWithGoogle() {
    try {
      await this._authService.singInWithGoogle();
      this.router.navigateByUrl('/content/home');
      toast.success('Inicio de sesion autenticado');
    } catch (error) {
      toast.success('Cuenta no valida');
    }
  }
}
