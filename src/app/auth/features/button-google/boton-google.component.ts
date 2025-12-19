import { Component, output } from '@angular/core';

@Component({
  selector: 'app-boton-google',
  standalone: true,
  imports: [],
  templateUrl: './boton-google.component.html'
})
export class BotonGoogleComponent {
  onClick = output<void>();
}
