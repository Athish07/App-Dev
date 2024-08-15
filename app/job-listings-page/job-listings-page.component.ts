import { Component, OnInit } from '@angular/core';
import { Job, JobListing } from '../interface';
import { MyServiceService } from '../my-service.service';

@Component({
  selector: 'app-job-listings-page',
  templateUrl: './job-listings-page.component.html',
  styleUrls: ['./job-listings-page.component.css']
})
export class JobListingsPageComponent implements OnInit {
  job: JobListing | null = null;
  isVisible = false;

  constructor(public dataservice: MyServiceService)
  {

  }

  ngOnInit(): void {
    this.dataservice.fetchJobData().subscribe((data:JobListing) => {
      this.job = data;
    });
  }

 

  handleCheckKnowledge(): void {
    this.isVisible = true;
  }
}
