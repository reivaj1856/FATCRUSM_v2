import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotesService } from '../../../../../data/data-access/data-access.service';
import { AuthService } from '../../../../../auth/data-access/auth.service';
import { toast } from 'ngx-sonner';
import { RouterLink } from '@angular/router';

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
  selector: 'app-material',
  imports: [CommonModule, FormsModule],
  templateUrl: './material.component.html',
  styleUrl: './material.component.css'
})
export default class MaterialComponent {
  private noteservice = inject(NotesService);
  private _authService = inject(AuthService);

  id_usuario: number = -1;

  inventario: any[] = []; // aquí cargas desde tu API
  showModal = false;
  editMode = false;

  material: any = {
    id_usuario: this.id_usuario,
    descripcion: '',
    cantidad: 0,
    metraje: 0,
    costo: 0
  };

  async ngOnInit() {
    this.id_usuario = (await this._authService.getUserId()) ?? -1;
    this.inventario = await this.noteservice.getMateriales(this.id_usuario) || [];
    this.material = {
    id_inventario: null,
    id_servicio: 16,
    id_usuario: this.id_usuario,
    descripcion: '',
    cantidad: 0,
    metraje: 0,
    costo: 0
  };
  }


  abrirModal() {
    this.editMode = false;
    this.material = { id_inventario: null, descripcion: '', cantidad: 0, metraje: 0, costo: 0 };
    this.showModal = true;
  }

  editarMaterial(item: any) {
    this.editMode = true;
    this.material = { ...item };
    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;
  }

  guardarMaterial() {
    if (this.editMode) {
      // actualizar material
      this.noteservice.actualizarMaterial(this.material);
      const index = this.inventario.findIndex(i => i.id_inventario === this.material.id_inventario);
      if (index > -1) this.inventario[index] = { ...this.material };
      
    } else {
      // simular insert con ID incremental
      this.material.id_inventario = Date.now();
      this.inventario.push({ ...this.material });
      console.log(this.material);
      this.noteservice.agregarMaterial(this.material,this.id_usuario);
    }
    this.cerrarModal();
  }

  eliminarMaterial(id: number) {
    this.inventario = this.inventario.filter(i => i.id_inventario !== id);
    this.noteservice.eliminarMaterial(id);
  }
}