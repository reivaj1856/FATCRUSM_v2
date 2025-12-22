import { inject, Injectable } from '@angular/core';
import { Usuario } from '../interface/User';
import { Firestore, collection, addDoc, query, where, getDocs, CollectionReference } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';
import { UserCreate } from './user.service';

const PATH = 'User'

export interface Venta {
  id?: string;            // ID del documento
  nombre_producto: string;
  cantidad: number;
  total: number;
  fecha: string;
}

export type UsuarioCreate = Omit<Usuario , 'id'>;

@Injectable({
  providedIn: 'root'
})
export class DataAccessService {  
  private firestore = inject(Firestore);
  private _collection = collection(this.firestore, PATH)

  create(user: UsuarioCreate){
    return addDoc(this._collection, user)
  }

  async obtenerValorAdminPorCorreo(correo: string): Promise<boolean> {
    const usuariosCollection = collection(this.firestore, 'User') as CollectionReference<Usuario>;
    const q = query(usuariosCollection, where('correo', '==', correo));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const data = doc.data();
      return data.admin;
    }

    return false; // si no se encuentra el correo
  }

  async obtenerUsuarioPorCorreo(correo: string): Promise<Usuario | null> {
    const usuariosCollection = collection(this.firestore, 'User') as CollectionReference<Usuario>;
    const q = query(usuariosCollection, where('correo', '==', correo));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const { id, ...data } = doc.data() as Usuario;
      return { id: doc.id, ...data } as Usuario;
    }

    return null; // si no se encuentra el correo
  }

  async actualizarUsuarioPorId(id: string, usuario: Usuario): Promise<void> {
    const { doc, setDoc } = await import('@angular/fire/firestore');
    const docRef = doc(this.firestore, `User/${id}`);
    await setDoc(docRef, usuario);
  }

  // Elimina un producto del array 'carrito' del usuario usando arrayRemove
  async eliminarProductoCarrito(id: string, productoId: string): Promise<void> {
    try {
      const { doc, updateDoc, arrayRemove } = await import('@angular/fire/firestore');
      const docRef = doc(this.firestore, `User/${id}`);
      await updateDoc(docRef, {
        carrito: arrayRemove(productoId)
      });
    } catch (error) {
      console.error('Error eliminando producto del carrito:', error);
      throw error;
    }
  }

  async getVentas(): Promise<Venta[]> {
    try {
      const ventasRef = collection(this.firestore, 'ventas');
      const snapshot = await getDocs(ventasRef);

      const ventas: Venta[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Venta)
      }));

      console.log('📦 Ventas obtenidas:', ventas);
      return ventas;
    } catch (error) {
      console.error('❌ Error al obtener ventas:', error);
      throw error;
    }
  }
  
}
