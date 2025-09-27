import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { toast } from 'ngx-sonner';
@Component({
  selector: 'app-pedido',
  imports: [HeaderComponent,FooterComponent],
  templateUrl: './pedido.component.html'
})
export class PedidoComponent {
  envio(){
    toast.message('mensaje enviado');
    toast.message('tiempo de espera de 24 horas');
    }
}
