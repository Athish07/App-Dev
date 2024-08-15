import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobListingsPageComponent } from './job-listings-page.component';

describe('JobListingsPageComponent', () => {
  let component: JobListingsPageComponent;
  let fixture: ComponentFixture<JobListingsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobListingsPageComponent]
    });
    fixture = TestBed.createComponent(JobListingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
