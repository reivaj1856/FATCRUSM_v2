import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../../interface/product';
import { realService } from '../../../../services/reals.service';
import { FormBuilder,FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { HeadComponent } from '../../../head/head.component';
import { FooterComponent } from '../../../footer/footer.component';

export type ProducCreate = Omit<Product,'id'>

export interface FormProduc {
  nombre: FormControl<string | null>;
  enlace: FormControl<string | null>;
  enlace1: FormControl<string | null>;
  enlace2: FormControl<string | null>;
  enlace3: FormControl<string | null>;
  enlace4: FormControl<string | null>;
  detalles: FormControl<string | null>;
  precio: FormControl<number|null>;
  talla: FormControl<string | null>;
  hombre: FormControl<boolean|null>;
  mujer: FormControl<boolean|null>;
  ninos: FormControl<boolean|null>;
  ofertas: FormControl<boolean|null>;
}

@Component({
  selector: 'app-product-edit',
  imports: [HeadComponent,FooterComponent,ReactiveFormsModule],
  templateUrl: './product-edit.component.html'
})
export class ProductEditComponent {
  logueado: boolean=true;
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

  ngOnInit() {
    this.verifiedAdmin();
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
  }
  async submit() {

  try {
        const { nombre, enlace, enlace1, enlace2, enlace3, enlace4, detalles, precio, talla, hombre, mujer, ninos, ofertas} = this.form.value;
        
        const producto: ProducCreate = {
          nombre: nombre||this.product.nombre,
          enlace: enlace||this.product.enlace,
          enlace1: enlace1||this.product.enlace1,
          enlace2: enlace2||this.product.enlace2,
          enlace3: enlace3||this.product.enlace3,
          enlace4: enlace4||this.product.enlace4,
          detalles: detalles||this.product.detalles,
          precio: precio||this.product.precio,
          talla: talla||this.product.talla,
          hombre: hombre!,
          mujer: mujer!,
          ninos: ninos!,
          ofertas: ofertas!
        };
        console.log(producto)
        await this.serviceData.update(producto,this.product.id);

        toast.success('Producto actualizado correctamente');
      } catch (error) {
        toast.success('error')
    }  
  }
  verifiedAdmin(){
    if(!this.logueado){
      toast.info('acceso denegado');
      this.router.navigateByUrl('/content/home');
    }
  }
} 

