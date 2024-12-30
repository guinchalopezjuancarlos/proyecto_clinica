
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  constructor(private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    debugger
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
    if (user!=null) {
      const requiredRole = next.data['role'];
      if (requiredRole && (!user || user.role !== requiredRole)) {
        this.router.navigate(['not-authorized']); // Ruta de acceso denegado
        return false;
      }

      return true; // Permitir acceso
    }
    let token = localStorage.getItem('token');
    if (token && state.url != '/login') {
      return true;
    }
    else if (token && state.url == '/login') {
      this.router.navigate(['dashboard']);
      return false;
    }
    else if (!token && state.url != '/login') {
      this.router.navigate(['login']);
      return true;
    }
    return true;
  }
}
