import { Component, computed, inject, signal, Signal } from '@angular/core';
import { FooterComponent } from '../../footer/footer.component';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HomelistComponent } from '../homelist/homelist.component';
import { Product } from '../../../interface/product';
import { realService } from '../../../services/reals.service';
import { AuthService } from '../../../services/auth.service';
import { Auth } from '@angular/fire/auth';
import { SidebarStoreComponent } from '../sidebar-store/sidebar-store.component';
import { HeadComponent } from '../../head/head.component';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../header/header.component";
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FooterComponent, SidebarStoreComponent, CommonModule, HomelistComponent, HeaderComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  _auth = inject(AuthService);
  auth = inject(Auth);
  logueado: boolean=true;

  ngOnInit(): void {
    this.getLogin();
    setInterval(() => {
      this.getLogin();
    }, 2000); // cada 2 segundos

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute.firstChild;
          while (route?.firstChild) route = route.firstChild;
          return route?.snapshot.data['title'];
        })
      )
      .subscribe((title: string | undefined) => {
        this.pageTitle = title || 'Bienvenido de nuevo';
      });
  }
  
  getLogin(){
    if(this.auth.currentUser?.email == null){
      this.logueado= false;
    }else{
      this.logueado= true;
    } 
    console.log(this.logueado) ;
  }    
  logout(){
    this._auth.cerrarSesion();
    window.location.reload();
  }
  mandarlogin(){
    this.router.navigateByUrl('/auth/login');
  }
    allProducts: Signal<Product[]>;
  private category = signal<'all' | 'hombre' | 'mujer' | 'ninos' | 'ofertas'>('all');

  filteredProducts = computed(() => {
    const cat = this.category();
    const products = this.allProducts();

    if (cat === 'all') return products;
    return products.filter(p => p[cat]);
  });

 constructor(private productService: realService,public router: Router,private activatedRoute: ActivatedRoute) {
    this.allProducts = this.productService.getProduct;
  }
  // Función para cambiar el filtro
  filterByCategory(category: 'all' | 'hombre' | 'mujer' | 'ninos' | 'ofertas') {
  console.log('Filtro aplicado:', category);
  this.category.set(category);
}


  showAll() {
    console.log('Mostrar todos');
    this.category.set('all');
  }


  isOpen = true;
 
   pageTitle = 'Bienvenido de nuevo'; // valor por defecto

  toggleSidebar() { this.isOpen = !this.isOpen; }
}
