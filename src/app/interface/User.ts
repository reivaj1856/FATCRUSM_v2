import { Product } from "./product";

export interface Usuario {
  id: string;
  correo: string;
  admin: boolean;
  carrito: string[];
}


export interface User{
    empresa : string;
    nombre_trabajador : string;
    visible : boolean;
    email : string;
}

export interface UserStore {
  id: string;
  correo: string;
  admin: boolean;
  carrito: string[];
}

export interface UsuarioStore {
  email: string;
  password: string;
}