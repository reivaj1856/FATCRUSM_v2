import { Component, Input } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { Product } from '../../../interface/product';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // <-- Importa CommonModule
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-proforma',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, FormsModule, CommonModule], // <-- Agrega CommonModule aquí
  templateUrl: './proforma.component.html',
  styles: ``
})
export default class ProformaComponent {
  @Input() producto: Product[] = [];

  subtotal: number = 0;
  envio = 0; 
  impuesto = 0;
  total= 0;

  nombreTitular: string = '';
  numeroTarjeta: string = '';
  fechaExpiracion: string = '';
  cvv: string = '';

  cargando: boolean = false;

  ngOnInit() {
    this.subtotal = this.producto.reduce((acc, product) => acc + (product.precio ?? 0), 0);
    this.impuesto = Math.round((this.subtotal / 100) * 13);
    this.envio = this.producto.length * 5;
    this.total = this.subtotal + this.envio + this.impuesto;
    console.log(this.producto);
  }

  constructor(private router: Router, private firestore: Firestore) {
    const nav = this.router.getCurrentNavigation();
    this.producto = nav?.extras.state?.['producto'] ?? [];
  }

  generarFactura() {
    this.cargando = true;
    setTimeout(() => {
      const productosHtml = this.producto.map(p => `
        <tr>
          <td style="padding:4px 8px;border:1px solid #ccc;">${p.nombre}</td>
          <td style="padding:4px 8px;border:1px solid #ccc;">${p.precio} Bs</td>
        </tr>
      `).join('');

      const facturaHtml = `
        <html>
        <head>
          <title>Factura</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h2 { margin-bottom: 16px; }
            table { border-collapse: collapse; width: 100%; margin-bottom: 16px; }
            th, td { border: 1px solid #ccc; padding: 8px; }
            th { background: #f3f3f3; }
          </style>
        </head>
        <body>
          <h2>Factura de Compra</h2>
          <p><strong>Nombre del titular:</strong> ${this.nombreTitular}</p>
          <p><strong>Número de tarjeta:</strong> ${this.numeroTarjeta}</p>
          <p><strong>Fecha de expiración:</strong> ${this.fechaExpiracion}</p>
          <p><strong>CVV:</strong> ${this.cvv}</p>
          <h3>Productos</h3>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              ${productosHtml}
            </tbody>
          </table>
          <p><strong>Subtotal:</strong> ${this.subtotal} Bs</p>
          <p><strong>Envío:</strong> ${this.envio} Bs</p>
          <p><strong>Impuesto:</strong> ${this.impuesto} Bs</p>
          <p><strong>Total:</strong> ${this.total} Bs</p>
          <hr>
          <p>Gracias por su compra.</p>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
        </html>
      `;

      const ventana = window.open('', '_blank', 'width=800,height=600');
      if (ventana) {
        ventana.document.open();
        ventana.document.write(facturaHtml);
        ventana.document.close();
      }
      this.cargando = false;
    }, 2000); // 2 segundos de espera
  }

  async guardarFactura() {
    const factura = {
      productos: this.producto,
      subtotal: this.subtotal,
      envio: this.envio,
      impuesto: this.impuesto,
      total: this.total,
      nombreTitular: this.nombreTitular,
      numeroTarjeta: this.numeroTarjeta,
      fechaExpiracion: this.fechaExpiracion,
      cvv: this.cvv,
      fecha: new Date()
    };
    try {
      const facturasCollection = collection(this.firestore, 'facturas');
      await addDoc(facturasCollection, factura);
      alert('Factura guardada correctamente en la base de datos.');
    } catch (error) {
      alert('Error al guardar la factura: ' + error);
    }
  }
}
