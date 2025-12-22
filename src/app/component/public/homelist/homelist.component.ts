import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HeadComponent } from '../../head/head.component';
import { Usuario } from '../../../interface/User';
import { Auth } from '@angular/fire/auth';
import { DataAccessService } from '../../../services/data-access.service';
import { realService } from '../../../services/reals.service';
import { Product } from '../../../interface/product';
import { toast } from 'ngx-sonner';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-homelist',
  imports: [RouterLink],
  templateUrl: './homelist.component.html'
})


export class HomelistComponent {
  usuario: Usuario | null = null;
  auth = inject(Auth);
  data = inject(DataAccessService);
  logueado: boolean=false;
  update = inject(realService);
  router = inject(Router);
 @Input() producto: Product[] = [];

  agregarCarrito(idproducto: number) {
    if(this.usuario){
      this.usuario?.carrito.push(idproducto+"");
      toast.info('producto agregado al carrito');
      console.log(this.usuario)
      this.data.actualizarUsuarioPorId(this.usuario.id,this.usuario);
    }else{
      toast.error('inicia sesion para agregar productos al carrito')
    }
  }
  verid(){
    console.log(this.producto[0].id_product);
  }
  async getcuenta(){
      const email = this.auth.currentUser?.email+'';
      this.usuario = await this.data.obtenerUsuarioPorCorreo(email);
    }
  
  async ngOnInit() {
    await this.getcuenta();
    console.log(this.usuario);
  }
}
