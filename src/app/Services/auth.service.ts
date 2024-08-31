import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { Rol } from '../Core/Models/Rol.model';
import { Categories } from '../Core/Models/Categories.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
  ) { }

  // Registro de usuario
  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    const urol: Rol = { id: 'koDJdzetaHAVk41XuiM5', name: 'user', state: true }
    const ucategories: Categories = {id: 'koDJdzetaHAVk41XuiM5', name: 'user', state: true}
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      const uid = userCredential.user?.uid;
      if (uid) {
        await this.firestore.collection('users').doc(uid).set({
          uid: uid,
          email: email,
          firstName: firstName,
          lastName: lastName,
          profilePhotoUrl: null,
          rol: urol,
          categories: ucategories
        });
      }
      return userCredential;
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }
  }

  // Login de usuario
  async login(email: string, password: string) {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      this.setUserData(userCredential.user);
      return userCredential;
    } catch (error) {
      console.error('Error en el login:', error);
      throw error;
    }
  }

  // Logout
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.afAuth.signOut().then(() => {
      window.location.reload();
    });
  }


  // Estado de autenticación
  getUser() {
    return this.afAuth.authState;
  }

  // Guardar datos del usuario en localStorage
  private setUserData(user: firebase.User | null) {
    if (user) {
      const token = user.getIdTokenResult();
      localStorage.setItem('user', JSON.stringify(user));
      token.then(idToken => {
        localStorage.setItem('token', idToken.token);
      });
    }
  }

  // Obtener token del localStorage
  getToken() {
    return localStorage.getItem('token');
  }

  // Obtener usuario del localStorage
  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
