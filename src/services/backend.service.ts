import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';  // Importar 'of' para devolver un observable en caso de error
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
      catchError((error) => this.handleError('login', error))  // Pasamos la operación y el error al manejarlo
    );
  }

  // Método para obtener todos los usuarios
  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users`);
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
  // Método para obtener los estados de venta
getestadosVenta(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/estados-venta`).pipe(
    catchError((error) => this.handleError('getestadosVenta', error))
  );
}
// Método para obtener los métodos de pago
getmetodoPago(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/metodos-pago`).pipe(
    catchError((error) => this.handleError('getmetodoPago', error))
  );
}


  // Método para actualizar los datos de un usuario
  updateUser(user: any): Observable<any> {
    console.log(user);
    return this.http.post<any>(`${this.apiUrl}/users/update`, user, this.createAuthHeaders()).pipe(
      catchError((error) => this.handleError('updateUser', error))
    );
  }

  // Método para eliminar un usuario
  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${userId}`, this.createAuthHeaders()).pipe(
      catchError((error) => this.handleError('deleteUser', error))
    );
  }






    getClientes(): Observable<any> {return this.http.get<any>(`${this.apiUrl}/clientes`);}
    getClienteById(clienteId: string): Observable<any> {return this.http.get<any>(`${this.apiUrl}/users/${clienteId}`, this.createAuthHeaders()).pipe( catchError((error) => this.handleError('getUserById', error)) );}
    createCliente(cliente: any): Observable<any> { return this.http.post<any>(`${this.apiUrl}/clientes`, cliente, this.createAuthHeaders()).pipe( catchError((error) => this.handleError('createCliente', error)) ); }
    updateCliente(cliente: any): Observable<any> {return this.http.post<any>(`${this.apiUrl}/clientes/update`, cliente, this.createAuthHeaders()).pipe( catchError((error) => this.handleError('updateUser', error)));}
    deleteCliente(clienteId: string): Observable<any> { return this.http.delete<any>(`${this.apiUrl}/clientes/${clienteId}`, this.createAuthHeaders()).pipe(catchError((error) => this.handleError('deleteUser', error)));}

    getDoctores(): Observable<any> {return this.http.get<any>(`${this.apiUrl}/doctors`);}
    getDoctorById(doctorId: string): Observable<any> {return this.http.get<any>(`${this.apiUrl}/doctors/${doctorId}`, this.createAuthHeaders()).pipe( catchError((error) => this.handleError('getUserById', error)) );}
    createDoctor(doctor: any): Observable<any> { return this.http.post<any>(`${this.apiUrl}/doctors`, doctor, this.createAuthHeaders()).pipe( catchError((error) => this.handleError('createCliente', error)) ); }
    updateDoctor(doctor: any): Observable<any> {return this.http.post<any>(`${this.apiUrl}/doctors/update`, doctor, this.createAuthHeaders()).pipe( catchError((error) => this.handleError('updateUser', error)));}
    deleteDoctor(doctorId: string): Observable<any> { return this.http.delete<any>(`${this.apiUrl}/doctors/${doctorId}`, this.createAuthHeaders()).pipe(catchError((error) => this.handleError('deleteUser', error)));}

    getPacientes(): Observable<any> {return this.http.get<any>(`${this.apiUrl}/pacientes`);}
    getPacienteById(pacienteId: string): Observable<any> {return this.http.get<any>(`${this.apiUrl}/pacientes/${pacienteId}`, this.createAuthHeaders()).pipe( catchError((error) => this.handleError('getUserById', error)) );}
    createPaciente(paciente: any): Observable<any> { return this.http.post<any>(`${this.apiUrl}/pacientes`, paciente, this.createAuthHeaders()).pipe( catchError((error) => this.handleError('createCliente', error)) ); }
    updatePaciente(paciente: any): Observable<any> {return this.http.post<any>(`${this.apiUrl}/pacientes/update`, paciente, this.createAuthHeaders()).pipe( catchError((error) => this.handleError('updateUser', error)));}
    deletePaciente(pacienteId: string): Observable<any> { return this.http.delete<any>(`${this.apiUrl}/pacientes/${pacienteId}`, this.createAuthHeaders()).pipe(catchError((error) => this.handleError('deleteUser', error)));}


    getCitasMedicas(): Observable<any> {return this.http.get<any>(`${this.apiUrl}/citasmedicas`);}
    getCitaMedicaById(citamedicaId: string): Observable<any> {return this.http.get<any>(`${this.apiUrl}/citasmedicas/${citamedicaId}`, this.createAuthHeaders()).pipe( catchError((error) => this.handleError('getUserById', error)) );}
    createCitaMedica(citamedica: any): Observable<any> { return this.http.post<any>(`${this.apiUrl}/citasmedicas`, citamedica, this.createAuthHeaders()).pipe( catchError((error) => this.handleError('createCliente', error)) ); }
    updateCitaMedica(citamedica: any): Observable<any> {return this.http.post<any>(`${this.apiUrl}/citasmedicas/update`, citamedica, this.createAuthHeaders()).pipe( catchError((error) => this.handleError('updateUser', error)));}
    deleteCitaMedica(citamedica: string): Observable<any> { return this.http.delete<any>(`${this.apiUrl}/citasmedicas/${citamedica}`, this.createAuthHeaders()).pipe(catchError((error) => this.handleError('deleteUser', error)));}


    getRecetas(): Observable<any> {return this.http.get<any>(`${this.apiUrl}/recetas`);}
    getRecetaById(recetaId: string): Observable<any> {return this.http.get<any>(`${this.apiUrl}/recetas/${recetaId}`, this.createAuthHeaders()).pipe( catchError((error) => this.handleError('getUserById', error)) );}
    createReceta(receta: any): Observable<any> { return this.http.post<any>(`${this.apiUrl}/recetas`, receta, this.createAuthHeaders()).pipe( catchError((error) => this.handleError('createCliente', error)) ); }
    updateReceta(receta: any): Observable<any> {return this.http.post<any>(`${this.apiUrl}/recetas/update`, receta, this.createAuthHeaders()).pipe( catchError((error) => this.handleError('updateUser', error)));}
    deleteReceta(recetaId: string): Observable<any> { return this.http.delete<any>(`${this.apiUrl}/recetas/${recetaId}`, this.createAuthHeaders()).pipe(catchError((error) => this.handleError('deleteUser', error)));}

    getVentas(): Observable<any> {return this.http.get<any>(`${this.apiUrl}/ventas`);}
    getVentaById(ventaId: string): Observable<any> {return this.http.get<any>(`${this.apiUrl}/ventas/${ventaId}`, this.createAuthHeaders()).pipe( catchError((error) => this.handleError('getUserById', error)) );}
    createVenta(venta: any): Observable<any> { return this.http.post<any>(`${this.apiUrl}/ventas`, venta, this.createAuthHeaders()).pipe( catchError((error) => this.handleError('createCliente', error)) ); }
    updateVenta(venta: any): Observable<any> {return this.http.post<any>(`${this.apiUrl}/ventas/update`, venta, this.createAuthHeaders()).pipe( catchError((error) => this.handleError('updateUser', error)));}
    deleteVenta(ventaId: string): Observable<any> { return this.http.delete<any>(`${this.apiUrl}/ventas/${ventaId}`, this.createAuthHeaders()).pipe(catchError((error) => this.handleError('deleteUser', error)));}


    getPagos(): Observable<any> {return this.http.get<any>(`${this.apiUrl}/pagos`);}
    getPagoById(pagoId: string): Observable<any> {return this.http.get<any>(`${this.apiUrl}/pagos/${pagoId}`, this.createAuthHeaders()).pipe( catchError((error) => this.handleError('getUserById', error)) );}
    createPago(pago: any): Observable<any> { return this.http.post<any>(`${this.apiUrl}/pagos`, pago, this.createAuthHeaders()).pipe( catchError((error) => this.handleError('createCliente', error)) ); }
    updatePago(pago: any): Observable<any> {return this.http.post<any>(`${this.apiUrl}/pagos/update`, pago, this.createAuthHeaders()).pipe( catchError((error) => this.handleError('updateUser', error)));}
    deletePago(pagoId: string): Observable<any> { return this.http.delete<any>(`${this.apiUrl}/pagos/${pagoId}`, this.createAuthHeaders()).pipe(catchError((error) => this.handleError('deleteUser', error)));}

    getMedicamentos(): Observable<any> {return this.http.get<any>(`${this.apiUrl}/medicamentos`);}
    getMedicamentoById(medicamentoId: string): Observable<any> {return this.http.get<any>(`${this.apiUrl}/medicamentos/${medicamentoId}`, this.createAuthHeaders()).pipe( catchError((error) => this.handleError('getUserById', error)) );}
    createMedicamento(medicamento: any): Observable<any> { return this.http.post<any>(`${this.apiUrl}/medicamentos`, medicamento, this.createAuthHeaders()).pipe( catchError((error) => this.handleError('createCliente', error)) ); }
    updateMedicamento(medicamento: any): Observable<any> {return this.http.post<any>(`${this.apiUrl}/medicamentos/update`, medicamento, this.createAuthHeaders()).pipe( catchError((error) => this.handleError('updateUser', error)));}
    deleteMedicamento(medicamentoId: string): Observable<any> { return this.http.delete<any>(`${this.apiUrl}/medicamentos/${medicamentoId}`, this.createAuthHeaders()).pipe(catchError((error) => this.handleError('deleteUser', error)));}


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
