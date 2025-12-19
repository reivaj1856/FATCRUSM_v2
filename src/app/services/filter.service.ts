import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  // Almacena la categoría actual (por defecto 'todos')
  private categorySource = new BehaviorSubject<string>('todos');
  currentCategory = this.categorySource.asObservable();

  // Método para cambiar la categoría
  setCategory(category: string) {
    this.categorySource.next(category);
  }
}
