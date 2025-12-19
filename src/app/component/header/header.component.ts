import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataAccessService } from '../../services/data-access.service';
import { Auth, authState } from '@angular/fire/auth';
import { Product } from '../../interface/product';
import { Usuario } from '../../interface/User';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  private _dataService = inject(DataAccessService);
  toggleOpen: HTMLElement | null = null;
  toggleClose: HTMLElement | null = null;
  collapseMenu: HTMLElement | null = null;
  auth = inject(Auth);
  admin: boolean=false;
  logueado: boolean=false;
  cantidadCarrito = 0;
  _auth = inject(AuthService);

  ngOnInit(): void {
    this.toggleOpen = document.getElementById('toggleOpen');
    this.toggleClose = document.getElementById('toggleClose');
    this.collapseMenu = document.getElementById('collapseMenu');

    this.getAdmind();
    this.getLogin();
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
    

    // Ejecutar getLogin periódicamente
    setInterval(() => {
      this.getLogin();
      this.getCarrito();
    }, 2000); // cada 2 segundos
  } 

  logout(){
    this._auth.cerrarSesion();
    window.location.reload();
  }

  async getAdmind(){
  const email = this.auth.currentUser?.email+'';
  this.admin = await this._dataService.obtenerValorAdminPorCorreo(email);
  }

  getLogin(){
  if(this.auth.currentUser?.email == null){
    this.logueado= false;
  }else{
    this.logueado= true;
  }
  console.log(this.auth.currentUser?.email);
  }
  async getCarrito(){
    const email = this.auth.currentUser?.email + '';
    const usuario = await this._dataService.obtenerUsuarioPorCorreo(email) as Usuario | null;
    this.cantidadCarrito = usuario && usuario.carrito ? usuario.carrito.length : 0;
  }
}
