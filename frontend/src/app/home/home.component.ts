import { Component, OnInit } from '@angular/core';
import { MyServiceService } from '../my-service.service';
import { JobPosting } from '../interface';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ModalContentComponent } from '../modal-content/modal-content.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  jobdetails: JobPosting[] = [];

  filters = {
    profile: '',
    location: '',
    workFromHome: false,
    partTime: false,
    stipendMin: 0,
    stipendMax: 1000000,
  };

  constructor(
    private router: Router,
    private dataservice: MyServiceService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadJobDetails();
  }

  loadJobDetails(): void {
    this.dataservice.getjobDetails().subscribe(
      (res: JobPosting[]) => {
        this.jobdetails = res;
        console.log('Job details loaded:', this.jobdetails);
      },
      (error) => {
        console.error('Error loading job details:', error);
      }
    );
  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return `${value}`;
  }

  logout(): void {
    localStorage.removeItem('jobData');
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('tokenExpiration');
    this.clearCookies();
    this.router.navigate(['/sign-in']);
  }

  private clearCookies(): void {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }
  }

  clearFilters(): void {
    this.filters = {
      profile: '',
      location: '',
      workFromHome: false,
      partTime: false,
      stipendMin: 0,
      stipendMax: 1000000,
    };
    this.loadJobDetails();
  }

  applyFilters(): void {
    this.dataservice.searchJobPostings(this.filters).subscribe(
      (res: JobPosting[]) => {
        this.jobdetails = res;
        console.log('Filtered job details:', this.jobdetails);
      },
      (error) => {
        console.error('Error searching job postings:', error);
      }
    );
  }

  openDialog(jobId: number): void {
    this.dialog.open(ModalContentComponent, {
      width: '80%',
      maxWidth: '600px',
      panelClass: 'custom-modal-container',
      data: { jobId: jobId },
    });
  }
}
