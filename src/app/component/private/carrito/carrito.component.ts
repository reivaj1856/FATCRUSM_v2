import { Component, inject, Input } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { realService } from '../../../services/reals.service';
import { Product } from '../../../interface/product';
import { FormBuilder, Validators } from '@angular/forms';
import { Usuario } from '../../../interface/User';
import { Auth } from '@angular/fire/auth';
import { DataAccessService } from '../../../services/data-access.service';

@Component({
  selector: 'app-carrito',
  imports: [HeaderComponent,FooterComponent,RouterLink],
  templateUrl: './carrito.component.html',
  styles: ``
})
export default class CarritoComponent {
  producto: Product[] = [];
  usuario: Usuario | null = null;
  auth = inject(Auth);
  dataUser = inject(DataAccessService);
  dataProduct = inject(realService);

  async ngOnInit() {
    await this.getcuenta();
    this.producto = await this.dataProduct.getProducListId(this.usuario?.carrito ?? []);
    console.log(this.dataProduct.getProducListId(this.usuario?.carrito ?? []));
  }

  async getcuenta(){
      const email = this.auth.currentUser?.email+'';
      this.usuario = await this.dataUser.obtenerUsuarioPorCorreo(email);
    }
    
  async eliminarProductoOfList(id: string): Promise<void> {
    if (!this.usuario) return;
    try {
      const { doc, updateDoc, arrayRemove } = await import('@angular/fire/firestore');
      const docRef = doc(this.dataUser['firestore'], `User/${this.usuario.id}`);
      await updateDoc(docRef, {
        carrito: arrayRemove(id)
      });
      // Actualiza la lista local de productos
      this.producto = this.producto.filter(p => p.id !== id);
      // Opcional: mensaje de éxito
      // toast.message('🗑️ Producto eliminado del carrito correctamente.');
    } catch (error) {
      console.error('Error al eliminar el producto del carrito:', error);
      // toast.message('❌ No se pudo eliminar el producto del carrito.');
    }
  } 
  
  }
