import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { realService } from '../../../services/reals.service';
import { Product } from '../../../interface/product';
import { FormBuilder, Validators } from '@angular/forms';
import { FormProduc } from '../admin/product-edit/product-edit.component';

import { FooterComponent } from '../../footer/footer.component';
import { Usuario } from '../../../interface/User';
import { toast } from 'ngx-sonner';
import { DataAccessService } from '../../../services/data-access.service';
import { Auth } from '@angular/fire/auth';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-homeproduct',
  imports: [FooterComponent,RouterLink,HeaderComponent],
  templateUrl: './homeproduct.component.html',
  styles: ``
})
export class HomeproductComponent {
  usuario: Usuario | null = null;
  auth = inject(Auth);
  data = inject(DataAccessService);
  private _formBuilder = inject(FormBuilder);

  form = this._formBuilder.group<FormProduc>({
    nombre: this._formBuilder.control('', Validators.required),
    enlace: this._formBuilder.control('', Validators.required),
    enlace1: this._formBuilder.control('', Validators.required),
    enlace2: this._formBuilder.control('', Validators.required),
    enlace3: this._formBuilder.control('', Validators.required),
    enlace4: this._formBuilder.control('', Validators.required),
    detalles: this._formBuilder.control('', Validators.required),
    precio: this._formBuilder.control(0, Validators.required),
    talla: this._formBuilder.control('', Validators.required),
    hombre: this._formBuilder.control(false|| true),
    mujer: this._formBuilder.control(false|| true),
    ninos: this._formBuilder.control(false|| true),
    ofertas: this._formBuilder.control(false|| true)
  });

  productID!: string;
  product: Product = {
    id: '',
    nombre: '',
    enlace: '',
    enlace1: '',
    enlace2: '',
    enlace3: '',
    enlace4: '',
    detalles: '',
    precio: 0,
    talla: '',
    hombre: false,
    mujer: false,
    ninos: false,
    ofertas: false
  };

   constructor(private route: ActivatedRoute,private router: Router,private serviceData : realService) {}
  async ngOnInit() {
    this.route.params.subscribe(params => {
    this.productID = params['id']; // Obtén el ID desde los parámetros de la ruta    
    }); 
    this.serviceData.getProduc(this.productID).subscribe((data: any) => {
      if (data) {
        this.product = {
          id: data.id || 'vacio',
          nombre: data.nombre || 'vacio',
          enlace: data.enlace || 'vacio',
          enlace1: data.enlace1 || 'vacio',
          enlace2: data.enlace2 || 'vacio',
          enlace3: data.enlace3 || 'vacio',
          enlace4: data.enlace4 || 'vacio',
          detalles: data.detalles || 'vacio',
          precio: data.precio || 1,
          talla: data.talla || 'vacio',
          hombre: data.hombre || false,
          mujer: data.mujer || false,
          ninos: data.ninos || false,
          ofertas: data.ofertas || false
        };
      }
      this.form.get('hombre')?.setValue(this.product.hombre);
      this.form.get('mujer')?.setValue(this.product.mujer);
      this.form.get('ninos')?.setValue(this.product.ninos);
      this.form.get('ofertas')?.setValue(this.product.ofertas);
      console.log(this.product)
    });
    await this.getcuenta();
  }
  async getcuenta(){
      const email = this.auth.currentUser?.email+'';
      this.usuario = await this.data.obtenerUsuarioPorCorreo(email);
    }
  
  agregarCarrito(idproducto: string) {
      if(this.usuario){
        this.usuario?.carrito.push(idproducto);
        toast.info('producto agregado al carrito');
        console.log(this.usuario)
        this.data.actualizarUsuarioPorId(this.usuario.id,this.usuario);
      }else{
        toast.error('inicia sesion para agregar productos al carrito')
      }
    }
}
