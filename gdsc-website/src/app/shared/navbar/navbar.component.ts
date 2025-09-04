import { Component, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, User, UserRole } from '../../core/auth/auth.service';
import { Subscription } from 'rxjs';


export interface NavItem {
  path: string;
  label: string;
  icon: string;
  requiresAuth?: boolean;
  roles?: UserRole[];
  children?: NavItem[];
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  // UI State
  mobileMenuOpen = false;
  userMenuOpen = false;
  isScrolled = false;
  
  // User Data
  currentUser: User | null = null;
  
  // Enums for template
  UserRole = UserRole;
  
  // Navigation items with role-based access control
  navItems: NavItem[] = [
    { 
      path: '/', 
      label: 'Home', 
      icon: 'home' 
    },
    { 
      path: '/about', 
      label: 'About Us', 
      icon: 'info-circle' 
    },
    { 
      path: '/courses', 
      label: 'Courses', 
      icon: 'book', 
      requiresAuth: true 
    },
    { 
      path: '/exams', 
      label: 'Exams', 
      icon: 'clipboard-list',
      requiresAuth: true,
      roles: [UserRole.STUDENT, UserRole.CENTRE_ADMIN, UserRole.SUPER_ADMIN]
    },
    { 
      path: '/certificates', 
      label: 'Certificates', 
      icon: 'award',
      requiresAuth: true,
      roles: [UserRole.STUDENT, UserRole.CENTRE_ADMIN, UserRole.SUPER_ADMIN]
    },
    { 
      path: '/admin', 
      label: 'Admin', 
      icon: 'user-shield', 
      requiresAuth: true, 
      roles: [UserRole.SUPER_ADMIN],
      children: [
        { path: '/admin/centres', label: 'Manage Centres', icon: 'building' },
        { path: '/admin/users', label: 'Manage Users', icon: 'users' },
        { path: '/admin/reports', label: 'Reports', icon: 'chart-bar' }
      ]
    }
  ];

  private userSubscription: Subscription = new Subscription;
  private router = inject(Router);
  private authService = inject(AuthService);

  constructor() {}

  ngOnInit(): void {
    // Subscribe to authentication state changes
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 50;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    // Close user menu when mobile menu is toggled
    if (this.mobileMenuOpen) {
      this.userMenuOpen = false;
    }
  }

  toggleUserMenu(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.userMenuOpen = !this.userMenuOpen;
    console.log(this.userMenuOpen);
    
    // Close mobile menu when user menu is toggled
    if (this.userMenuOpen) {
      console.log('toggleUserMenu clicked');
      this.mobileMenuOpen = false;
    }
  }

  closeMenus(): void {
    this.mobileMenuOpen = false;
    this.userMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown') && !target.closest('.navbar-toggler')) {
      this.closeMenus();
    }
  }

  // Check if user has required role for a navigation item
  canShowNavItem(item: NavItem): boolean {
    // Public route
    if (!item.requiresAuth) return true;
    
    // Protected route but no user logged in
    if (!this.currentUser) return false;
    
    // No specific roles required, just needs authentication
    if (!item.roles || item.roles.length === 0) return true;
    
    // Check if user's role is in the allowed roles
    return item.roles.includes(this.currentUser.role as UserRole);
  }
  
  // Check if current user has a specific role
  hasRole(role: UserRole): boolean {
    return this.currentUser?.role === role;
  }
  
  // Get user initials for avatar
  getUserInitials(): string {
    if (!this.currentUser) return 'U';
    return (this.currentUser.firstName?.[0] || '') + (this.currentUser.lastName?.[0] || '');
  }
  
  // Get user role display name
  getUserRoleDisplay(): string {
    if (!this.currentUser) return 'Guest';
    
    switch(this.currentUser.role) {
      case UserRole.SUPER_ADMIN: return 'Super Admin';
      case UserRole.CENTRE_ADMIN: return 'Centre Admin';
      case UserRole.STUDENT: return 'Student';
      default: return 'User';
    }
  }

  // Auth state methods
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  login(): void {
    this.router.navigate(['/login']);
    this.closeMenus();
  }

  logout(): void {
    this.authService.logout();
    this.closeMenus();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    // Clean up the subscription
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
