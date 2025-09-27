import { inject, Injectable } from '@angular/core';
import { AuthStateService } from '../../data-access/auth-state.service';
import { SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { bindCallback } from 'rxjs';

export interface User{
    id_usuario?: number;
    empresa : string;
    nombre_trabajador : string;
    visible : boolean;
    email : string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _supabaseClient = inject(AuthStateService).supabaseClient;

  constructor() {
    this._supabaseClient.auth.onAuthStateChange((session) => {
      console.log(session);
    });
  }

  sesion() {
    return this._supabaseClient.auth.getSession();
  }

  signUp(credentials: SignUpWithPasswordCredentials) {
    return this._supabaseClient.auth.signUp(credentials);
  }

  logIn(credentials: SignUpWithPasswordCredentials) {
    return this._supabaseClient.auth.signInWithPassword(credentials);
  }

  signOut() {
    return this._supabaseClient.auth.signOut();
  }

  async getUserComplet(email: string): Promise<User | null> {
    const { data, error } = await this._supabaseClient
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error(error);
      return null;
    } else {
      return data as User;
    }
  }

  async getUser(): Promise<User | null> {
    {
      const { data, error } = await this._supabaseClient.auth.getSession();
      if (error) {
        console.log('Hubo un error al obtener la sesión:', error.message);
        return null;
      }

      if (data?.session) {
        console.log(data.session.user.email);

        return this.getUserComplet(String(data.session.user.email));
      } else {
        console.log('Usuario no está logueado.');
        return null;
      }
    }
  }
  async getUserId(): Promise<number | null> {
  try {
    const { data, error } = await this._supabaseClient.auth.getSession();

    if (error) {
      console.error('Hubo un error al obtener la sesión:', error.message);
      return null;
    }

    if (data?.session) {
      const email = data.session.user.email;
      console.log("Usuario logueado:", email);

      // Reutilizamos tu método existente
      const user = await this.getUserComplet(String(email));

      if (user) {
        console.log("ID Usuario:", user.id_usuario);
        return user.id_usuario|| -2; // ✅ Solo devolvemos el ID
      }
    } else {
      console.log('Usuario no está logueado.');
    }

    return null;
  } catch (err) {
    console.error("Excepción al obtener usuario:", err);
    return null;
  }
}


  async getLogin(): Promise<boolean> {
    const { data, error } = await this._supabaseClient.auth.getSession();

    if (error) {
      console.log('Hubo un error al obtener la sesión:', error.message);
      return false;
    }

    if (data?.session) {
      console.log('Usuario está logueado.');
      return true;
    } else {
      console.log('Usuario no está logueado.');
      return false;
    }
  }
}
