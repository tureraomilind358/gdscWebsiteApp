import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService, UserRole } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    const requiredRoles = route.data['roles'] as UserRole[];
    const requiredRole = route.data['role'] as UserRole;

    // Check if user has any of the required roles
    if (requiredRoles && requiredRoles.length > 0) {
      if (!this.authService.hasAnyRole(requiredRoles)) {
        this.redirectToAppropriateRoute();
        return false;
      }
    }

    // Check for single required role
    if (requiredRole && !this.authService.hasRole(requiredRole)) {
      this.redirectToAppropriateRoute();
      return false;
    }

    return true;
  }

  private redirectToAppropriateRoute(): void {
    const user = this.authService.currentUserValue;
    console.log('this is user:', user);

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    // Redirect based on user role
    switch (user.role) {
      case UserRole.SUPER_ADMIN:
        this.router.navigate(['/super-admin']);
        break;
      case UserRole.CENTRE_ADMIN:
        this.router.navigate(['/centre-admin']);
        break;
      case UserRole.STUDENT:
        this.router.navigate(['/student']);
        break;
      default:
        this.router.navigate(['/unauthorized']);
    }

  }
}
