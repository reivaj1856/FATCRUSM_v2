import { Component, inject, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth/data-access/auth.service';
import authRoutes from '../../auth/features/auth.routes';
import { NotesService } from '../../data/data-access/data-access.service';
import { AuthStateService } from '../../data-access/auth-state.service';

import {  Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-head',
  imports: [],
  templateUrl: './head.component.html',
  styleUrl: './head.component.css'
})
export class HeadComponent implements OnInit{

  @Input() titulo: string = 'Bienvenido de nuevo';

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
  }
  getLogin(){
   return this.logueado;
  }
  async verLogueado(){
    this.logueado =await this._supabaseClient.getLogin()
  }
  

  @Output() toggleMenu = new EventEmitter<void>();
}
