import { Component, inject, Input, input } from '@angular/core';
import { Product } from '../../../interface/product';
import { RouterLink } from '@angular/router';
import { deleteDoc, doc, Firestore } from '@angular/fire/firestore';
import { NgxSonnerToaster, toast } from 'ngx-sonner';
import { realService } from '../../../services/reals.service';

@Component({
  selector: 'app-listproducts',
  imports: [RouterLink],
  templateUrl: './listproducts.component.html',
})
export class ListproductsComponent {
   @Input() producto: Product[] = [];

  constructor(private firestore: Firestore) {
  }

  async eliminarProducto(id: string): Promise<void> {
  try {
    const ref = doc(this.firestore, 'product', id);
    await deleteDoc(ref);
    toast.message('🗑️ Producto eliminado correctamente.');
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    toast.message('❌ No se pudo eliminar el producto.');
  }
} 
}
