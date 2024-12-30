import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BackendService } from 'src/services/backend.service';  // Asegúrate de que el servicio de backend esté importado

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required])
  });

  errorMessage: string = '';  // Aquí se guardará el mensaje de error
  isError: boolean = false;   // Esto controla si se muestra el mensaje de error

  constructor(private backendService: BackendService, private router: Router) {}

  login(): void {
    const { email, password } = this.loginForm.value;

    // Llamada al backend para autenticar al usuario
    this.backendService.login(email, password).subscribe(
      response => {
        // Si el login es exitoso, redirige al dashboard
        if (!response.error) {
        console.log('Login successful', response);
        localStorage.setItem('user', JSON.stringify(response.user));
          this.router.navigate(['/dashboard']);
        }
        this.errorMessage = response.error.message || 'Hubo un problema al iniciar sesión.';
        this.isError = true; // Esto asegura que se muestre el error en la interfaz
        console.error('Login failed', response.error);
      },
      error => {
        // Si ocurre un error, muestra el mensaje de error
        this.errorMessage = error.message || 'Hubo un problema al iniciar sesión.';
        this.isError = true; // Esto asegura que se muestre el error en la interfaz
        console.error('Login failed', error);
      }
    );
  }
}
