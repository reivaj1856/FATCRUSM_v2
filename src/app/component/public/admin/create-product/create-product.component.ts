import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthServiceStore } from '../../../../services/auth.service';
import { getAuth } from '@angular/fire/auth';
import { onAuthStateChanged } from '@firebase/auth';
import { Product } from '../../../../interface/product';
import { realService } from '../../../../services/reals.service';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';

export type ProductCreate = Omit<Product,'id'>

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    // ...
  } else {
    // User is signed out
    // ...
  }
});

@Component({
  selector: 'app-create-product',
  imports: [MatCardModule,ReactiveFormsModule],
  templateUrl: './create-product.component.html',
})

export class CreateProductComponent {
  constructor(public _matDialogoRef:MatDialogRef <CreateProductComponent>, private afAuth: AuthServiceStore ){}
  
  email: string = String(auth.currentUser?.email); 
  private _formBuilder = inject(FormBuilder);
    private _taskService = inject(realService)
    private _router = inject(Router)
  

    loading = signal(false);
      form = this._formBuilder.group({
      name: this._formBuilder.control('',Validators.required),
      texto: this._formBuilder.control('',Validators.required),
      imagen1: this._formBuilder.control('',Validators.required),
      imagen2: this._formBuilder.control('',Validators.required),
      imagen3: this._formBuilder.control('',Validators.required),
      imagen4: this._formBuilder.control('',Validators.required),
      imagen5: this._formBuilder.control('',Validators.required),
      costo:this._formBuilder.control(0,Validators.required),
      medida: this._formBuilder.control('',Validators.required),
      hombre: [true],
      mujer: [true],
      niños: [true],
      descuentos: [true],
    });

  async submit(){
      if(this.form.invalid) {
        console.log("no entro")
        return;
      }
      try{
        const valores = this.form.value;
        this.loading.set(true);
        const  {name,texto,imagen1,imagen2,imagen3,imagen4,imagen5,costo,medida,hombre,mujer,niños,descuentos} = this.form.value;
        const pouest :ProductCreate = {
          nombre: name || '',
          enlace: imagen1 || '',
          enlace1: imagen2 || '',
          enlace2: imagen3 || '',
          enlace3: imagen4 || '',
          enlace4: imagen5 || '',
          detalles: texto || '',
          precio: costo|| 0,
          talla: medida || '',
          hombre: valores.hombre || false,
          mujer: valores.mujer || false ,
          ninos: valores.niños || false ,
          ofertas: valores.descuentos || false ,
        };
      console.log(pouest)
      await this._taskService.create(pouest)
      toast.success('publicacion exitosa')
      }catch(error){
       
        toast.success('upds algo salio mal')
      } finally{
        this.loading.set(false);
      }
    }
    
}
