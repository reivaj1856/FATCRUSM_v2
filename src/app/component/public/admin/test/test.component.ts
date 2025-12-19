import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-test',
  imports: [HeaderComponent,FooterComponent],
  templateUrl: './test.component.html',
})
export class TestComponent {
  mensajeConexion: string = ''; 
  mensajeConexion1: string = '';
  mensajeConexion2: string = '';  
  conexionConfirmada: boolean=false;

  ngAfterViewInit(): void {
    document.querySelectorAll('.accordion').forEach(elm => {
      const button = elm.querySelector('.toggle-button') as HTMLElement | null;
      const content = elm.querySelector('.content') as HTMLElement | null;
      const plusIcon = button?.querySelector('.plus') as HTMLElement | null;

      if (button && content && plusIcon) {
        button.addEventListener('click', () => {
          const isHidden = content.classList.toggle('invisible');
          content.style.maxHeight = isHidden ? '0px' : `${content.scrollHeight + 100}px`;
          button.classList.toggle('text-blue-600', !isHidden);
          button.classList.toggle('text-gray-800', isHidden);
          content.classList.toggle('pb-6', !isHidden);
          plusIcon.classList.toggle('hidden', !isHidden);
          plusIcon.classList.toggle('block', isHidden);
        });
      }
    });
  }

  constructor(private firestore: Firestore) {}

  async probarConexion(){
  try {
    const ref = doc(this.firestore, 'product/1qUJaTdCZNR6ldcC4PBU'); // Ruta de prueba
    const snap = await getDoc(ref);
    if (snap.exists()) {
      this.mensajeConexion = '✅ busqueda de producto realizada correctamente';
    } else {
      this.mensajeConexion = '⚠️ busqueda de producto realizada fallida, pero la conexión es válida';
    }
  } catch (error) {
    this.mensajeConexion = '❌ Error al conectar con Firebase';
  }
  try {
    const ref = doc(this.firestore, 'product/jdskajdksjakdslawk'); // Ruta de prueba
    const snap = await getDoc(ref);
    if (snap.exists()) {
      this.mensajeConexion1 = '⚠️ busqueda de producto no existente validada error';
    } else {
      this.mensajeConexion1 = '✅ busqueda de producto no existente rechazada correctamente';
    }
  } catch (error) {
    this.mensajeConexion1 = '❌ Error al conectar con Firebase';
  }
  try {
    const ref = doc(this.firestore, 'datos/dsadsa'); // Ruta de prueba
    const snap = await getDoc(ref);
    if (snap.exists()) {
      this.mensajeConexion2 = '❌ Error al recibir tabla nula';
    } else {
      this.mensajeConexion2 = '✅ busqueda de tabla nula correcatemente rechazada';
    }
  } catch (error) {
    this.mensajeConexion2 = '❌ Error al conectar con Firebase';
  }
}
  async conexionServidor(){
    try {
    const ref = doc(this.firestore, 'Product/ds'); // Ruta de prueba
    const snap = await getDoc(ref);
    if (snap.exists()) {
      toast.info('✅ conexion correcta con el servidor');
    } else {
      toast.info('✅ conexion correcta con el servidor');
    }
  } catch (error) {
    toast.info('❌ Sin conexion al servidor');;
  }      
  }

}
