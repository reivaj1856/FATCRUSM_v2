import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { toast } from 'ngx-sonner';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-novedades',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent], // Agrega CommonModule aquí
  templateUrl: './novedades.component.html',
  styleUrl: './novedades.component.css'
})
export class NovedadesComponent {
  imagenes = [
    'https://julio.com/media/wysiwyg/banner_accesorios_1.jpg',
    'https://julio.com/media/wysiwyg/Banner-categoria-promo_2.jpg',
    'https://julio.com/media/wysiwyg/Header-Home-Desktop_9.jpg'
  ];
  indiceCarrusel = 0;

  moverCarrusel(dir: number) {
    this.indiceCarrusel = (this.indiceCarrusel + dir + this.imagenes.length) % this.imagenes.length;
  }

  enviar(){
    toast.success('te enviaremos un correo para futuras promociones');
  }
}
