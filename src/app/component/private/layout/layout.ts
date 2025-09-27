import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { HeadComponent } from '../../head/head.component';
import { FooterComponent } from '../../footer/footer.component';
import { Sidebar } from '../../sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-layout',
  imports: [HeadComponent,FooterComponent,Sidebar,RouterOutlet,CommonModule,FormsModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export default class Layout {

  
  isOpen = false;
 
  toggleSidebar() { this.isOpen = !this.isOpen; }

}
