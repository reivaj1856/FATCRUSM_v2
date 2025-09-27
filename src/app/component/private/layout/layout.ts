import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { HeadComponent } from '../../head/head.component';
import { FooterComponent } from '../../footer/footer.component';
import { Sidebar } from '../../sidebar/sidebar';

@Component({
  selector: 'app-layout',
  imports: [HeadComponent,FooterComponent,Sidebar,RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export default class Layout {

}
