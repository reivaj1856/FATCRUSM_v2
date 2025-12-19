import { Component, computed, inject, input, signal, Signal } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { NavComponent } from '../../nav/nav.component';
import { Route, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Auth } from '@angular/fire/auth';
import { toast } from 'ngx-sonner';
import { realService } from '../../../services/reals.service';
import { CreateProductComponent } from '../create-product/create-product.component';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '../../../interface/product';
import { ListproductsComponent } from "../listproducts/listproducts.component";
import { DataAccessService } from '../../../services/data-access.service';

@Component({
  selector: 'app-edit',
  imports: [HeaderComponent, ListproductsComponent],
  templateUrl: './edit.component.html'
})
export default class EditComponent {
  admin: boolean=false;
  _auth = inject(AuthService);
  auth = inject(Auth);
  data = inject(DataAccessService);
  logueado: boolean=false;
    allProducts: Signal<Product[]>;
  private category = signal<'all' | 'hombre' | 'mujer' | 'ninos' | 'ofertas'>('all');

  filteredProducts = computed(() => {
    const cat = this.category();
    const products = this.allProducts();

    if (cat === 'all') return products;
    return products.filter(p => p[cat]);
  });

 constructor(private productService: realService,private router: Router, private _publicEmergente: MatDialog) {
    this.allProducts = this.productService.getProduct;
  }
  // Función para cambiar el filtro
   filterByCategory(category: 'hombre' | 'mujer' | 'ninos' | 'ofertas') {
    console.log('Filtro aplicado:', category);
    this.category.set(category);
  }

  showAll() {
    console.log('Mostrar todos');
    this.category.set('all');
  }

  async verifiedAdmin(){
    const email = this.auth.currentUser?.email+'';
    this.admin = await this.data.obtenerValorAdminPorCorreo(email);
    if(!this.admin){
      toast.info('acceso denegado');
      this.router.navigateByUrl('/content/home');
    }else{
      toast.info('admin verificado');
    }
  }

  getLogin(){
    if(this.auth.currentUser?.email){
      this.logueado= false;
    }else{
      this.logueado= true;
    } 
    console.log(this.logueado) ;
  }    
  logout(){
    this._auth.cerrarSesion();
    this.router.navigateByUrl('/content');
  }
  publicar():void{
    this._publicEmergente.open(CreateProductComponent, {width: '900px'});
  } 
  
  async ngOnInit() {
    await this.getLogin();
    this.verifiedAdmin();
  }

}
