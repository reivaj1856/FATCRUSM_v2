import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { NotesService, Tallas } from '../../../../data/data-access/data-access.service';
import { FormsModule, NgModel } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { AuthService } from '../../../../auth/data-access/auth.service';

export interface ProductoTalla {
  id_talla?: number;
  nombre: string;
  cantidad: number;
  precio: number;
  tipo?: string;
  sexo?: string;
  id_producto?: number;
  id_usuario?: number; // ✅ nuevo campo
}

export interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  tallas: number[];
  imagenes: string[];
  id_usuario?: number; // ✅ nuevo campo
}


@Component({
  selector: 'app-inventario',
  imports: [NgIf,NgFor,CommonModule,FormsModule],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export default class InventarioComponent {
  tallaSeleccionada: Tallas | null = null;
  listaTallas: Tallas[] = [];
  showModal = false;
  private _authService = inject(AuthService);

  nombreProducto = '';
  descripcionProducto = '';
  tallasSeleccionadas: ProductoTalla[] = [];
  id_usuario: number = -1;
  productoSeleccionado: any = null;
  modoEdicion: boolean = false;

  listaProductos: any[] = [];
  listaRopa: any[] = [];
  imagenesSeleccionadas: string[] = [];

  constructor(private noteservice: NotesService) {}

  async ngOnInit() {
    this.id_usuario = (await this._authService.getUserId()) ?? -1;
    await this.loadTallas(this.id_usuario);
    await this.cargarProductosConTallas();
  }

  async loadTallas(id: number) {
    try {
      this.listaTallas = await this.noteservice.getTallas(id);
    } catch {
      toast.error('Error al cargar tallas');
    }
  }

  openModal() {
    if (!this.listaTallas || this.listaTallas.length === 0) {
      toast.error('Por favor, primero registre las tallas disponibles.');
      return;
    }
    this.showModal = true;
    this.modoEdicion = false;
    this.nombreProducto = '';
    this.descripcionProducto = '';
    this.tallasSeleccionadas = [];
  }

  closeModal() {
    this.showModal = false;
    this.modoEdicion = false;
    this.productoSeleccionado = null;
    this.nombreProducto = '';
    this.descripcionProducto = '';
    this.tallasSeleccionadas = [];
    this.imagenesSeleccionadas = [];
  }

  agregarTalla(talla: ProductoTalla | null) {
    if (!talla) return;
    const existe = this.tallasSeleccionadas.find(t => t.nombre === talla.nombre);
    if (!existe) {
      this.tallasSeleccionadas.push({
        id_talla: talla.id_talla,
        nombre: talla.nombre,
        cantidad: 0,
        precio: 0,
        tipo: talla.tipo,
        sexo: talla.sexo,
        id_usuario: this.id_usuario, // ✅ guardamos usuario también
      });
    }
  }

  getTipoSexoPorTalla(id_talla: number) {
    const talla = this.listaTallas?.find(t => t.id === id_talla);
    return { tipo: talla?.tipo ?? '', sexo: talla?.sexo ?? '' };
  }

  eliminarTallaSeleccionada(id_talla: number) {
    this.tallasSeleccionadas = this.tallasSeleccionadas.filter(t => t.id_talla !== id_talla);
  }

  // ✅ GUARDAR O ACTUALIZAR PRODUCTO
  async guardarProducto() {
    if (!this.nombreProducto.trim()) {
      toast.error('El nombre del producto es obligatorio.');
      return;
    }

    try {
      if (this.modoEdicion && this.productoSeleccionado) {
        // 🔄 Actualizar producto existente
        const { error: updateError } = await this.noteservice._supabaseClient
          .from('productos')
          .update({
            nombre: this.nombreProducto,
            descripcion: this.descripcionProducto,
            imagenes: this.imagenesSeleccionadas,
          })
          .eq('id', this.productoSeleccionado.id)
          .eq('id_usuario', this.id_usuario); // ✅ restringido al usuario

        if (updateError) throw updateError;

        await this.noteservice._supabaseClient
          .from('producto_tallas')
          .delete()
          .eq('id_producto', this.productoSeleccionado.id);

        const nuevasTallas = this.tallasSeleccionadas.map(t => ({
          id_producto: this.productoSeleccionado.id,
          id_talla: t.id_talla,
          nombre: t.nombre,
          cantidad: t.cantidad,
          precio: t.precio,
          tipo: t.tipo,
          sexo: t.sexo,
          id_usuario: this.id_usuario, // ✅ nuevo
        }));

        const { error: tallasError } = await this.noteservice._supabaseClient
          .from('producto_tallas')
          .insert(nuevasTallas);

        if (tallasError) throw tallasError;
        toast.success('Producto actualizado correctamente.');
      } else {
        // 🆕 Crear nuevo producto
        const { data: productoData, error: productoError } = await this.noteservice._supabaseClient
          .from('productos')
          .insert([
            {
              nombre: this.nombreProducto,
              descripcion: this.descripcionProducto,
              imagenes: this.imagenesSeleccionadas,
              id_usuario: this.id_usuario, // ✅ nuevo
            },
          ])
          .select('*');

        if (productoError) throw productoError;
        const id_producto = productoData?.[0]?.id;

        const tallasToInsert = this.tallasSeleccionadas.map(t => ({
          nombre: t.nombre,
          cantidad: t.cantidad,
          precio: t.precio,
          tipo: t.tipo,
          sexo: t.sexo,
          id_talla: t.id_talla,
          id_producto,
          id_usuario: this.id_usuario, // ✅ nuevo
        }));

        const { error: tallasError } = await this.noteservice._supabaseClient
          .from('producto_tallas')
          .insert(tallasToInsert);

        if (tallasError) throw tallasError;
        toast.success('Producto guardado correctamente.');
      }

      await this.cargarProductosConTallas();
      this.closeModal();
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar el producto.');
    }
  }

  handleFileInput(event: any) {
    const files: FileList = event.target.files;
    if (!files) return;
    const total = Math.min(files.length, 5);
    this.imagenesSeleccionadas = [];
    for (let i = 0; i < total; i++) {
      const reader = new FileReader();
      reader.onload = e => this.imagenesSeleccionadas.push((e as any).target.result);
      reader.readAsDataURL(files[i]);
    }
  }

  editarPrenda(producto: any) {
    this.productoSeleccionado = producto;
    this.modoEdicion = true;
    this.showModal = true;
    this.nombreProducto = producto.nombre;
    this.descripcionProducto = producto.descripcion;
    this.imagenesSeleccionadas = producto.imagenes;
    this.cargarTallasProducto(producto.id);
  }

  async cargarTallasProducto(id_producto: number) {
    try {
      const { data, error } = await this.noteservice._supabaseClient
        .from('producto_tallas')
        .select('id_talla, nombre, cantidad, precio, tipo, sexo')
        .eq('id_producto', id_producto)
        .eq('id_usuario', this.id_usuario); // ✅ restringido al usuario

      if (error) throw error;
      this.tallasSeleccionadas = data || [];
    } catch (err) {
      console.error('Error al cargar tallas del producto:', err);
    }
  }

  async cargarProductosConTallas() {
    try {
      const { data: productos, error: errorProductos } = await this.noteservice._supabaseClient
        .from('productos')
        .select('id, nombre, descripcion, imagenes')
        .eq('id_usuario', this.id_usuario); // ✅ solo del usuario

      if (errorProductos) throw errorProductos;

      const { data: tallas, error: errorTallas } = await this.noteservice._supabaseClient
        .from('producto_tallas')
        .select('*')
        .eq('id_usuario', this.id_usuario); // ✅ solo del usuario

      if (errorTallas) throw errorTallas;

      this.listaProductos = productos.map(p => {
        const tallasProducto = tallas.filter(t => t.id_producto === p.id);
        const nombresTallas = tallasProducto.map(t => t.nombre);
        const totalCantidad = tallasProducto.reduce((acc, t) => acc + Number(t.cantidad || 0), 0);
        return {
          id: p.id,
          nombre: p.nombre,
          descripcion: p.descripcion,
          tallas: nombresTallas.length ? `{ ${nombresTallas.join(', ')} }` : '—',
          cantidadTotal: totalCantidad,
          imagen: p.imagenes && p.imagenes.length > 0 ? p.imagenes[0] : null,
        };
      });
    } catch (error) {
      console.error('Error al cargar productos con tallas:', error);
    }
  }
  async eliminarPrenda(id_producto: number) {
  const confirmar = confirm('🗑️ ¿Estás seguro de eliminar este producto y todas sus tallas?');
  if (!confirmar) return;

  try {
    // 1️⃣ Eliminar las tallas asociadas
    const { error: errorTallas } = await this.noteservice._supabaseClient
      .from('producto_tallas')
      .delete()
      .eq('id_producto', id_producto);

    if (errorTallas) throw errorTallas;

    // 2️⃣ Eliminar el producto principal
    const { error: errorProducto } = await this.noteservice._supabaseClient
      .from('productos')
      .delete()
      .eq('id', id_producto);

    if (errorProducto) throw errorProducto;

    // 3️⃣ Actualizar la lista en pantalla
    this.listaProductos = this.listaProductos.filter(p => p.id !== id_producto);

    // 4️⃣ Notificación
    toast.success('✅ Producto eliminado correctamente.');
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    toast.error('❌ Ocurrió un error al eliminar el producto.');
  }
}
}

  


