import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-publicidad',
  imports: [CommonModule],
  templateUrl: './publicidad.component.html',
  styleUrl: './publicidad.component.css'
})
export default class PublicidadComponent {
  mostrarModalProducto = false;
  private _authState = inject(AuthService);
  private _router = inject(Router);

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

  // ==============================
  // HISTORIAL (SEMI VENTANA)
  // ==============================
  historial = [
    {
      accion: 'Producto "Chaqueta Jean" publicado',
      fecha: '2025-12-10'
    },
    {
      accion: 'Pedido #102 aceptado',
      fecha: '2025-12-09'
    },
    {
      accion: 'Precio actualizado en "Polo Deportivo"',
      fecha: '2025-12-08'
    }
  ];

  // ==============================
  // PRODUCTOS PUBLICADOS
  // ==============================
  productos = [
    {
      nombre: 'Polo Deportivo',
      precio: 120,
      costurero: 'Juan Pérez',
      estado: 'Disponible'
    },
    {
      nombre: 'Chaqueta Jean',
      precio: 280,
      costurero: 'María López',
      estado: 'En proceso'
    }
  ];

  // ==============================
  // PEDIDOS
  // ==============================
  pedidos = [
    {
      id: 101,
      cliente: 'Carlos Romero',
      estado: 'Pendiente'
    },
    {
      id: 102,
      cliente: 'Ana Fernández',
      estado: 'Entregado'
    }
  ];
}
