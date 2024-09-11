import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from './users.service';

export interface Category {
  id?: string;  
  name: string;
  state: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriesCollection = this.firestore.collection<Category>('categories');

  constructor(private firestore: AngularFirestore, private userService: UserService) { }

  // Obtener todas las categorías
  getCategories(): Observable<Category[]> {
    return this.categoriesCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Category;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  // Obtener una categoría por ID
  getCategory(id: string): Observable<Category | undefined> {
    return this.firestore.doc<Category>(`categories/${id}`).valueChanges().pipe(
      map(data => data ? { id, ...data } : undefined)
    );
  }

  // Crear una nueva categoría
  createCategory(category: Category): Promise<void> {
    const id = this.firestore.createId(); // Generar un ID único
    return this.categoriesCollection.doc(id).set({ ...category, id });
  }

  // Actualizar una categoría existente
  updateCategory(id: string, category: Category): Promise<void> {
    return this.categoriesCollection.doc(id).update(category);
  }

  // Eliminar una categoría
  deleteCategory(id: string): Promise<void> {
    return this.categoriesCollection.doc(id).delete();
  }

}