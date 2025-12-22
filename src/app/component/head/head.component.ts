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

  toggleOpen: HTMLElement | null = null;
  toggleClose: HTMLElement | null = null;
  collapseMenu: HTMLElement | null = null;

  @Input() titulo: string = 'Bienvenido de nuevo';

  private _supabaseClient = inject(AuthService)
  private _authState = inject(AuthService);
  private _router = inject(Router);
  private logueado :boolean = false;

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
  
  ngOnInit(): void {
    this.verLogueado();
    this.toggleOpen = document.getElementById('toggleOpen');
    this.toggleClose = document.getElementById('toggleClose');
    this.collapseMenu = document.getElementById('collapseMenu');

    const handleClick = () => {
      if (this.collapseMenu) {
        if (this.collapseMenu.style.display === 'block') {
          this.collapseMenu.style.display = 'none';
        } else {
          this.collapseMenu.style.display = 'block';
        }
      }
    };

    if (this.toggleOpen) {
      this.toggleOpen.addEventListener('click', handleClick);
    }
    if (this.toggleClose) {
      this.toggleClose.addEventListener('click', handleClick);
    }
    
  } 

  @Output() toggleMenu = new EventEmitter<void>();
}
