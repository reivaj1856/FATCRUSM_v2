import { Component, inject } from '@angular/core';
import { NotesService } from '../../../../data/data-access/data-access.service';
import { AuthService } from '../../../../auth/data-access/auth.service';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';

export interface User{
    id_usuario?: number;
    empresa : string;
    nombre_trabajador : string;
    visible : boolean;
    email : string;
}
export interface Cliente{
    id?: number;
    nombre : string;
    direccion : string;
    telefono : string;
    email : string;
}

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export default class Profile {
  private noteservice = inject(NotesService);
  private _authService = inject(AuthService);
  private usuariologueado : User | null = null;
  listaClientes : Cliente[] | null = null;
  clienteSelect : Cliente | null = null;

  id_usuario : number = -2;
  nombreUsuario = 'Nelson Javier Cruz Montaño';
  correo = 'ejemplo@correo.com';
  empresa = 'Mi Empresa S.A.';
  userEmail: string = '';

  constructor() {
    this._authService.getUser().then((user) => {
      if (user) {
        this.userEmail = <string> user.email; // viene de la sesión
        // Insertar el usuario en la tabla personalizada
        this.usuariologueado = user;
        this.id_usuario = this.usuariologueado?.id_usuario || -2;
        this.nombreUsuario = this.usuariologueado?.nombre_trabajador || 'N/A';
        this.correo = this.usuariologueado?.email || 'N/A';
        this.empresa = this.usuariologueado?.empresa || 'N/A'; 
        console.log(this.id_usuario);
      }
    });

    this.init();
  }

  async init() {
    this.id_usuario = (await this._authService.getUserId()) ?? -1;
    await this.getClientes();
  }

  showModal = false; // bandera para mostrar el modal
  showModal1 = false;
  showModal2 = false;

  abrirModal() {
    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;
  }
  abrirModal1() {
    this.showModal1 = true;
  }

  cerrarModal1() {
    this.showModal1 = false;
  }

  abrirModal2(id : number) {
    this.showModal2 = true;
    this.getCliente(id);
  }

  cerrarModal2() {
    this.showModal2 = false;
  }

  async eliminarCliente(id: number) {
    const result = await this.noteservice.eliminarCliente(id);
      toast.success('Cliente eliminado con éxito');
      this.cerrarModal1();
      this.getClientes();
  }

  async getCliente(id:number){
    const rawCliente = await this.noteservice.getCliente(id);
    this.clienteSelect = rawCliente && Array.isArray(rawCliente) && rawCliente.length > 0
      ? {
          id: rawCliente[0].id_cliente ,
          nombre: rawCliente[0].nombre_cliente ?? 'No definido',
          direccion: rawCliente[0].direccion ?? 'No definido',
          telefono: rawCliente[0].telefono ?? 'No definido',
          email: rawCliente[0].email ?? 'No definido',
        }
      : null;
  }

  async editarCliente(id:number, nombre: string, direccion: string, telefono: string, email: string) {
    const result = await this.noteservice.editarCliente(id,nombre, direccion, telefono, email);
      toast.success(nombre +'Cliente editado con éxito');
      this.cerrarModal2();
      this.getClientes();
  }
  async registrarCliente(nombre: string, direccion: string, telefono: string, email: string) {
    const result = await this.noteservice.insertarCliente(nombre, direccion, telefono, email,this.id_usuario);
      toast.success('Cliente registrado con éxito');
      this.cerrarModal();
      this.getClientes();
  }
  async EditarUsuario(nombre_empresa: string, nombre_trabajador: string,  email: string) {
    const result = await this.noteservice.editarUsuario(nombre_empresa, nombre_trabajador, email);
      toast.success('Usuario editado con éxito');
      this.cerrarModal1();
      this.getClientes();
  }
  
  async getClientes(){
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
}
