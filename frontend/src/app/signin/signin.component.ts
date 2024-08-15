import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MyServiceService } from '../my-service.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  email: string = '';
  password: string = '';

  constructor(private dataservice: MyServiceService, private router: Router, private toastr: ToastrService) {}

  onClick(): void {
    this.dataservice.postsigin(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Success:', response);
        const token = response.token;
        const expiresIn = response.expiresIn;

        // Set cookie with JWT token
        this.setCookie('jwtToken', token, expiresIn);

        // Show success toast
        this.toastr.success('Sign in successful!', 'Success');

        // Navigate to the home page upon successful sign-in
        this.router.navigate(['/home']);

        // Call filterjobs after successful sign-in
        console.log(this.email);
        this.dataservice.filterjobs(this.email).subscribe({
          next: (res) => {
            console.log("Filtered successfully", res);
          },
          error: (error) => {
            console.error('Error fetching filtered jobs:', error);
            this.toastr.error('Error fetching filtered jobs.', 'Error');
          }
        });
      },
      error: (error) => {
        console.error('Error:', error);
        // Show error toast
        this.toastr.error('Sign in failed. Please check your credentials and try again.', 'Error');
      }
    });
  }

  setCookie(name: string, value: string, expiresIn: number): void {
    const date = new Date();
    date.setTime(date.getTime() + expiresIn);
    const expires = 'expires=' + date.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/`;
    console.log(document.cookie);
  }
}
