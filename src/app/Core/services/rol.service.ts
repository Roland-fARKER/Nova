import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../Models/User.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from './users.service';

export interface Rol {
  id?: string;
  name: string;
  state: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private rolCollection = this.firestore.collection<Rol>('rol');

  constructor(private firestore: AngularFirestore, private userService: UserService) { }

  // Obtener todas las categorías
  getRol(): Observable<Rol[]> {
    return this.rolCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Rol;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  // Obtener una categoría por ID
  getRole(id: string): Observable<Rol | undefined> {
    return this.firestore.doc<Rol>(`rol/${id}`).valueChanges().pipe(
      map(data => data ? { id, ...data } : undefined)
    );
  }

  // Crear una nueva categoría
  createRol(rol: Rol): Promise<void> {
    const id = this.firestore.createId(); // Generar un ID único
    return this.rolCollection.doc(id).set({ ...rol, id });
  }

  // Actualizar una categoría existente
  updateRol(id: string, rol: Rol): Promise<void> {
    return this.rolCollection.doc(id).update(rol);
  }

  // Eliminar una categoría
  deleteRol(id: string): Promise<void> {
    return this.rolCollection.doc(id).delete();
  }

  isUserSuperAdmin(id: string): Observable<boolean> {
    return this.userService.getUserByUid(id).pipe(
      map(person => person?.rol?.id === 'jaYmR5IkerLG5DgGf2ol')
    );
  }
}