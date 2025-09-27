import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HeadComponent } from '../../head/head.component';
/* import { Product } from '../../../interface/product';

import { Auth } from '@angular/fire/auth';
import { DataAccessService } from '../../../services/data-access.service';
import { Usuario } from '../../../interface/user';
import { toast } from 'ngx-sonner';
import { realService } from '../../../services/reals.service'; */

@Component({
  selector: 'app-homelist',
  imports: [RouterLink],
  templateUrl: './homelist.component.html'
})


export class HomelistComponent {
  /* usuario: Usuario | null = null;
  auth = inject(Auth);
  data = inject(DataAccessService);
  logueado: boolean=false;
  update = inject(realService);
  router = inject(Router);
  @Input() producto: Product[] = [];

  agregarCarrito(idproducto: string) {
    if(this.usuario){
      this.usuario?.carrito.push(idproducto);
      toast.info('producto agregado al carrito');
      console.log(this.usuario)
      this.data.actualizarUsuarioPorId(this.usuario.id,this.usuario);
    }else{
      toast.error('inicia sesion para agregar productos al carrito')
    }
  }

  async getcuenta(){
      const email = this.auth.currentUser?.email+'';
      this.usuario = await this.data.obtenerUsuarioPorCorreo(email);
    }
  
  async ngOnInit() {
    await this.getcuenta();
    console.log(this.usuario);
  } */
 productos = [
  {
    id: 1,
    nombre: 'Polera Básica',
    precio: 45,
    enlace: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfV7S0HMKXXxqSOHBC2KEnMqf7QTjNgd7JUQ&s'
  },
  {
    id: 2,
    nombre: 'Polera Manga Larga',
    precio: 60,
    enlace: 'https://saba.cl/wp-content/uploads/2021/05/2.png'
  },
  {
    id: 3,
    nombre: 'Polera Deportiva',
    precio: 75,
    enlace: 'https://www.surprice.cl/media/catalog/product/n/f/nf0a82x7_nfjk3_1_1.jpg'
  },
  {
    id: 4,
    nombre: 'Buzo con Capucha (Hoodie)',
    precio: 120,
    enlace: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 5,
    nombre: 'Buzo Deportivo',
    precio: 135,
    enlace: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 6,
    nombre: 'Buzo Oversized',
    precio: 150,
    enlace: 'https://acdn-us.mitiendanube.com/stores/003/795/340/products/o_a10-670-180646a89f8bcc2f1117454317517812-1024-1024.jpg'
  }
];



}
