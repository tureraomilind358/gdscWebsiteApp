import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  menuItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Profile', icon: 'person', route: '/profile' },
    { label: 'Exams', icon: 'quiz', route: '/exams' },
    { label: 'Results', icon: 'assessment', route: '/results' },
    { label: 'Certificates', icon: 'card_membership', route: '/certificates' },
    { label: 'Settings', icon: 'settings', route: '/settings' }
  ];

  toggleSidebar() {
    // Toggle sidebar logic
  }
}
