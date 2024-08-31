import { Rol } from "./Rol.model";
import { Categories } from "./Categories.model";


export interface User {
  email: string;
  firstName: string;
  lastName: string;
  profilePhotoUrl?: string;
  uid: string;
  phone?: number;
  rol?: Rol;
  categories?: Categories
}
