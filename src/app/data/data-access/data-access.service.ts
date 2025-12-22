import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../../auth/data-access/auth.service';
import { AuthStateService } from '../../data-access/auth-state.service';
import { Proyeccion } from '../../interface/Proyeccion';
import { Pelicula } from '../../interface/Pelicula';
import { Horario } from '../../interface/horarios';
import { Dia } from '../../interface/Dia';
import { Sala } from '../../interface/Sala';
import { Producto } from '../../component/private/business/inventario/inventario.component';

export interface Pedido {
  id: number;
  id_usuario: number;
  nombre: string;
  email: string;
  celular: string;
  categoria: string;
  estado: 'Pendiente' | 'Entregado';
  descripcion?: string;
  total?: number;
}

export interface Servicio {
  id?: number;
  id_cliente: number;
  nombre_cliente: string;
  id_usuario: number;
  tipo: string;
  descripcion: string;
  costo: number;
  cantidad: number;
  unidad: number;
  finalizado: boolean;
  visible: boolean;
  fecha: Date;
}

export interface Tallas {
  id?: number;
  talla: string;
  id_usuario: number;
  sexo: string;
  tipo: string;
}

export interface Servicio_talla {
  id_servicio: number;
  id_talla: number;
  cantidad: number;
  costo: number;
  nombre?: string;
}

@Injectable({ providedIn: 'root' })
export class NotesService {
  public _supabaseClient = inject(AuthStateService).supabaseClient;

  //#region Usuario
  async addUser(nombreN: string, empresaN: string, email1: string) {
    const { data, error } = await this._supabaseClient.from('usuarios').insert([
      {
        empresa: empresaN,
        nombre_trabajador: nombreN,
        visible: true,
        email: email1,
      },
    ]);

    if (error) console.error(error);
    else console.log(data);
  }

  async editarUsuario(
    nombre_empresa: string,
    nombre_cliente: string,
    email: string
  ): Promise<any | null> {
    const { data, error }: { data: any; error: any } =
      await this._supabaseClient
        .from('usuarios')
        .update({
          empresa: nombre_empresa,
          nombre_trabajador: nombre_cliente,
          email: email,
        })
        .eq('email', email); // Asegúrate de filtrar correctamente por el identificador único, como el ID o email

    if (error) {
      console.error('Error al editar usuario:', error?.message);
      return null;
    }

    console.log('usuario correctamente editado:', data);
    return data;
  }
  //#endregion
  //#region cliente
  async getClienteName(id: number) {
    const { data, error } = await this._supabaseClient
      .from('clientes')
      .select('id_cliente, nombre_cliente, direccion, telefono, email')
      .eq('id_cliente', id);
    // <--- NUEVA CONDICIÓN: Solo trae clientes donde 'visible' es TRUE

    if (error) {
      console.error('Error al obtener los clientes:', error);
      return 'N/A';
    } else {
      return data; // Devuelve los clientes activos/visibles encontrados
    }
  }
  async getClientes(id_usuario: number) {
    const { data, error } = await this._supabaseClient
      .from('clientes')
      .select('id_cliente, nombre_cliente, direccion, telefono, email')
      .eq('id_usuario', id_usuario)
      .eq('visible', true); // <--- NUEVA CONDICIÓN: Solo trae clientes donde 'visible' es TRUE

    if (error) {
      console.error('Error al obtener los clientes:', error);
      return null;
    } else {
      return data; // Devuelve los clientes activos/visibles encontrados
    }
  }
  async getCliente(id: number) {
    const { data, error } = await this._supabaseClient
      .from('clientes')
      .select('id_cliente, nombre_cliente, direccion, telefono, email')
      .eq('id_cliente', id);

    if (error) {
      console.error('Error al obtener los clientes:', error);
      return null;
    } else {
      return data; // Devuelve las proyecciones encontradas
    }
  }
  async insertarCliente(
    nombre_cliente: string,
    direccion: string,
    telefono: string,
    email: string,
    id_usuario: number
  ) {
    const { data, error } = await this._supabaseClient
      .from('clientes')
      .insert([{ nombre_cliente, direccion, telefono, email, id_usuario }]);

    if (error) {
      console.error('Error al registrar cliente:', error.message);
      return null;
    }

    console.log('Cliente registrado:', data);
    return data;
  }
  async editarCliente(
    id: number,
    nombre_cliente: string,
    direccion: string,
    telefono: string,
    email: string
  ): Promise<any | null> {
    const { data, error }: { data: any; error: any } =
      await this._supabaseClient
        .from('clientes')
        .update({ nombre_cliente, direccion, telefono, email })
        .eq('id_cliente', id); // Asegúrate de filtrar correctamente por el identificador único, como el ID o email
  }
  /* async eliminarCliente(id: number): Promise<any | null> {
    const { data, error }: { data: any; error: any } =
      await this._supabaseClient.from('clientes').delete().eq('id_cliente', id); // Asegúrate de filtrar correctamente por el identificador único, como el ID o email
  } */
  async eliminarCliente(id: number): Promise<any | null> {
    const { data, error }: { data: any; error: any } =
      await this._supabaseClient
        .from('clientes')
        .update({ visible: false }) // Cambia el valor de la columna 'visible' a false
        .eq('id_cliente', id); // Filtra el registro por el 'id_cliente' proporcionado

    if (error) {
      console.error(
        'Error al realizar la eliminación suave del cliente:',
        error
      );
      return null; // O puedes manejar el error de otra forma
    }

    return data; // Devuelve los datos de la actualización (o null si hubo un error)
  }
  //#endregion
  //#region servicios
  async getServicios(id_usuario: number,servicio:string): Promise<Servicio[]> {
    const { data, error } = await this._supabaseClient
      .from('servicios')
      .select('*')
      .eq('id_usuario', id_usuario)
      .eq('visible', true)
      .eq('tipo', servicio);


    if (error) {
      console.error('Error al obtener los servicios:', error);
      // array vacío tipado como Servicio[]
      return [] as Servicio[];
    }

    // aseguramos que data sea un array de Servicio
    return (data ?? []) as Servicio[];
  }
  async getServicio(id: number): Promise<Servicio> {
    const { data, error } = await this._supabaseClient
      .from('servicios')
      .select('*')
      .eq('id_servicio', id)
      .single();

    if (error) {
      console.error('Error al obtener el servicio:', error);
      // Devolvemos un objeto Servicio con valores por defecto
      return {
        id: 0,
        id_cliente: 0,
        nombre_cliente: '',
        id_usuario: 0,
        tipo: '',
        descripcion: '',
        costo: 0,
        cantidad: 0,
        unidad: 0,
        finalizado: false,
        visible: false,
        fecha: new Date(),
      };
    }

    // Mapear campos que difieren en el nombre
    return {
      id: data.id_servicio,
      id_cliente: data.id_cliente,
      nombre_cliente: data.nombre_cliente ?? '',
      id_usuario: data.id_usuario ?? 0,
      tipo: data.tipo_servicio ?? '',
      descripcion: data.descripcion ?? '',
      costo: data.costo ?? 0,
      cantidad: data.cantidad ?? 0,
      unidad: data.unidad ?? 0,
      finalizado: data.finalizada ?? false,
      visible: data.visible ?? false,
      fecha: data.fecha ? new Date(data.fecha) : new Date(),
    };
  }

  // Insertar un servicio
  async insertarServicio(
    id_cliente: number,
    id_usuario: number,
    tipo: string,
    descripcion: string,
    costo: number,
    cantidad: number
  ): Promise<any> {
    const { data, error } = await this._supabaseClient
      .from('servicios')
      .insert([
        {
          id_usuario,
          id_cliente,
          tipo,
          descripcion,
          costo,
          cantidad,
          unidad: 0,
          finalizado: false,
          visible: true,
          fecha: new Date().toISOString(),
        },
      ])
      .select()
      .single(); // obtiene el registro insertado

    if (error) {
      console.error('Error al insertar servicio:', error);
      throw error;
    }
    return data; // retorna el servicio con su id_servicio
  }

  async editarServicio(
    id_servicio: number,
    id_cliente: number,
    id_usuario: number,
    tipo: string,
    descripcion: string,
    costo: number,
    cantidad: number
  ): Promise<any | null> {
    const { data, error } = await this._supabaseClient
      .from('servicios')
      .update({
        id_servicio,
        id_cliente,
        id_usuario,
        tipo,
        descripcion,
        costo,
        cantidad,
        unidad: 0,
        finalizado: false,
        visible: true,
      })
      .eq('id_servicio', id_servicio);

    if (error) {
      console.error('Error al editar servicio:', error.message);
      return null;
    }
    return data;
  }

  // Soft delete: marcamos como no visible en lugar de borrar físicamente
  async eliminarServicio(id: number): Promise<any | null> {
    const { data, error } = await this._supabaseClient
      .from('servicios')
      .update({ visible: false })
      .eq('id_servicio', id);

    if (error) {
      console.error('Error al eliminar servicio:', error.message);
      return null;
    }
    return data;
  }
  //#endregion
  //#region tallas
  async getTallas(id_usuario: number): Promise<Tallas[]> {
    const { data, error } = await this._supabaseClient
      .from('tallas')
      .select('id_talla, talla, id_usuario, sexo, tipo, visible')
      .eq('visible', true)
      .eq('id_usuario', id_usuario); // ✅ solo tallas activas

    if (error) {
      console.error('Error al obtener las tallas:', error);
      return [];
    }

    // Ajustamos los nombres de campos al modelo `Tallas`
    return (
      data?.map((t: any) => ({
        id: t.id_talla,
        talla: t.talla,
        id_usuario: t.id_usuario,
        sexo: t.sexo,
        tipo: t.tipo,
      })) ?? null
    );
  }

  async getTalla(id: number): Promise<Tallas> {
    const { data, error } = await this._supabaseClient
      .from('tallas')
      .select('id_talla, talla, id_usuario,sexo,tipo')
      .eq('id_talla', id)
      .single(); // ✅ devuelve un único registro

    if (error) {
      console.error('Error al obtener la talla:', error);
      // Devolvemos un objeto Tallas vacío en caso de error para cumplir la firma
      return {
        id: 0,
        talla: '',
        id_usuario: 0,
        sexo: '',
        tipo: '',
      };
    }

    // Mapeamos directamente las propiedades del objeto `data`
    return {
      id: data.id_talla,
      talla: data.talla,
      id_usuario: data.id_usuario,
      sexo: data.sexo,
      tipo: data.tipo,
    };
  }
  async getTallaName(id: number): Promise<string> {
    const { data, error } = await this._supabaseClient
      .from('tallas')
      .select('talla')
      .eq('id_talla', id)
      .single(); // ✅ devuelve un único registro

    if (error) {
      console.error('Error al obtener la talla:', error);
      // Devolvemos un objeto Tallas vacío en caso de error para cumplir la firma
      return 'vacio';
    }

    // Mapeamos directamente las propiedades del objeto `data`
    return <string>data.talla || 'vacio';
  }

  async insertarTalla(
    talla: string,
    id_usuario: number,
    sexo: string,
    tipo: string
  ) {
    const { data, error } = await this._supabaseClient
      .from('tallas')
      .insert([{ talla, id_usuario, sexo, tipo, visible: true }]);

    if (error) {
      console.error('Error al registrar talla:', error.message);
      return null;
    }

    console.log('Talla registrada:', data);
    return data;
  }

  async editarTalla(
    id: number,
    talla: string,
    sexo: string,
    tipo: string
  ): Promise<any | null> {
    const { data, error } = await this._supabaseClient
      .from('tallas')
      .update({ talla, sexo, tipo })
      .eq('id_talla', id);

    if (error) {
      console.error('Error al editar talla:', error.message);
      return null;
    }
    return data;
  }

  // Soft delete: marcar visible = false
  async eliminarTalla(id: number): Promise<any | null> {
    const { data, error } = await this._supabaseClient
      .from('tallas')
      .update({ visible: false })
      .eq('id_talla', id);

    if (error) {
      console.error('Error al eliminar talla:', error.message);
      return null;
    }
    return data;
  }
  //#endregion
  //#region ServicioTallas
  // Insertar lista de tallas de un servicio
  async insertarServicioTallas(servicioTallas: Servicio_talla[]): Promise<any> {
    const payload = servicioTallas.map((st) => ({
      id_servicio: st.id_servicio,
      id_talla: st.id_talla,
      cantidad: st.cantidad,
      costo: st.costo,
    }));

    const { data, error } = await this._supabaseClient
      .from('servicio_tallas')
      .insert(servicioTallas);

    if (error) {
      console.error('Error al insertar servicio_tallas:', error);
      throw error;
    }

    return data;
  }
  async getServiciosDetalle(id_servicio: number): Promise<Servicio_talla[]> {
    const { data, error } = await this._supabaseClient
      .from('servicio_tallas')
      .select('*')
      .eq('id_servicio', id_servicio);

    if (error) {
      console.error('Error al recibir servicio_tallas:', error);
      throw error;
    }

    return data;
  }
 async editarServicioTallas(servicioTallas: any[]): Promise<any> {
  try {
    for (const st of servicioTallas) {
      if (st.id_servicio_talla) {
        // Ya existe -> UPDATE
        const { error } = await this._supabaseClient
          .from("servicio_tallas")
          .update({
            id_talla: st.id_talla,
            cantidad: st.cantidad,
            costo: st.costo,
          })
          .eq("id_servicio_talla", st.id_servicio_talla);

        if (error) {
          console.error(`Error al actualizar servicio_talla ${st.id_servicio_talla}:`, error);
          throw error;
        }
      } else {
        // Nuevo -> INSERT
        const { error } = await this._supabaseClient
          .from("servicio_tallas")
          .insert({
            id_servicio: st.id_servicio,
            id_talla: st.id_talla,
            cantidad: st.cantidad,
            costo: st.costo,
          });

        if (error) {
          console.error(`Error al insertar servicio_talla (id_talla: ${st.id_talla}):`, error);
          throw error;
        }
      }
    }

    return true;
  } catch (error) {
    console.error("Error general en editarServicioTallas:", error);
    throw error;
  }
}
async eliminarServicioTallas(id_servicio_talla: number): Promise<void> {
  try {
    const { data, error } = await this._supabaseClient
      .from('servicio_tallas')
      .delete()
      .eq('id_servicio_talla', id_servicio_talla);

    if (error) {
      console.error(`Error al eliminar las tallas del servicio ${id_servicio_talla}:`, error);
      throw error;
    }

    console.log(`Se eliminaron las tallas del servicio ${id_servicio_talla}`, data);
  } catch (error) {
    console.error('Error inesperado al eliminar servicio_tallas:', error);
    throw error;
  }
}



  //#endregion
  //#region Materiales
  async getMateriales(id_usuario: number) {
    const { data, error } = await this._supabaseClient
      .from('Inventario')
      .select('*')
      .eq('id_usuario', id_usuario)
      .eq('visible', true);

    if (error) {
      console.error('Error al obtener materiales:', error.message);
      return null;
    }
    return data;
  }

  // ✅ Obtener un material específico
  async getMaterial(id: number) {
    const { data, error } = await this._supabaseClient
      .from('Inventario')
      .select('*')
      .eq('id_inventario', id)
      .single();

    if (error) {
      console.error('Error al obtener material:', error.message);
      return null;
    }
    return data;
  }

  // ✅ Agregar un material
  async agregarMaterial(material: any, id_usuario: number) {
  // material debe incluir: id_usuario, id_servicio, descripcion, cantidad, metraje, costo
  const { data, error } = await this._supabaseClient
    .from('Inventario')
    .insert({
      descripcion: material.descripcion,
      cantidad: material.cantidad,
      metraje: material.metraje,
      costo: material.costo,
      id_usuario: id_usuario
    })
    .select();

  if (error) {
    console.error('Error al agregar material:', error.message);
    return null;
  }

  return data;
}


  // ✅ Actualizar un material
  async actualizarMaterial(material: any) {
    const { data, error } = await this._supabaseClient
      .from('Inventario')
      .update({
        descripcion: material.descripcion,
        cantidad: material.cantidad,
        metraje: material.metraje,
        costo: material.costo,
      })
      .eq('id_inventario', material.id_inventario)
      .select();

    if (error) {
      console.error('Error al actualizar material:', error.message);
      return null;
    }
    return data;
  }

  // ✅ Soft Delete (visible = false)
  async eliminarMaterial(id: number) {
    const { data, error } = await this._supabaseClient
      .from('Inventario')
      .update({ visible: false })
      .eq('id_inventario', id)
      .select();

    if (error) {
      console.error('Error al eliminar material:', error.message);
      return null;
    }
    return data;
  }

  
  //#endregion

  // ✅ Agregar producto
  async addProducto(producto: Producto) {
    const { data, error } = await this._supabaseClient.from('productos').insert([
      {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        imagenes: producto.imagenes, // array de strings base64
      },
    ]);

    if (error) throw error;
    return data;
  }

  async getPedidos(): Promise<Pedido[]> {
    const { data, error } = await this._supabaseClient
      .from('pedidos')
      .select('*');
      
    if (error) {
      console.error(error);
      return [];
    }

    return data as Pedido[];
  }
}
  