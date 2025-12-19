import { inject, Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { User } from '../interface/User';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';


export type UserCreate = Omit<User,'id'>

const PATH1 = 'user'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private _firestore = inject(Firestore);

  private _collection = collection(this._firestore,PATH1)


  getUser = toSignal(collectionData(this._collection, {idField: 'id'}) as Observable  <User[]>  ,{initialValue: []})
  
  create(user: UserCreate){
    return addDoc(this._collection, user)
  }
  update(poust: UserCreate,id:string){
    const docRef = doc(this._collection,id)
    return updateDoc(docRef, poust)
  }
  constructor() { }
}
