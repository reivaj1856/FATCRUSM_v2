import { inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { docData, Firestore } from '@angular/fire/firestore';
import { collection, addDoc ,collectionData} from '@angular/fire/firestore';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { doc, updateDoc } from 'firebase/firestore';
import { Product } from '../interface/product';

export type ProducCreate = Omit<Product,'id'>

const PATH = 'product'

@Injectable({
  providedIn: 'root'
})
export class realService {

  constructor() { }
  
  private _firestore = inject(Firestore);

  private _collection = collection(this._firestore,PATH)

  getProduct = toSignal(collectionData(this._collection, {idField: 'id'}) as Observable  <Product[]>  ,{initialValue: []})

  create(poust: ProducCreate){
    return addDoc(this._collection, poust)
  }
  getProduc(id: string){
    const productRef = doc(this._firestore, `product/${id}`);
    return docData(productRef, { idField: 'id' }); // Opcionalmente incluye el ID
  }
  update(poust: ProducCreate,id:string){
    const docRef = doc(this._collection,id)
    return updateDoc(docRef, poust)
  }
  async getProducListId(ids: string[]): Promise<Product[]> {
    if (!ids.length) return [];
    const { getDocs, query, where, collection, FieldPath } = await import('@angular/fire/firestore');
    const q = query(collection(this._firestore, PATH), where(new FieldPath('__name__'), 'in', ids));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  }

  
}
