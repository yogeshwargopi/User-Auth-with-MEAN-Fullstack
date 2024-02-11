import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
formdata = { name: "", email:"", password:"" }
  submit = false;
  errorMessage = "";
  loading = false;
  
  constructor(private auth:AuthService) { }
  
  ngOnInit(): void {
  }

  onsubmit() {
  this.errorMessage = '';
  this.loading = true;

  this.auth.register(this.formdata.name, this.formdata.email, this.formdata.password)
    .subscribe({
      next: data => {
         if (data.status === 'Success') {
            console.log('Login successful');
           this.loading = false;
        this.auth.storeToken(data.token);
        console.log(data);
        this.auth.canAuthenticate();
          } else {
            console.log('Registration failed',data.Error);
            this.errorMessage = data.Error;
          }
        
      },
      error: error => {
        console.error('An error occurred:', error);
          this.errorMessage = 'An error occurred. Please try again later.';
      }
    });
}

}
