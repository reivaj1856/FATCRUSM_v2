import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-publicidad',
  imports: [CommonModule, RouterLink],
  templateUrl: './publicidad.component.html',
  styleUrl: './publicidad.component.css'
})
export default class PublicidadComponent {
   mostrarModalProducto = false;

  abrirModalProducto(): void {
    this.mostrarModalProducto = true;
  }

  cerrarModalProducto(): void {
    this.mostrarModalProducto = false;
  }

  // ==============================
  // LISTA TEMPORAL DE PUBLICIDAD
  // ==============================
  publicidades = [
    {
      titulo: 'Confección de Trajes Personalizados',
      descripcion: 'Diseños exclusivos hechos a medida',
      imagen: 'assets/img/publicidad1.jpg'
    },
    {
      titulo: 'Poleras y Chaquetas',
      descripcion: 'Ropa casual y deportiva para toda ocasión',
      imagen: 'assets/img/publicidad2.jpg'
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
