import { Component, Input, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { Product } from '../../../interface/product';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { getAuth } from 'firebase/auth';

const auth1 = getAuth();

@Component({
  selector: 'app-venta',
  imports: [HeaderComponent,FooterComponent,RouterLink],
  templateUrl: './venta.component.html',
  styles: ``
})
export default class VentaComponent implements OnInit {
  @Input() producto: Product[] = [];
  auth = inject(Auth);
  public nombre: string = String(auth1.currentUser?.displayName);
  public correo: string = String(auth1.currentUser?.email);
  subtotal: number = 0;
  envio = 0; 
  impuesto = 0;
  total= 0;
  ngOnInit() {
    this.subtotal = this.producto.reduce((acc, product) => acc + (product.precio ?? 0), 0);
    this.impuesto = Math.round((this.subtotal / 100) * 13);
    this.envio = this.producto.length * 5;
    this.total = this.subtotal + this.envio + this.impuesto;
    
  }
  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.producto = nav?.extras.state?.['producto'] ?? [];
  }
}
