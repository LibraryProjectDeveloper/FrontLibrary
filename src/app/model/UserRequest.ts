export interface UserRequest {
  idUsuario?: number; // Optional for new users
  name: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  dni: string;
  password: string;
  idRol: number;
  state?: boolean;
}
