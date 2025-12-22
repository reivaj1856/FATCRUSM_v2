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
  detalles: FormControl<string | null>;
  precio: FormControl<number | null>;
  mujer: FormControl<boolean | null>;
  niño: FormControl<boolean | null>;
  ofertas: FormControl<boolean | null>;
}

@Component({
  selector: 'app-product-edit',
  imports: [HeadComponent,FooterComponent,ReactiveFormsModule],
  templateUrl: './product-edit.component.html'
})
export class ProductEditComponent {
  logueado = true; // Para verificación de admin
  private _formBuilder = inject(FormBuilder);
  private serviceData = inject(realService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  productID!: string;

  form = this._formBuilder.group<FormProduc>({
    nombre: this._formBuilder.control('', Validators.required),
    detalles: this._formBuilder.control('', Validators.required),
    precio: this._formBuilder.control(0, Validators.required),
    mujer: this._formBuilder.control(false),
    niño: this._formBuilder.control(false),
    ofertas: this._formBuilder.control(false)
  });

  product: Product = {
    id_product: 0,
    id_producto: 0,
    id_usuario: 0,
    nombre: '',
    detalles: '',
    imagenes: [],
    hombre: false,
    mujer: false,
    niño: false,
    ofertas: false,
    tallas: []
  };

  ngOnInit() {
    this.verifiedAdmin();

    this.route.params.subscribe(params => {
      this.productID = params['id'];
      this.loadProduct();
    });
  }

  async loadProduct() {
    this.serviceData.getProduc(this.productID).subscribe((data: any) => {
      if (!data) return;

      this.product = {
        id_product: data.id_product || 0,
        id_producto: data.id_producto || 0,
        id_usuario: data.id_usuario || 0,
        nombre: data.nombre || '',
        detalles: data.detalles || '',
        imagenes: data.imagenes || [],
        hombre: data.hombre || false,
        mujer: data.mujer || false,
        niño: data.niño || false,
        ofertas: data.ofertas || false,
        tallas: data.tallas || []
      };

      // Sincronizar valores en el formulario
      this.form.patchValue({
        nombre: this.product.nombre,
        detalles: this.product.detalles,
        precio: this.product.tallas[0]?.precio || 0,
        mujer: this.product.mujer,
        niño: this.product.niño,
        ofertas: this.product.ofertas
      });

      console.log('Producto cargado:', this.product);
    });
  }

  async submit() {
    try {
      if (!this.form.valid) {
        toast.error('Por favor completa todos los campos requeridos');
        return;
      }

      const { nombre, detalles, precio, mujer, niño, ofertas } = this.form.value;

      const productoActualizado: ProducCreate = {
        id_product: this.product.id_product,
        id_producto: this.product.id_producto,
        id_usuario: this.product.id_usuario,
        nombre: nombre || this.product.nombre,
        detalles: detalles || this.product.detalles,
        hombre: this.product.hombre,
        mujer: mujer ?? this.product.mujer,
        niño: niño ?? this.product.niño,
        ofertas: ofertas ?? this.product.ofertas,
        imagenes: this.product.imagenes,
        tallas: this.product.tallas
      };

      console.log('Producto a actualizar:', productoActualizado);

      await this.serviceData.update(productoActualizado, this.product.id_producto+"");

      toast.success('Producto actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      toast.error('Ocurrió un error al actualizar el producto');
    }
  }

  verifiedAdmin() {
    if (!this.logueado) {
      toast.info('Acceso denegado');
      this.router.navigateByUrl('/content/home');
    }
  }
}
