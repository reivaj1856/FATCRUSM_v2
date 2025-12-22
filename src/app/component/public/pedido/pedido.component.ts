import { Component, inject } from '@angular/core';

import { FooterComponent } from '../../footer/footer.component';
import { toast } from 'ngx-sonner';
import { HeadComponent } from '../../head/head.component';
import { HeaderComponent } from "../../header/header.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient.js';
import { AuthStateService } from '../../../data-access/auth-state.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-pedido',
  imports: [FooterComponent, HeaderComponent, HeaderComponent,ReactiveFormsModule, CommonModule],
  templateUrl: './pedido.component.html'
})
export class PedidoComponent {
  envio(){
    toast.message('mensaje enviado');
    toast.message('tiempo de espera de 24 horas');
    }
  pedidoForm!: FormGroup;
  listaEmpresas: any[] = [];
  public _supabaseClient = inject(AuthStateService).supabaseClient;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.pedidoForm = this.fb.group({
      id_usuario: ['', Validators.required],
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      celular: ['', [Validators.required, Validators.minLength(8)]],
      categoria: ['', Validators.required],
      descripcion: ['', Validators.required],
    });

    this.cargarEmpresas();
  }

  async cargarEmpresas() {
    const { data, error } = await this._supabaseClient
      .from('usuarios')
      .select('id_usuario, empresa');
    if (error) {
      toast.error('Error al cargar empresas');
    } else {
      this.listaEmpresas = data;
    }
  }

  async registrarPedido() {
    if (this.pedidoForm.invalid) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    const pedido = this.pedidoForm.value;
    const { error } = await this._supabaseClient.from('pedidos').insert([pedido]);

    if (error) {
      console.error(error);
      toast.error('Error al registrar el pedido');
    } else {
      toast.success('✅ Pedido registrado correctamente');
      this.pedidoForm.reset();
    }
  }
}
