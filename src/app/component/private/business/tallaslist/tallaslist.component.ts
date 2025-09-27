import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { NotesService } from '../../../../data/data-access/data-access.service';
import { AuthService } from '../../../../auth/data-access/auth.service';

export interface User {
  id_usuario?: number;
  empresa: string;
  nombre_trabajador: string;
  visible: boolean;
  email: string;
}

interface Talla {
  id_talla?: number;
  id_usuario?: number;
  talla?: string;
  sexo?: string;
  tipo?: string;
  visible?: boolean;
}

@Component({
  selector: 'app-tallaslist',
  imports: [CommonModule, FormsModule],
  templateUrl: './tallaslist.component.html',
  styleUrl: './tallaslist.component.css',
})
export default class TallaslistComponent implements OnInit {
  private noteservice = inject(NotesService);
  private _authService = inject(AuthService);

  listaTallas: Talla[] | null = null;
  id_usuario: number = -1;
  tallaSelect: Talla | null = null;

  showModal = false;

  constructor() // private dataService: DataService // inyecta tu servicio Supabase aquí
  {}

  async ngOnInit() {
    this.id_usuario = (await this._authService.getUserId()) ?? -1;
    this.loadTallas(this.id_usuario);

    /* this.tallaSelect = (await this.noteservice.getTalla(this.id_usuario)) ?? null; */
  }

  async loadTallas(id: number) {
    try {
      this.listaTallas = await this.noteservice.getTallas(id);
    } catch (error) {
      toast.error('Error al cargar tallas');
    }
  }
  openEditModal(talla: Talla | null) {
    if (talla) {
      // clonar para no mutar antes de guardar
      this.tallaSelect = talla;
    } else {
      this.tallaSelect = null;
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  async saveTalla(talla: string, sexo: string, tipo: string) {
    if (this.tallaSelect?.id_talla) {
      this.noteservice.editarTalla(
        this.tallaSelect.id_talla ?? -1,
        talla,
        sexo,
        tipo
      );
      this.closeModal();
    } else {
      console.log('dato');
      this.noteservice.insertarTalla(talla, this.id_usuario, sexo, tipo);
      this.closeModal();
    }
    this.loadTallas(this.id_usuario);
    window.location.reload();
  }

  confirmDelete(talla: Talla) {
    this.noteservice.eliminarTalla(talla.id_talla ?? -1);
    this.loadTallas(this.id_usuario);
  }

}
