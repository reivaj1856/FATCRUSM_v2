import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword,signInWithEmailAndPassword,signInWithPopup,GoogleAuthProvider,sendPasswordResetEmail,sendEmailVerification,} from '@angular/fire/auth';
import { addDoc, collection } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';

import { Router } from '@angular/router';
import { UserCreate } from '../auth/featuresStore/sign-up/sign-up.component';



const PATH = 'user'


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private _auth = inject(Auth) 
  private _firestore = inject(Firestore);
  private _collection = collection(this._firestore,PATH)
  private _router = inject(Router);


  recoverPassword(email:string) {
    return sendPasswordResetEmail(this._auth, email);
  }
  
  async signUp(user: UserCreate) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this._auth,
        user.email,
        user.password
      );

      // Enviar correo de verificación al usuario
      await sendEmailVerification(userCredential.user);
      return userCredential.user;
    } catch (error) {
      throw new Error('Error al crear el usuario.');
    }
  }
  singIn(email:string,password:string){
    return signInWithEmailAndPassword(this._auth, email, password)
  }

  singInWithGoogle(){
    const provider = new GoogleAuthProvider()

    provider.setCustomParameters({prompt: 'select_account'})

    return signInWithPopup(this._auth,provider);
  }

   // Método para recargar el estado del usuario
  async reloadUser(): Promise<void> {
    const user = this._auth.currentUser;
    if (user) {
      await user.reload();
    }
  }

  get isEmailVerified$(): boolean {
    return this._auth.currentUser?.emailVerified ?? false;
  }

  constructor() { } 

  cerrarSesion(){
  return this._auth.signOut();
}
}

