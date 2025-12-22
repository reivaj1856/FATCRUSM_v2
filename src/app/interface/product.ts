
export interface Product {
  id_product: number; 
  id_producto: number;       // ID del producto en Supabase
  id_usuario: number;        // ID del usuario propietario
  nombre: string;
  detalles?: string;
  imagenes: string[]; 
  hombre: boolean;
  mujer: boolean;
  niño: boolean;
  ofertas: boolean;
  tallas: {
    id_talla: number;
    id_usuario: number;
    nombre: string;
    cantidad: number;
    precio: number;
    sexo: 'hombre' | 'mujer' | 'niño';
    tipo: string;
  }[];
}

