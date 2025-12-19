import { Component, EventEmitter, Output } from '@angular/core';
import { FilterService } from '../../../services/filter.service';

@Component({
  selector: 'app-sidebar-store',
  imports: [],
  templateUrl: './sidebar-store.component.html',
  styleUrl: './sidebar-store.component.css'
})
export class SidebarStoreComponent {
  
  @Output() onFilter = new EventEmitter<'all' | 'hombre' | 'mujer' | 'ninos' | 'ofertas'>();

  filterByCategory(category: 'hombre' | 'mujer' | 'ninos' | 'ofertas') {
    console.log('Clic en categoría:', category);
    this.onFilter.emit(category);
  }

   @Output() toggleMenu = new EventEmitter<void>();

  showAll() {
    console.log('Clic en mostrar todo');
    this.onFilter.emit('all');
  }
}
