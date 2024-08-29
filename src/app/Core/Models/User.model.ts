import { Rol } from "./Rol.model";

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  profilePhotoUrl?: string;
  uid: string;
  phone?: number;
  rol?: Rol;
}
