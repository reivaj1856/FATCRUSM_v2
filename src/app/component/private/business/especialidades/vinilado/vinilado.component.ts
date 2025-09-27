import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotesService } from '../../../../../data/data-access/data-access.service';
import { AuthService } from '../../../../../auth/data-access/auth.service';
import { toast } from 'ngx-sonner';
import { Router, RouterLink } from '@angular/router';

export interface User {
  empresa: string;
  nombre_trabajador: string;
  visible: boolean;
  email: string;
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
export interface Cliente {
  id?: number;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
}

@Component({
  selector: 'app-vinilado',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './vinilado.component.html',
  styleUrl: './vinilado.component.css'
})
export default class ViniladoComponent {
  private noteservice = inject(NotesService);
  private _authService = inject(AuthService);
  private router = inject(Router);
  listaPedidos: Servicio[] = [];
  servicioSelect: Servicio | null = {
    id_servicio: 0,
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
  private usuariologueado: User | null = null;
  id_usuario: number = -1;

  async ngOnInit() {
    this.id_usuario = (await this._authService.getUserId()) ?? -1;
    this.getpedidos();
  }

  createModal = false;

  showModal = false;

  abrirregisterModal() {
    this.createModal = true;
  }

  cerrarRegisterModal() {
    this.createModal = false;
    this.getpedidos();
  }

  abrirModal(id_cliente: number) {
    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;
  }

  async eliminarPedido(id: number) {
    const result = await this.noteservice.eliminarServicio(id);
    toast.success('Cliente eliminado con éxito');
    this.cerrarModal();
    this.getpedidos();
  }

  async getPedido(id: number) {}

  async getpedidos(): Promise<void> {
  // Obtenemos los servicios
  const rawServicios = await this.noteservice.getServicios(
    this.id_usuario,
    'vinilado'
  );

  // Iteramos cada servicio para obtener el cliente correspondiente
  this.listaPedidos = await Promise.all(
    (rawServicios ?? []).map(async (servicio: Servicio) => {
      let clienteNombre = '';

      if (servicio.id_cliente) {
        const clienteData = await this.noteservice.getClienteName(servicio.id_cliente);
        if (Array.isArray(clienteData) && clienteData.length > 0) {
          clienteNombre = clienteData[0].nombre_cliente;
        } else if (typeof clienteData === 'string') {
          clienteNombre = clienteData;
        }
      }

      return {
        ...servicio,
        nombre_cliente: clienteNombre,
        fecha: new Date(servicio.fecha),
      };
    })
  );

  console.log(this.listaPedidos);
  console.log("aca");
}
}

