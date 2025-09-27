import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-costura',
  imports: [RouterOutlet, RouterLink,FormsModule,CommonModule],
  templateUrl: './costura.component.html',
  styleUrl: './costura.component.css'
})
export default class CosturaComponent {

}
