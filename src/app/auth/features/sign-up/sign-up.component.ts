import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormSignUp } from '../../../interface/FormSignUp';
import { hasEmailError, isRequired } from '../utils/validators';
import { AuthService } from '../../data-access/auth.service';
import { AuthServiceStore } from '../../../services/auth.service';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';
import { NotesService } from '../../../data/data-access/data-access.service';
import { UserStore, Usuario } from '../../../interface/User';
import { DataAccessService } from '../../../services/data-access.service';

export type UserCreate = Omit<UserStore, 'id'>;

export type UsuarioCreate = Omit<Usuario, 'id'>;
export type UsuarioCreateStore = Omit<UserStore, 'id'>;

export interface FormSignUpStore {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export default class SignUpComponent {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _notesService = inject(NotesService);
  private _dataService = inject(DataAccessService);
  private _authServiceStore = inject(AuthServiceStore);
  hasEmailRequired() {
    return hasEmailError(this.form);
  }

  isRequired(field: 'email' | 'password' | 'nombre' | 'confirmPassword') {
    return isRequired(field, this.form);
  }

  passwordsMatchValidator(control: import('@angular/forms').AbstractControl) {
    const form = control as FormGroup;
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  form: FormGroup = this._formBuilder.group<FormSignUp>(
    {
      nombre: this._formBuilder.control('', Validators.required),
      email: this._formBuilder.control('', [
        Validators.required,
        Validators.email,
      ]),
      password: this._formBuilder.control('', Validators.required),
      confirmPassword: this._formBuilder.control('', Validators.required),
    },
    { validators: this.passwordsMatchValidator }
  );

  async submit() {
    if (this.form.invalid) return;
    if (this.form.value.password !== this.form.value.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    try {
      const { error, data } = await this._authService.signUp({
        email: this.form.value.email ?? '',
        password: this.form.value.password ?? '',
      });
      await this._authServiceStore.signUp({
        email: this.form.value.email ?? '', 
        password: this.form.value.password ?? ''
      } );
      const usuario: UsuarioCreate = {
        correo: this.form.value.email ?? '',
        admin: true,
        carrito: [],
      };
      await this._dataService.create(usuario);
      
      if (error) throw error;
      console.log(this.form.value.password);
      await this._notesService.addUser(
        this.form.value.empresa ?? '',
        this.form.value.nombre ?? '',
        this.form.value.email ?? ''
      );
      toast.success('por favor ingresa tus credenciales');
      this._router.navigateByUrl('/auth/login');
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }
}
