import {Component} from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  constructor(public authService: AuthService ) {}
  isLoading = false;

  onSignup(form: NgForm){
    // console.log(form.value);
    if (form.invalid) {
      return;
    }
    this.authService.createNewUser(form.value.email, form.value.password);
  }
}
