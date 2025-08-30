import { Component } from '@angular/core';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent {
 users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Candidate' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Examiner' },
    { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'Admin' }
  ];
}
