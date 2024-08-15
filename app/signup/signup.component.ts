import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MyServiceService} from '../my-service.service'
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{

  userName:any='';
  password:any='';
  email:any='';
  
  ngOnInit(): void {
    
  }

  constructor(public dataservice: MyServiceService, public router:Router)
  {

  }

  onClick(): void {
    this.dataservice.postdetails(this.userName, this.email, this.password).subscribe({
      next: (response) =>
        {
          console.log('Success:', response),

          this.router.navigate(['/sign-in'])
          
        },
         
      error: (error) => console.error('Error:', error),
    });
    
    
  }
  

}
