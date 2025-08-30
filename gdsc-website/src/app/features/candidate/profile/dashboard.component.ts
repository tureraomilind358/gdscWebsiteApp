import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  stats = {
    examsTaken: 12,
    averageScore: 85,
    certificatesEarned: 8,
    upcomingExams: 2
  };
  
  recentExams = [
    {
      id: 1,
      title: 'Web Development Fundamentals',
      score: 92,
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: 2,
      title: 'Python Programming',
      score: 88,
      date: '2024-01-10',
      status: 'completed'
    },
    {
      id: 3,
      title: 'Machine Learning Basics',
      score: null,
      date: '2024-01-25',
      status: 'upcoming'
    }
  ];

  quickActions = [
    { icon: 'fas fa-book', label: 'Take Exam', route: '/exams', color: '#3498db' },
    { icon: 'fas fa-certificate', label: 'View Certificates', route: '/certificates', color: '#e74c3c' },
    { icon: 'fas fa-chart-line', label: 'Progress Report', route: '/progress', color: '#2ecc71' },
    { icon: 'fas fa-cog', label: 'Settings', route: '/settings', color: '#f39c12' }
  ];

today=new Date()
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
  }

  getStatusClass(status: string): string {
    return status === 'completed' ? 'status-completed' : 'status-upcoming';
  }

  getScoreClass(score: number | null): string {
    if (score === null) return '';
    if (score >= 90) return 'score-excellent';
    if (score >= 80) return 'score-good';
    if (score >= 70) return 'score-average';
    return 'score-poor';
  }
}
