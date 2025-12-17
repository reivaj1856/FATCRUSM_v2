import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-especialidades',
  imports: [RouterOutlet, RouterLink, NgClass],
  templateUrl: './especialidades.component.html',
  styleUrl: './especialidades.component.css'
})
export default class EspecialidadesComponent {
  activeItem: string = 'Otros'; // opcional: valor inicial

  setActive(item: string) {
    this.activeItem = item;
  }   
}
