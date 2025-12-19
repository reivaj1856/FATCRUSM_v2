import { Component } from '@angular/core';

import { FooterComponent } from '../../footer/footer.component';
import { toast } from 'ngx-sonner';
import { HeadComponent } from '../../head/head.component';
import { HeaderComponent } from "../../header/header.component";
@Component({
  selector: 'app-pedido',
  imports: [FooterComponent, HeaderComponent, HeaderComponent],
  templateUrl: './pedido.component.html'
})
export class PedidoComponent {
  envio(){
    toast.message('mensaje enviado');
    toast.message('tiempo de espera de 24 horas');
    }
}
