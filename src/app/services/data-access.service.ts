import { inject, Injectable } from '@angular/core';
import { Usuario } from '../interface/User';
import { Firestore, collection, addDoc, query, where, getDocs, CollectionReference } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';
import { UserCreate } from './user.service';

const PATH = 'User'

export type UsuarioCreate = Omit<Usuario , 'id'>;

@Injectable({
  providedIn: 'root'
})
export class DataAccessService {  
  private firestore = inject(Firestore);
  private _collection = collection(this.firestore, PATH)
  
  constructor() { }

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

}
