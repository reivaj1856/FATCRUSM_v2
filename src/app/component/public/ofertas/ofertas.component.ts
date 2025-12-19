import { Component, computed, signal, Signal } from '@angular/core';
import { FooterComponent } from '../../footer/footer.component';
import { Product } from '../../../interface/product';
import { realService } from '../../../services/reals.service';
import { Router } from '@angular/router';
import { HomelistComponent } from '../homelist/homelist.component';
import { HeaderComponent } from "../../header/header.component";

@Component({
  selector: 'app-ofertas',
  imports: [HeaderComponent, FooterComponent, HomelistComponent, HeaderComponent],
  templateUrl: './ofertas.component.html',
  styles: ``
})
export class OfertasComponent {
  allProducts: Signal<Product[]>;
  private category = signal<'all' | 'hombre' | 'mujer' | 'ninos' | 'ofertas'>('all');

  filteredProducts = computed(() => {
    const cat = this.category();
    const products = this.allProducts();

    if (cat === 'all') return products;
    return products.filter(p => p[cat]);
  });
  filterByCategory(category: 'hombre' | 'mujer' | 'ninos' | 'ofertas') {
    console.log('Filtro aplicado:', category);
    this.category.set(category);
  }

  showAll() {
    console.log('Mostrar todos');
    this.category.set('all');
  }

   constructor(private productService: realService,private router: Router) {
    this.allProducts = this.productService.getProduct;
    this.filterByCategory('ofertas')
  }

}
