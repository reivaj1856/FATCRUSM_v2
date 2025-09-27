import { Component, inject } from '@angular/core';
import { HeadComponent } from "../../../component/head/head.component";
import { FooterComponent } from '../../../component/footer/footer.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../data-access/auth.service';
import { Router, RouterLink } from '@angular/router';
import { NgxSonnerToaster, toast } from 'ngx-sonner';
import { hasEmailError, isRequired } from '../utils/validators';
import { FormSignIn } from '../../../interface/FormSignIn';
import { GoogleComponent } from '../google/google.component';
import { AuthStateService } from '../../../data-access/auth-state.service';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export default class SignInComponent {
  private _formBuilder = inject(FormBuilder);
    private _authService = inject(AuthService);
    private _router = inject(Router);
    private _supabaseClient = inject(AuthStateService);
  
    hasEmailRequired() {
      return hasEmailError(this.form);
    }
  
    isRequired(field: 'email' | 'password' ) {
      return isRequired(field, this.form);
    }
  
    form: FormGroup = this._formBuilder.group<FormSignIn>({
      email: this._formBuilder.control('', [Validators.required, Validators.email]),
      password: this._formBuilder.control('', Validators.required),
    });
  
    async submit() {
      if (this.form.invalid) return;
      try {
        
      const authResponse = await this._authService.logIn({
  
        email: this.form.value.email ?? '',
        password: this.form.value.password ?? '',
      });
      if(authResponse.error){
        toast.info('Error al iniciar sesión verifique sus credenciales');
        throw authResponse.error;
        
      }else{
        toast.success('Bienvenido a FATCRSM');
        this._router.navigateByUrl('/private');
      }
      } catch (error) {
        console.error(error);
      }
    }
    
    async submitWithGoogle() {
      const { data, error } = await this._supabaseClient.supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
    }
    
}

