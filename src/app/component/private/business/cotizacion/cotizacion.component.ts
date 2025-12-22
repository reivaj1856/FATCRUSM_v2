import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AuthService } from '../../../../auth/data-access/auth.service';

export interface Prenda {
  cantidad: number;
  talla: string;
  sexo: 'Hombre' | 'Mujer' | 'Niño';
  precio: number;
}


@Component({
  selector: 'app-cotizacion',
  imports: [CommonModule,
    FormsModule],
  templateUrl: './cotizacion.component.html',
  styleUrl: './cotizacion.component.css'
})
export default class CotizacionComponent {
  empresa = 'Mi Empresa S.A.';
  cliente: string = '';
  logoPreview: string | null = null;


  private _authService = inject(AuthService);
  public fechaActual: string = new Date().toLocaleDateString();

  constructor() {
    this._authService.getUser().then((user) => {
      if (user) {
        this.empresa = user?.empresa || 'N/A'; 
      }
    });
  }

  
  descripcion: string = '';
  prendas: Prenda[] = [];

  mostrarModal = false;
  nuevaPrenda: Prenda = { cantidad: 1, talla: '', sexo: 'Hombre', precio: 0 };

  abrirModal() {
    this.nuevaPrenda = { cantidad: 1, talla: '', sexo: 'Hombre', precio: 0 };
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarPrenda() {
    if (this.nuevaPrenda.cantidad > 0 && this.nuevaPrenda.precio > 0 && this.nuevaPrenda.talla) {
      this.prendas.push({ ...this.nuevaPrenda });
      this.cerrarModal();
    } else {
      alert('Por favor llena todos los campos correctamente.');
    }
  }

  calcularTotal(): number {
    return this.prendas.reduce((total, p) => total + (p.cantidad * p.precio), 0);
  }

  imprimir() {
    window.print();
  }

  onLogoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      if (!file.type.includes('image/png')) {
        alert('Por favor, selecciona un archivo .png');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}