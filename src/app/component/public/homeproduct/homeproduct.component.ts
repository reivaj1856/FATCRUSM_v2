import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { realService } from '../../../services/reals.service';
import { Product } from '../../../interface/product';
import { FormBuilder, Validators } from '@angular/forms';
import { FormProduc } from '../admin/product-edit/product-edit.component';

import { FooterComponent } from '../../footer/footer.component';
import { Usuario } from '../../../interface/User';
import { toast } from 'ngx-sonner';
import { DataAccessService } from '../../../services/data-access.service';
import { Auth } from '@angular/fire/auth';
import { HeaderComponent } from '../../header/header.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-homeproduct',
  imports: [FooterComponent,RouterLink,HeaderComponent,NgIf,NgFor],
  templateUrl: './homeproduct.component.html',
  styles: ``
})
export class HomeproductComponent {
  usuario: Usuario | null = null;
  auth = inject(Auth);
  data = inject(DataAccessService);
  private _formBuilder = inject(FormBuilder);
  private serviceData = inject(realService);

  productID!: string;

  // Form para editar producto (solo campos principales, imágenes y tallas se manejan aparte)
  form = this._formBuilder.group({
    nombre: this._formBuilder.control('', Validators.required),
    detalles: this._formBuilder.control('', Validators.required),
    precio: this._formBuilder.control(0, Validators.required),
    mujer: this._formBuilder.control(false),
    niño: this._formBuilder.control(false),
    ofertas: this._formBuilder.control(false)
  });

  // Producto actual
  product: Product = {
    id_product: 0,
    id_producto: 0,
    id_usuario: 0,
    nombre: '',
    detalles: '',
    imagenes: [],
    hombre: false,
    mujer: false,
    niño: false,
    ofertas: false,
    tallas: []
  };

  constructor(private route: ActivatedRoute, private router: Router) {}

  async ngOnInit() {
    // Obtener ID del producto de la ruta
    this.route.params.subscribe(params => {
      this.productID = params['id'];
    });
    
    // Cargar producto desde Firebase
    this.serviceData.getProduc(this.productID).subscribe((data: any) => {
      if (data) {
        this.product = {
          id_product: data.id_product || 0,
          id_producto: data.id_producto || 0,
          id_usuario: data.id_usuario || 0,
          nombre: data.nombre || '',
          detalles: data.detalles || '',
          imagenes: data.imagenes || [],
          hombre: data.hombre || false,
          mujer: data.mujer || false,
          niño: data.niño || false,
          ofertas: data.ofertas || false,
          tallas: data.tallas || []
        };
      }
      
    });

    await this.getCuenta();
    console.log(this.productID);
  }

  // Obtener usuario logueado
  async getCuenta() {
    const email = this.auth.currentUser?.email ?? '';
    if (email) {
      this.usuario = await this.data.obtenerUsuarioPorCorreo(email);
    }
  }

  // Agregar producto al carrito del usuario
  agregarCarrito(id_producto: number) {
    if (!this.usuario) {
      toast.error('Inicia sesión para agregar productos al carrito');
      return;
    }

    if (!this.usuario.carrito) this.usuario.carrito = [];
    this.usuario.carrito.push(id_producto+"");
    toast.info('Producto agregado al carrito');

    // Actualizar usuario en la base de datos
    this.data.actualizarUsuarioPorId(this.usuario.id, this.usuario);
    console.log(this.usuario);
  }
  crearVenta() {
    this.serviceData.crearVenta(this.product.nombre, 1, this.product.tallas[0].precio);
    // Eliminar el producto del carrito del usuario mediante el servicio central (DataAccessService)
    if (this.usuario) {
      this.data.eliminarProductoCarrito(this.usuario.id, this.product.id_producto+"")
        .catch(err => console.error('Error eliminando producto del carrito tras venta:', err));
    }
  }
  
}

