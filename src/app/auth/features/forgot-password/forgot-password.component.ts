import { Component } from '@angular/core';

import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-forgot-password',
  imports: [],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export default class ForgotPasswordComponent {
  submit() {
    toast.message('Error comuniquense con el administrador', { duration: 4000 });
  } 
}
