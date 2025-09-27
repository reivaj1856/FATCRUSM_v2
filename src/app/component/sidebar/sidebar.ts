import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/data-access/auth.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit{

  private _supabaseClient = inject(AuthService)
  private _authState = inject(AuthService);
  private _router = inject(Router);
  private logueado :boolean = false;

  ngOnInit(): void {
    this.verLogueado();
  }

  async logOut(){
    this.verLogueado();
    await this._authState.signOut();
    this._router.navigateByUrl('**');
    toast.message('Sesión cerrada con éxito');
  }
  getLogin(){
   return this.logueado;
  }
  async verLogueado(){
    this.logueado =await this._supabaseClient.getLogin()
  }
  
}
