import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MyServiceService } from '../my-service.service';
import { JobPosting } from '../interface';

@Component({
  selector: 'app-jobform',
  templateUrl: './jobform.component.html',
  styleUrls: ['./jobform.component.css']
})
export class JobformComponent implements OnInit {
  jobForm: FormGroup;
  experienceOptions = ['Entry Level', 'Mid Level', 'Senior Level'];
  jobTypeOptions = ['Part Time', 'Internship', 'Full Time'];
  jobId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private dataservice: MyServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.jobForm = this.fb.group({
      companyName: ['', Validators.required],
      jobTitle: ['', Validators.required],
      jobLink: ['', Validators.required],
      jobDescription: ['', Validators.required],
      location: ['', Validators.required],
      duration: [null, [Validators.required, Validators.min(1)]],
      stipend: [null, [Validators.required, Validators.min(0)]],
      applyBy: ['', Validators.required],
      startDate: ['', Validators.required],
      requirements: ['', Validators.required],
      perks: [''],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPhone: ['', Validators.required],
      experience: ['', Validators.required],
      jobType: ['', Validators.required],
      webStack: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.jobId = params['id'] ? +params['id'] : null;
      if (this.jobId) {
        this.loadJobDetails();
      }
    });
  }

  get webStackArray(): FormArray {
    return this.jobForm.get('webStack') as FormArray;
  }

  addWebStack(): void {
    this.webStackArray.push(this.fb.group({
      technology: ['']
    }));
  }

  removeWebStack(index: number): void {
    this.webStackArray.removeAt(index);
  }

  loadJobDetails(): void {
    if (this.jobId) {
      this.dataservice.getjobDetails().subscribe(jobs => {
        const job = jobs.find(job => job.id === this.jobId);
        if (job) {
          this.jobForm.patchValue(job);
          const webStacks = job.webStacks || [];
          this.webStackArray.clear();
          webStacks.forEach(stack => this.webStackArray.push(this.fb.group({ technology: [stack.technology] })));
        } else {
          console.error('Job not found');
        }
      });
    }
  }

  onSubmit(): void {
    if (this.jobForm.valid) {
      const jobPosting: JobPosting = this.prepareJobPostingData();
      if (this.jobId) {
        jobPosting.id=this.jobId;
        this.updateJobDetails(jobPosting);
      } else {
        this.postJobDetails(jobPosting);
      }
    } else {
      console.log('Form is invalid');
    }
  }

  private prepareJobPostingData(): JobPosting {
    const formValue = this.jobForm.value;
    return {
      ...formValue,
      webStacks: this.webStackArray.value.map((item: { technology: string }) => ({ technology: item.technology }))
    };
  }

  private postJobDetails(jobPosting: JobPosting): void {
    this.dataservice.postJobDetails(jobPosting).subscribe(() => {
      this.updateLocalStorage(jobPosting);
      this.router.navigate(['/adminpage']);
    });
  }

  private updateJobDetails(jobPosting: JobPosting): void {
    if (this.jobId) {
      this.dataservice.postJobDetails(jobPosting).subscribe(() => {
        this.updateLocalStorage(jobPosting);
        this.router.navigate(['/adminpage']);
      });
    }
  }

  private updateLocalStorage(updatedJob: JobPosting): void {
    let jobData = localStorage.getItem('jobData');
    let jobs: JobPosting[] = jobData ? JSON.parse(jobData) : [];
    if (this.jobId) {
      jobs = jobs.map(job => job.id === this.jobId ? updatedJob : job);
    } else {
      jobs.push(updatedJob);
    }
    localStorage.setItem('jobData', JSON.stringify(jobs));
  }
}
