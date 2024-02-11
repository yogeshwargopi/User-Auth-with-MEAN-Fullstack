import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router:Router, private http:HttpClient) { }

  isAuthenticated():boolean{
    if (sessionStorage.getItem('token') != null) {
      console.log(true);
      
        return true;
    }
    return false; 
  }

  canAcess() {
    if (!this.isAuthenticated()) {      
      this.router.navigate(['/login']);
    }
  }

   canAuthenticate(){
    if (this.isAuthenticated()) {
      //redirect to dashboard
      this.router.navigate(['/dashboard']);
    }
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http
      .post(
        'http://localhost:8080/signup',
        { firstname: name, email: email, password: password }
      );
  }

  storeToken(token: string) {
    
    sessionStorage.setItem(
      'token', token);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post('http://localhost:8080/login', { email, password });
  }

  removeToken(){
    sessionStorage.removeItem('token');
  }

  private getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  // Function to set up HTTP headers with the JWT token
  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    if (token) {
      return new HttpHeaders({
        'Authorization': `${token}`
      });
    } else {
      // If token is not available, return headers without Authorization header
      return new HttpHeaders();
    }
  }


  getUserDetails(): Observable<any> {
     const headers = this.getHeaders();
    return this.http.get('http://localhost:8080/user',{headers});
  }

  

}
