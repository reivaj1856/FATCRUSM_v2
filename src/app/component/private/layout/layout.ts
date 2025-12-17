import { Component } from '@angular/core';

import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeadComponent } from '../../head/head.component';
import { FooterComponent } from '../../footer/footer.component';
import { Sidebar } from '../../sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-layout',
  imports: [HeadComponent,FooterComponent,Sidebar,RouterOutlet,CommonModule,FormsModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export default class Layout {

  
  isOpen = true;
 
   pageTitle = 'Bienvenido de nuevo'; // valor por defecto

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    // Escucha cada cambio de ruta
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute.firstChild;
          while (route?.firstChild) route = route.firstChild;
          return route?.snapshot.data['title'];
        })
      )
      .subscribe((title: string | undefined) => {
        this.pageTitle = title || 'Bienvenido de nuevo';
      });
  }

  toggleSidebar() { this.isOpen = !this.isOpen; }

}
