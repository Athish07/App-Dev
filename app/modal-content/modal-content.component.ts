import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { JobPosting } from '../interface';
import { MyServiceService } from '../my-service.service';

@Component({
  selector: 'app-modal-content',
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.css'],
})
export class ModalContentComponent implements OnInit {
  job!: JobPosting;  // Ensure that `job` is always defined
  isVisible = false;
  encodedJob: string = '';

  constructor(
    public dataservice: MyServiceService,
    public dialogRef: MatDialogRef<ModalContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { jobId: number }
  ) {}

  ngOnInit(): void {
    this.loadJobData();
  }

  loadJobData(): void {
    this.dataservice.getjobDetails().subscribe({
      next: (data) => {
        // Find the job with the matching ID
        this.job = data.find((job) => job.id === this.data.jobId) as JobPosting;
        if (!this.job) {
          console.error('Job not found in fetched data');
        }
        this.saveJobData();
      },
      error: (error) => {
        console.error('Error fetching job data:', error);
      }
    });
  }

  saveJobData(): void {
    // Assuming this is needed for some reason
    localStorage.setItem('job', JSON.stringify(this.job));
  }

  handleCheckKnowledge(): void {
    this.isVisible = true;
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
