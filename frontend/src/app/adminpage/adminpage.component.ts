import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyServiceService } from '../my-service.service';
import { JobPosting } from '../interface';

@Component({
  selector: 'app-adminpage',
  templateUrl: './adminpage.component.html',
  styleUrls: ['./adminpage.component.css'],
})
export class AdminpageComponent implements OnInit {
  jobData: JobPosting[] = [];
  editJobId: number | null = null;

  constructor(private dataservice: MyServiceService, private router: Router) {}

  ngOnInit(): void {
    this.loadJobData();
  }

  loadJobData(): void {
    this.dataservice.getjobDetails().subscribe({
      next: (data) => {
        this.jobData = data;
        this.saveJobData();
      },
      error: (error) => {
        console.error('Error fetching job data:', error);
      }
    });
  }

  saveJobData(): void {
    localStorage.setItem('jobData', JSON.stringify(this.jobData));
  }

  handleEdit(jobId: number): void {
    this.router.navigate(['/jobform'], { queryParams: { id: jobId } });
  }

  handleAddJob(): void {
    this.router.navigate(['/jobform']);
  }

  updateJobData(updatedJobData: JobPosting[]): void {
    this.jobData = updatedJobData;
    this.saveJobData();
  }

  deleteJob(id: number): void {

    this.dataservice.deletejob(id).subscribe();
    // Retrieve the current list of jobs from local storage
    const storedJobs = JSON.parse(localStorage.getItem('jobData') || '[]');
  
    // Filter out the job with the specified id
    const updatedJobs = storedJobs.filter((job: any) => job.id !== id);
  
    // Update local storage with the new list of jobs
    localStorage.setItem('jobData', JSON.stringify(updatedJobs));
  
    // Update the component's jobData to reflect changes
    this.jobData = updatedJobs;
  
    console.log(`Job with ID ${id} deleted successfully.`);
  }
  
  }



