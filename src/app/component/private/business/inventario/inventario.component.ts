import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-inventario',
  imports: [NgIf,NgFor],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export default class InventarioComponent {

  listaRopa = [
    {
      id: 1,
      codigo: 'PR-001',
      nombre: 'Polo clásico',
      categoria: 'Polo',
      talla: 'M',
      color: 'Blanco',
      cantidad: 35,
      precio: 65.0,
      stock_min: 10
    },
    {
      id: 2,
      codigo: 'PR-002',
      nombre: 'Pantalón jean slim',
      categoria: 'Pantalón',
      talla: '32',
      color: 'Azul oscuro',
      cantidad: 25,
      precio: 150.0,
      stock_min: 8
    },
    {
      id: 3,
      codigo: 'PR-003',
      nombre: 'Chaqueta de cuero',
      categoria: 'Chaqueta',
      talla: 'L',
      color: 'Negro',
      cantidad: 8,
      precio: 420.0,
      stock_min: 5
    },
    {
      id: 4,
      codigo: 'PR-004',
      nombre: 'Camisa formal manga larga',
      categoria: 'Camisa',
      talla: 'M',
      color: 'Celeste',
      cantidad: 20,
      precio: 120.0,
      stock_min: 6
    },
    {
      id: 5,
      codigo: 'PR-005',
      nombre: 'Polera deportiva dry-fit',
      categoria: 'Polo',
      talla: 'L',
      color: 'Rojo',
      cantidad: 18,
      precio: 85.0,
      stock_min: 10
    },
    {
      id: 6,
      codigo: 'PR-006',
      nombre: 'Chaleco acolchado',
      categoria: 'Chaleco',
      talla: 'XL',
      color: 'Gris',
      cantidad: 12,
      precio: 180.0,
      stock_min: 5
    },
    {
      id: 7,
      codigo: 'PR-007',
      nombre: 'Pantalón jogger',
      categoria: 'Pantalón',
      talla: 'M',
      color: 'Beige',
      cantidad: 22,
      precio: 135.0,
      stock_min: 10
    }
  ];

  // Función para editar una prenda
  editarPrenda(prenda: any): void {
    alert(`✏️ Editando prenda: ${prenda.nombre}\nTalla: ${prenda.talla}\nColor: ${prenda.color}`);
    // Aquí puedes abrir un modal o navegar a un formulario:
    // this.router.navigate(['/editar-prenda', prenda.id]);
  }

  // Función para eliminar una prenda
  eliminarPrenda(id: number): void {
    const confirmar = confirm('¿Estás seguro de eliminar esta prenda del inventario?');
    if (confirmar) {
      this.listaRopa = this.listaRopa.filter(p => p.id !== id);
      alert('🗑️ Prenda eliminada correctamente');
    }
  }

}
