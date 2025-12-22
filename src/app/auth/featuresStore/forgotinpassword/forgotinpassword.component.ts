import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';
import { AuthServiceStore } from '../../../services/auth.service';

interface FormSignUp {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}
FormGroup
@Component({
  selector: 'app-forgotinpassword',
  imports: [ReactiveFormsModule],
  templateUrl: './forgotinpassword.component.html'
})
export default class ForgotinpasswordComponent {
  isEmailRequired() {
    throw new Error('Method not implemented.');
    }
      private _formBuilder = inject(FormBuilder);
      private _authService = inject(AuthServiceStore);
    
      constructor(private _router: Router) {}
    
    goToSignIn() {
      this._router.navigate(['/auth/sign-in']);
    }
    
      form = this._formBuilder.group({
        email: this._formBuilder.control('', [Validators.required, Validators.email]),
      });
    
      async submit() {
        if (this.form.invalid) {
          toast.error('Por favor, ingresa un correo válido');
          return;
        }
    
        try {
          const { email } = this.form.value;
    
          if (!email) return;
    
          await this._authService.recoverPassword(
            email
          );
    
          toast.success('Solicitud Autenticada, revise su bandeja');
        } catch (error) {
          toast.error('Solicitud no verificada intente de nuevo mas tarde');
        }
      }
}
