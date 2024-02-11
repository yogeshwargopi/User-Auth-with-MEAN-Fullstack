import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  user: any;
constructor(private auth: AuthService) { }
  
  ngOnInit(): void{
    this.auth.canAcess();
    this.auth.getUserDetails()
    .subscribe({
      next: (data: any) => {
        this.user = data.name;
      },
      error: (error: any) => {
        console.error('An error occurred while fetching user details:', error);
      }
    });
  }
}
