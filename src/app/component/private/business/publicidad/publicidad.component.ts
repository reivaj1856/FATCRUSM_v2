import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router, RouterLink } from "@angular/router";
import { AuthServiceStore } from '../../../../services/auth.service';
import { NotesService, Pedido, Tallas } from '../../../../data/data-access/data-access.service';
import { toast } from 'ngx-sonner';
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from '@angular/fire/firestore';
import { realService } from '../../../../services/reals.service';
import { ProductoTalla } from '../inventario/inventario.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../auth/data-access/auth.service';
import { DataAccessService, Venta } from '../../../../services/data-access.service';

@Component({
  selector: 'app-publicidad',
  imports: [NgIf,NgFor,CommonModule,FormsModule],
  templateUrl: './publicidad.component.html',
  styleUrl: './publicidad.component.css'
})
export default class PublicidadComponent {
  ventas: Venta[] = [];
  pedidos: Pedido[] = [];
  id_usuario: number = -1;
  tallaSeleccionada: Tallas | null = null;
  listaTallas: Tallas[] = []; // tu lista de tallas
  mostrarModalProducto = false;
  private _authService = inject(AuthService);
  private _authState = inject(AuthServiceStore);
  private _router = inject(Router);
  private noteservice = inject(NotesService);
  listaProductos: any[] = [];
  productoSeleccionado: any = null;
  cargando = false;
  private realService = inject(realService);
  private dataAccessService = inject(DataAccessService);
  productosPublicados: any[] = [];

  showModal = false;
  modoEdicion = false;

  nombreProducto = '';
  descripcionProducto = '';
  imagenesSeleccionadas: string[] = [];
  tallasSeleccionadas: any[] = [];
  productoActual: any = null;

  async ngOnInit() {
    this.id_usuario = (await this._authService.getUserId()) ?? -1;
    await this.loadTallas(this.id_usuario);
    await this.cargarProductosPublicados();
    await this.cargarProductosNoPublicados();
    console.log(this.listaProductos);
    this.ventas = await this.dataAccessService.getVentas();
    await this.cargarPedidos();
  }

  async loadTallas(id: number) {
    try {
      this.listaTallas = await this.noteservice.getTallas(id);
    } catch {
      toast.error('Error al cargar tallas');
    }
  }

  // 🔹 Cargar productos publicados
  async cargarProductosPublicados() {
    try {
      const { data: productos, error } = await this.noteservice._supabaseClient
        .from('productos')
        .select('id, nombre, descripcion, imagenes, publicado, id_usuario')
        .eq('publicado', true)
        .eq('id_usuario', this.id_usuario); // ✅ solo del usuario actual

      if (error) throw error;

      const lista = [];

      for (const p of productos) {
        const { data: tallas } = await this.noteservice._supabaseClient
          .from('producto_tallas')
          .select('precio, cantidad, id_usuario')
          .eq('id_producto', p.id)
          .eq('id_usuario', this.id_usuario); // ✅ solo del usuario

        lista.push({
          ...p,
          estado: 'Publicado',
          descripcion: p.descripcion,
          tallas: tallas || [],
        });
      }

      this.productosPublicados = lista;
    } catch (err) {
      console.error(err);
      toast.error('Error al cargar productos publicados');
    }
  }
  // 🔹 Abrir modal para editar
  editarProducto(producto: any) {
    this.modoEdicion = true;
    this.showModal = true;
    this.productoSeleccionado = producto;

    this.nombreProducto = producto.nombre;
    this.descripcionProducto = producto.descripcion;
    this.imagenesSeleccionadas = producto.imagenes || [];

    // Cargar tallas asociadas
    this.cargarTallasProducto(producto.id);
  }

  async cargarTallasProducto(id_producto: number) {
    try {
      const { data, error } = await this.noteservice._supabaseClient
        .from('producto_tallas')
        .select('id_talla, nombre, cantidad, precio, tipo, sexo')
        .eq('id_producto', id_producto);

      if (error) throw error;

      this.tallasSeleccionadas = data.map(t => ({
        id_talla: t.id_talla,
        nombre: t.nombre,
        cantidad: t.cantidad,
        precio: t.precio,
        tipo: t.tipo,
        sexo: t.sexo,
      }));

    } catch (err) {
      console.error('Error al cargar tallas del producto:', err);
    }
  }

  // 🔹 Eliminar producto
  async eliminarProducto(id_producto: number) {
    const confirmar = confirm('🗑️ ¿Seguro que deseas despublicar y eliminar este producto de Firebase?');
    if (!confirmar) return;

    try {
      // Buscar documento en Firebase filtrando por id_usuario
      const q = query(this.realService._collection, 
        where('id_producto', '==', id_producto),
        where('id_usuario', '==', this.id_usuario) // ✅ solo documentos del usuario
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        for (const docSnap of snapshot.docs) {
          await deleteDoc(docSnap.ref);
          console.log(`🗑️ Producto eliminado de Firebase: ${docSnap.id}`);
        }
      } else {
        console.warn('⚠️ No se encontró el producto en Firebase para este usuario.');
      }

      // Actualizar el estado a no publicado en Supabase
      const { error } = await this.noteservice._supabaseClient
        .from('productos')
        .update({ publicado: false })
        .eq('id', id_producto)
        .eq('id_usuario', this.id_usuario); // ✅ solo del usuario

      if (error) throw error;

      toast.success('✅ Producto despublicado y eliminado correctamente.');
      await this.cargarProductosPublicados();
      await this.cargarProductosNoPublicados();
    } catch (err) {
      console.error(err);
      toast.error('❌ Error al despublicar el producto.');
    }
  }

  // 🔹 Cerrar modal
  closeModal() {
    this.showModal = false;
    this.modoEdicion = false;
    this.productoActual = null;
  }

  // 🔹 Guardar cambios
  async guardarProducto() {
  if (!this.nombreProducto.trim()) {
    toast.error('El nombre del producto es obligatorio.');
    return;
  }

  try {
    console.log('Guardando producto:' + (this.modoEdicion ? 'Actualizando' : 'Creando'), this.productoSeleccionado);
    if (this.modoEdicion && this.productoSeleccionado) {
      // 🟢 ACTUALIZAR PRODUCTO EXISTENTE
      const { error: updateError } = await this.noteservice._supabaseClient
        .from('productos')
        .update({
          nombre: this.nombreProducto,
          descripcion: this.descripcionProducto,
          imagenes: this.imagenesSeleccionadas,
        })
        .eq('id', this.productoSeleccionado.id);

      if (updateError) throw updateError;

      // eliminar tallas antiguas y volver a insertar
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
      }));

      const { error: tallasError } = await this.noteservice._supabaseClient
        .from('producto_tallas')
        .insert(nuevasTallas);

      if (tallasError) throw tallasError;

      toast.success('Producto actualizado correctamente.');
    } else {
      // 🟣 CREAR NUEVO PRODUCTO
      const { data: productoData, error: productoError } = await this.noteservice._supabaseClient
        .from('productos')
        .insert([
          {
            nombre: this.nombreProducto,
            descripcion: this.descripcionProducto,
            imagenes: this.imagenesSeleccionadas,
          },
        ])
        .select('*');

      if (productoError) throw productoError;

      const id_producto = productoData?.[0]?.id;

      // insertar tallas relacionadas
      const tallasToInsert = this.tallasSeleccionadas.map(t => ({
        nombre: t.nombre,
        cantidad: t.cantidad,
        precio: t.precio,
        tipo: t.tipo,
        sexo: t.sexo,
        id_talla: t.id_talla,
        id_producto: id_producto,
      }));
      console.log('Tallas a insertar:', tallasToInsert);
      const { error: tallasError } = await this.noteservice._supabaseClient
        .from('producto_tallas')
        .insert(tallasToInsert);

      if (tallasError) throw tallasError;

      toast.success('Producto guardado correctamente.');
    }

    // recargar lista y cerrar modal
    await this.cargarProductosConTallas();
    this.closeModal();

    } catch (error) {
      console.error(error);
      toast.error('Error al guardar el producto.');
    }
  }

  async logOut(){
    await this._authState.cerrarSesion();
    
  }

  abrirModalProducto(): void {
    this.mostrarModalProducto = true;
  }

  cerrarModalProducto(): void {
    this.mostrarModalProducto = false;
  }

  passWeb() {
    this._router.navigateByUrl('authStore');
  }

  // ==============================
  // LISTA TEMPORAL DE PUBLICIDAD
  // ==============================
  publicidades = [
    {
      titulo: 'Confección de Trajes Personalizados',
      descripcion: 'Diseños exclusivos hechos a medida',
      imagen: 'https://cdn-icons-png.flaticon.com/512/1685/1685485.png'
    },
    {
      titulo: 'Poleras y Chaquetas',
      descripcion: 'Ropa casual y deportiva para toda ocasión',
      imagen: 'https://cdn-icons-png.flaticon.com/256/545/545485.png'
    }
  ];

  // 🔹 Obtener productos no publicados de Supabase
  async cargarProductosNoPublicados() {
    this.cargando = true;
    try {
      const { data: productos, error } = await this.noteservice._supabaseClient
        .from('productos')
        .select('id, nombre, descripcion, imagenes, publicado, id_usuario')
        .eq('publicado', false)
        .eq('id_usuario', this.id_usuario); // ✅ solo del usuario

      if (error) throw error;

      const productosConTallas = [];
      for (const p of productos) {
        const { data: tallas } = await this.noteservice._supabaseClient
          .from('producto_tallas')
          .select('id_talla, nombre, cantidad, precio, tipo, sexo, id_usuario')
          .eq('id_producto', p.id)
          .eq('id_usuario', this.id_usuario); // ✅ solo del usuario

        productosConTallas.push({
          ...p,
          tallas: tallas || [],
        });
      }

      this.listaProductos = productosConTallas;
    } catch (err) {
      console.error(err);
      toast.error('Error al cargar productos no publicados');
    } finally {
      this.cargando = false;
    }
  }

  // 🔹 Publicar un producto en Firebase
  async publicarProducto(producto: any) {
    try {
      const docRef = await addDoc(this.realService._collection, {
        id_producto: producto.id,
        id_usuario: this.id_usuario, // ✅ guardamos el usuario
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        imagenes: producto.imagenes,
        tallas: producto.tallas,
        hombre: false,
        mujer: false,
        niño: false,
        ofertas: false,
      });

      console.log('Producto publicado con ID:', docRef.id);

      // marcar como publicado en Supabase
      const { error: updateError } = await this.noteservice._supabaseClient
        .from('productos')
        .update({ publicado: true })
        .eq('id', producto.id)
        .eq('id_usuario', this.id_usuario); // ✅ solo del usuario actual

      if (updateError) throw updateError;

      toast.success('Producto publicado correctamente');
      this.cargarProductosNoPublicados();
      this.cargarProductosPublicados(); // 🔄 actualizar lista de publicados
    } catch (error) {
      console.error(error);
      toast.error('Error al publicar el producto');
    }
  }
  handleFileInput(event: any) {
    const files: FileList = event.target.files;
    if (!files) return;

    // Limitar a 5 imágenes
    const total = Math.min(files.length, 5);
    this.imagenesSeleccionadas = [];

    for (let i = 0; i < total; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenesSeleccionadas.push(e.target.result);
      };
      reader.readAsDataURL(file); // convierte a base64
    }
  }
  getTipoSexoPorTalla(id_talla: number) {
    const talla = this.listaTallas?.find(t => t.id === id_talla);

    return {
      tipo: talla?.tipo ?? '',
      sexo: talla?.sexo ?? ''
    };
  }
  eliminarTallaSeleccionada(id_talla: number) {
    this.tallasSeleccionadas = this.tallasSeleccionadas.filter(t => t.id_talla !== id_talla);
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
          sexo: talla.sexo
        });
      }
  }
  async cargarProductosConTallas() {
  try {
    // 1️⃣ Traemos todos los productos
    const { data: productos, error: errorProductos } = await this.noteservice._supabaseClient
      .from('productos')
      .select('id, nombre, descripcion, imagenes');

    if (errorProductos) throw errorProductos;

    // 2️⃣ Traemos todas las tallas
    const { data: tallas, error: errorTallas } = await this.noteservice._supabaseClient
      .from('producto_tallas')
      .select('*'); // traer todas las tallas (sin filtrar por id_producto aquí)
      
    if (errorTallas) throw errorTallas;

    // 3️⃣ Unimos productos + tallas
    const productosConTallas = productos.map((p: any) => {
      // tallas de este producto
      const tallasProducto = tallas.filter(t => t.id_producto === p.id);

      // nombres únicos de tallas (ej: M, L, S)
      const nombresTallas = tallasProducto.map(t => t.nombre);

      // suma total de cantidades
      const totalCantidad = tallasProducto.reduce((acc, t) => acc + Number(t.cantidad || 0), 0);
        console.log('Productos obtenidos:', p);
      return {
        id: p.id,
        nombre: p.nombre,
        descripcion: p.descripcion  ,
        tallas: nombresTallas.length ? `{ ${nombresTallas.join(', ')} }` : '—',
        cantidadTotal: totalCantidad,
        imagen: p.imagenes && p.imagenes.length > 0 ? p.imagenes[0] : null 
      };
      });

      console.log('Productos con tallas:', productosConTallas);
      this.listaProductos = productosConTallas; // 👈 úsalo en tu *ngFor

    } catch (error) {
      console.error('Error al cargar productos con tallas:', error);
    }
  }
  async cargarPedidos() {
    this.pedidos = await this.noteservice.getPedidos();
  }
  

}
