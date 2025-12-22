import { inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { docData, Firestore } from '@angular/fire/firestore';
import { collection, addDoc ,collectionData} from '@angular/fire/firestore';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { Product } from '../interface/product';
import { toast } from 'ngx-sonner';

export type ProducCreate = Omit<Product,'id'>

const PATH = 'product'

@Injectable({
  providedIn: 'root'
})
export class realService {

  constructor() { }
  
  private _firestore = inject(Firestore);

  public _collection = collection(this._firestore,PATH)

  getProduct = toSignal(collectionData(this._collection, {idField: 'id_product'}) as Observable  <Product[]>  ,{initialValue: []})

  create(poust: ProducCreate){
    return addDoc(this._collection, poust)
  }
  getProduc(id: string){
    const productRef = doc(this._firestore, `product/${id}`);
    return docData(productRef, { idField: 'id_product' }); // Opcionalmente incluye el ID
  }
  update(poust: ProducCreate,id:string){
    const docRef = doc(this._collection,id)
    return updateDoc(docRef, poust)
  }
  async getProductsByIds(ids: string[]): Promise<Product[]> {
    console.log(ids);
    if (!ids.length) return [];
    
    const results: Product[] = [];
    
    for (const id of ids) {
      const docRef = doc(this._firestore, PATH, id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data() as Product;
        results.push({ ...data, id_product: data.id_product ?? snapshot.id });
      }
    }

    return results;
  }
  async crearVenta(nombreProducto: string, cantidad: number, total: number) {
    try {
      const ventasRef = collection(this._firestore, 'ventas');

      const nuevaVenta = {
        nombre_producto: nombreProducto,
        cantidad: cantidad,
        total: total,
        fecha: new Date().toISOString() // fecha actual (opcional)
      };

      const docRef = await addDoc(ventasRef, nuevaVenta);
      console.log('✅ Venta registrada con ID:', docRef.id);
      toast.success('Venta registrada correctamente');
      return docRef.id;
    } catch (error) {
      console.error('❌ Error al registrar venta:', error);
      toast.error('Error al registrar la venta');
      throw error;
    }
  }
}
