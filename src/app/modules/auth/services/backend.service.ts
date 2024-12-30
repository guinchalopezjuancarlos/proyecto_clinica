import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError,of } from 'rxjs';  // Importar 'of' para devolver un observable en caso de error
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private apiUrl = 'http://127.0.0.1:8080/api';  // URL base de la API

  // Variable para manejar el token de autenticación, si lo necesitas
  private token: string = '';

  constructor(private http: HttpClient) { }

  // Método para iniciar sesión (login)
  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post<any>(`${this.apiUrl}/auth/login`, body).pipe(
      catchError(error => {
        // Manejo específico de errores HTTP
        let errorMessage = 'Error desconocido. Intente de nuevo más tarde.';
        if (error.status === 401) {
          // Si el error es 401, significa que las credenciales son incorrectas
          errorMessage = 'Credenciales incorrectas. Verifique su correo y contraseña.';
        } else if (error.status === 0) {
          // Si el error es 0, podría ser por un problema de conexión
          errorMessage = 'Error de conexión con el servidor. Verifique su red.';
        } else {
          // Otros tipos de errores HTTP
          errorMessage = `Error ${error.status}: ${error.message}`;
        }
        // Lanzamos un error con el mensaje adecuado
        return throwError(() => new Error(errorMessage)); // Aquí usamos throwError
      })
    );
  }

  // Método para obtener todos los usuarios
  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users`, this.createAuthHeaders()).pipe(
      catchError((error) => this.handleError('getUsers', error))
    );
  }

  // Método para obtener un solo usuario por su ID
  getUserById(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${userId}`, this.createAuthHeaders()).pipe(
      catchError((error) => this.handleError('getUserById', error))
    );
  }

  // Método para crear un nuevo usuario
  createUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users`, user, this.createAuthHeaders()).pipe(
      catchError((error) => this.handleError('createUser', error))
    );
  }

  // Método para actualizar los datos de un usuario
  updateUser(userId: string, user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${userId}`, user, this.createAuthHeaders()).pipe(
      catchError((error) => this.handleError('updateUser', error))
    );
  }

  // Método para eliminar un usuario
  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${userId}`, this.createAuthHeaders()).pipe(
      catchError((error) => this.handleError('deleteUser', error))
    );
  }

  // Método para obtener todos los doctores
  getDoctors(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/doctors`, this.createAuthHeaders()).pipe(
      catchError((error) => this.handleError('getDoctors', error))
    );
  }

  // Método para obtener todos los pacientes
  getPacientes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pacientes`, this.createAuthHeaders()).pipe(
      catchError((error) => this.handleError('getPacientes', error))
    );
  }

  // Método para crear un doctor
  createDoctor(doctor: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/doctors`, doctor, this.createAuthHeaders()).pipe(
      catchError((error) => this.handleError('createDoctor', error))
    );
  }

  // Método para crear un paciente
  createPatient(patient: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/patients`, patient, this.createAuthHeaders()).pipe(
      catchError((error) => this.handleError('createPatient', error))
    );
  }

  // Método para manejar el token de autenticación (si es necesario)
  setToken(token: string) {
    this.token = token;
  }

  // Método para crear encabezados de autenticación
  private createAuthHeaders() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`  // Incluye el token en los encabezados
    });
    return { headers };
  }

  // Método para manejar errores de las solicitudes HTTP
  private handleError(operation: string, error: any): Observable<any> {
    console.error(`${operation} failed: ${error.message}`);  // Imprimir el error en la consola

    // Devolver un observable con un mensaje personalizado
    return of({ error: true, message: `${operation} failed: ${error.message}` });
  }
}
