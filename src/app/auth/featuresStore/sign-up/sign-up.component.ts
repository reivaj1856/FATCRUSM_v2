import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthServiceStore } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { AuthStateService } from '../../../segurity/acces/auth-state.service';
import { hasEmailError, isRequired } from '../../../segurity/validators';
import { toast } from 'ngx-sonner';
import { authState, user } from '@angular/fire/auth';
import { User, UserStore, Usuario, UsuarioStore } from '../../../interface/User';
import { BotonGoogleComponent } from '../button-google/boton-google.component';
import { CreateService } from '../create.service';
import { DataAccessService } from '../../../services/data-access.service';
import { UsuarioCreateStore } from '../../features/sign-up/sign-up.component';

export type UserCreate = Omit<UsuarioStore,'id'>

export type UsuarioCreate = Omit<UserStore , 'id'>;

export interface FormSignUp {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule,BotonGoogleComponent],
  templateUrl: './sign-up.component.html'
})
export default class SignUpComponent {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthServiceStore);
  private _router = inject(Router);
  private _authState = inject(AuthStateService);
  private _dataService = inject(DataAccessService);
  
  // Comprobación de errore]
  // 
  
  
  isRequired(field: 'email' | 'password') {
    return isRequired(field, this.form);
  }

  hasEmailError() {
    return hasEmailError(this.form);
  }
  

  // Formulario reactivo
  form = this._formBuilder.group<FormSignUp>({
    email: this._formBuilder.control('', [
      Validators.required,
      Validators.email,
      //this.unajmaEmailValidator,
    ]),
    password: this._formBuilder.control('', Validators.required)
   
  });

  async submit() {
    if (this.form.invalid) {
      return;
    }

    try {
      const { email, password} = this.form.value;

      if (!email || !password ) return;

      // Crear usuario y enviar correo de verificación
      await this._authService.signUp({email, password } );
      const usuario: UsuarioCreateStore = { correo: email, admin: false ,carrito:[]};
      await this._dataService.create(usuario);
      
      toast.success('Cuenta creada ingrese sus credenciales para iniciar sesion');
      this.logOut()
      // Redirigir a la página de inicio de sesion
      this._router.navigateByUrl('/authStore/sign-in');
    } catch (error) {
      toast.success('error')
    }
  }
  async logOut() {
    await this._authState.logOut();

    this._router.navigateByUrl('/authStore/sign-in');
  }

  // Google Sign In
  async submitWithGoogle(){
    try{
      await this._authService.singInWithGoogle()
      this._router.navigateByUrl('/content/home'); 
      toast.success('Inicio de sesion autenticado')

    }catch(error){
      toast.success('Cuenta no valida')
    }
  }
}
