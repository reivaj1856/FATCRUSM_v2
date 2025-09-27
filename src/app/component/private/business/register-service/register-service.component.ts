import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotesService } from '../../../../data/data-access/data-access.service';
import { AuthService } from '../../../../auth/data-access/auth.service';
import { toast } from 'ngx-sonner';
import { Location } from '@angular/common';


export interface User {
  id_usuario?: number;
  empresa: string;
  nombre_trabajador: string;
  visible: boolean;
  email: string;
}

export interface Cliente {
  id?: number;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
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

@Component({
  selector: 'app-register-service',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register-service.component.html',
  styleUrl: './register-service.component.css',
})
export default class RegisterServiceComponent implements OnInit {
  private noteservice = inject(NotesService);
  private _authService = inject(AuthService);
  private usuariologueado: User | null = null;
  private router = inject(Router);
  listaClientes: Cliente[] | null = null;
  listaTallas: Tallas[] = [];
  tallasServicios: Servicio_talla[] = [];
  tallaSelect: Tallas = {
    id: 0,
    talla: '',
    id_usuario: 0,
    sexo: '',
    tipo: '',
  };
  showModal = false;
  id_usuario: number = -1;

  id: number = -1;
  servicio: string = '';
  constructor(private route: ActivatedRoute,private location: Location) {}

  async ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.id = +params['id'];
      this.servicio = params['servicio'];
      console.log(this.id);
      console.log(this.servicio);
    });
    this.id_usuario = (await this._authService.getUserId()) ?? -1;
    this.getClientes();
    this.loadTallas(this.id_usuario);
  }

  async loadTallas(id: number) {
    try {
      this.listaTallas = await this.noteservice.getTallas(id);
    } catch (error) {
      toast.error('Error al cargar tallas');
    }
  }
  clientes: Cliente[] | null = this.listaClientes;

  tallas: Tallas[] | null = this.listaTallas;

  selectedTalla: number | null = 0;

  formData = {
    clienteId: 0,
    descripcion: '',
    costo: 0,
    cantidad: 0,
    unidad: 0,
    tallas: [] as Servicio_talla[],
  };

  mostrarCampo(campo: string): boolean {
  if (this.servicio === 'costura') {
    return ['descripcion', 'costo', 'talla'].includes(campo);
  }
  if (this.servicio === 'bordado') {
    return ['descripcion', 'costo', 'talla'].includes(campo);
  }
  if (this.servicio === 'sublimacion') {
    return ['descripcion', 'costo', 'unidad'].includes(campo);
  }
  if (this.servicio === 'vinilado') {
    return ['descripcion', 'costo', 'unidad'].includes(campo);
  }
  if (this.servicio === 'otros') {
    return ['descripcion', 'costo', 'cantidad', 'unidad', 'talla'].includes(campo);
  }
  return false;
}

mostrarListaTallas(): boolean {
  return this.servicio === 'costura' || this.servicio === 'otros' || this.servicio === 'bordado';
}

  removeTalla(index: number) {
    this.formData.tallas.splice(index, 1);
  }

  getTallaName() {
    return this.noteservice.getTallaName(this.selectedTalla ?? 0);
  }

  generarCostoMetraje(){

  }

  generarCosto() {
    // Calcular el total multiplicando cantidad * costo
    const total = this.tallasServicios.reduce((acum, item) => {
      return acum + item.cantidad * item.costo;
    }, 0);

    // Guardar en tu formData
    this.formData.costo = total;
  }

  async guardarServicio() {
    try {
      // 1. Guardar el servicio (aquí pasas los datos que tengas)
      const nuevoServicio = await this.noteservice.insertarServicio(
        // ejemplo
        this.formData.clienteId,
        this.id_usuario,
        this.servicio,
        this.formData.descripcion,
        this.formData.costo,
        this.formData.cantidad
      );
      // 2. Preparar las tallas asociadas
      const servicioTallas = this.tallasServicios.map((item) => ({
        id_servicio: nuevoServicio.id_servicio, // clave foránea
        id_talla: item.id_talla,
        cantidad: item.cantidad,
        costo: item.costo,
      }));
      console.log(this.tallasServicios);
      // 3. Insertar las tallas
      await this.noteservice.insertarServicioTallas(servicioTallas);

      console.log('Servicio y tallas guardados correctamente');
      toast.success('Servicio guardado con sus tallas');
      this.location.back();
    } catch (error) {
      console.error('Error al guardar servicio:', error);
      toast.error('No se pudo guardar el servicio');
    }
  }

  async getClientes() {
    const rawClientes = await this.noteservice.getClientes(this.id_usuario);
    this.listaClientes = rawClientes
      ? rawClientes.map((c: any) => ({
          id: c.id_cliente,
          nombre: c.nombre_cliente ? c.nombre_cliente : 'No defininido',
          direccion: c.direccion ? c.direccion : 'No defininido',
          telefono: c.telefono ? c.telefono : 'No defininido',
          email: c.email ? c.email : 'No defininido',
          visible: c.visible,
        }))
      : null;
  }

  servicioTallas: Servicio_talla[] = [];
  selectedTallaId: string = '';
  onTallaChange(fila: Servicio_talla, id: number) {
    fila.id_talla = id;
    console.log('Fila actualizada con id_talla:', fila.id_talla);
  }

  getNameTalla(selectedTalla: number) {
    this.noteservice.getTalla(selectedTalla).then((data) => {
      this.tallaSelect = data;
    });
  }

  // Método para agregar una nueva fila
  async agregarTalla() {
    if (this.selectedTalla) {
      try {
        // Trae la talla seleccionada desde el servicio
        const tallaSelect = await this.noteservice.getTalla(this.selectedTalla);

        if (tallaSelect) {
          // Crear un objeto Servicio_talla con la info de la talla
          const nuevaTalla: Servicio_talla = {
            id_servicio: this.id, // el id del servicio actual
            id_talla: tallaSelect.id || 0, // id de la talla seleccionada
            nombre: tallaSelect.talla, // nombre de la talla seleccionada
            cantidad: 0, // inicializar en 0
            costo: 0, // inicializar en 0
          };

          // Agregarlo a la lista
          this.tallasServicios.push(nuevaTalla);
        }
      } catch (error) {
        toast.error('Error al obtener la talla');
        console.error(error);
      }
    } else {
      toast.error('Debes seleccionar una talla');
    }
  }

  // Método para eliminar una fila
  eliminarTalla(index: number) {
    this.tallasServicios.splice(index, 1);
    this.generarCosto();
  }
}
