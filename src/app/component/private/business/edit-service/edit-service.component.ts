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
  id_servicio_talla?: number;
  id_servicio: number;
  id_talla: number;
  cantidad: number;
  costo: number;
  nombre?: string;
}

export interface Servicio {
  id_servicio?: number;
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

@Component({
  selector: 'app-edit-service',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-service.component.html',
  styleUrl: './edit-service.component.css',
})
export default class EditServiceComponent implements OnInit {
  private noteservice = inject(NotesService);
  private _authService = inject(AuthService);
  private usuariologueado: User | null = null;
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

  servicioSelect: Servicio = {} as Servicio;

  clientes: Cliente[] | null = this.listaClientes;

  tallas: Tallas[] | null = this.listaTallas;

  selectedTalla: number | null = 0;

  formData = {
    clienteId: 0,
    descripcion: '',
    tipo: '',
    costo: 0,
    cantidad: 0,
    tallas: [] as Servicio_talla[],
  };

  constructor(private route: ActivatedRoute, private router: Router,private location: Location) {}

  async ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.id = +params['id'];
      this.servicio = params['servicio'];
      console.log(this.id);
      console.log(this.servicio);
    });
    this.id_usuario = (await this._authService.getUserId()) ?? -1;
    this.servicioSelect = await this.noteservice.getServicio(this.id);
    this.getClientes();
    this.loadTallas(this.id_usuario);
    console.log(this.formData);

    this.formData = {
      clienteId: this.servicioSelect.id_cliente,
      descripcion: this.servicioSelect.descripcion,
      tipo: this.servicio,
      costo: this.servicioSelect.costo,
      cantidad: this.servicioSelect.cantidad,
      tallas: [] as Servicio_talla[],
    };
    this.getServiciosDetalle();
    
  }

  async loadTallas(id: number) {
    try {
      this.listaTallas = await this.noteservice.getTallas(id);
    } catch (error) {
      toast.error('Error al cargar tallas');
    }
  }

  getTallaName() {
    return this.noteservice.getTallaName(this.selectedTalla ?? 0);
  }

  generarCosto() {
    // Calcular el total multiplicando cantidad * costo
    const total = this.tallasServicios.reduce((acum, item) => {
      return acum + item.cantidad * item.costo;
    }, 0);

    // Guardar en tu formData
    this.formData.costo = total;
  }

  async actualizarServicio() {
    try {
      
      // 1. Guardar el servicio (aquí pasas los datos que tengas)
      const nuevoServicio = await this.noteservice.editarServicio(
        this.id,
        this.formData.clienteId,
        this.id_usuario,
        this.formData.tipo,
        this.formData.descripcion,
        this.formData.costo,
        this.formData.cantidad
      );
      // 2. Preparar las tallas asociadas
      const servicioTallas = this.tallasServicios.map((item) => ({
        id_servicio_talla: item.id_servicio_talla,
        id_servicio: this.id, // clave foránea
        id_talla: item.id_talla,
        cantidad: item.cantidad,
        costo: item.costo,
      }));
      console.log(servicioTallas);
      // 3. Insertar las tallas
      await this.noteservice.editarServicioTallas(servicioTallas); 
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
  eliminarServicio(index: number) {
    this.noteservice.eliminarServicio(index);
  }
  async eliminarTalla(index: number) {
  try {
    const talla = this.tallasServicios[index];

    if (talla.id_servicio_talla) {
      // Esperar a que se elimine en la base de datos
      await this.noteservice.eliminarServicioTallas(talla.id_servicio_talla);

      // Eliminar de la lista local para actualizar la UI
      this.tallasServicios.splice(index, 1);
    } else {
      // Solo eliminar de la lista local
      this.tallasServicios.splice(index, 1);
    }

    // Recalcular costos
    this.generarCosto();

  } catch (error) {
    console.error('Error al eliminar la talla:', error);
    toast.error('No se pudo eliminar la talla');
  }
}

  async getServiciosDetalle() {
  // 1. Traer las tallas del servicio
  this.tallasServicios = await this.noteservice.getServiciosDetalle(
    this.id
  );
  console.log(this.servicioSelect.id_servicio);


  // 2. Asignar el nombre de cada talla (si getTallaName es async)
  this.tallasServicios = await Promise.all(
    this.tallasServicios.map(async (element) => {
      return {
        ...element,
        nombre: await this.noteservice.getTallaName(element.id_talla),
      };
    })
  );
}


}
