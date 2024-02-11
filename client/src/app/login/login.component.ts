import { Component,OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  formData = { email: "", password: "" }
  submit = false;
  errorMessage = "";
  loading = false;

  constructor(private auth:AuthService){}

  ngOnInit(): void {
    this.auth.canAuthenticate();
   }
  
  onSubmit() {
    this.auth.login(this.formData.email, this.formData.password)
      .subscribe({
        next: data => {
          if (data.status === 'Success') {
            console.log('Login successful');
            this.auth.storeToken(data.token);
            console.log('logged user token is '+data.token);
          this.auth.canAuthenticate();
            // Handle successful login, e.g., redirect to another page
          } else {
            console.log('Login failed',data.Error);
            this.errorMessage = data.Error;
          }
        },
        error: error => {
          console.error('An error occurred:', error);
          this.errorMessage = 'An error occurred. Please try again later.';
        }
    })
  }
}
