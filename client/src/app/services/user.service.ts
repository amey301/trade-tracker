import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface RegisterUser{
  username: String, 
  email: String, 
  password: String
}

interface LoginUser{
  username: String, 
  password: String
}


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  registerUser(payload: RegisterUser){
    return this.http.post('http://localhost:5000/v1/user/register', payload,{
  withCredentials: true  // MUST HAVE for cookies to work
})
  }

   loginUser(payload: LoginUser){
    return this.http.post('http://localhost:5000/v1/user/login', payload, {
  withCredentials: true  // MUST HAVE for cookies to work
})
  }
}
