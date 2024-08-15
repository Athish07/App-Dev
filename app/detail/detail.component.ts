import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  infoSections = [
    {
      iconClass: 'fas fa-briefcase',
      title: 'Career Opportunities',
      description: 'Explore a diverse range of job opportunities from leading companies worldwide. Your next career move is just a click away.'
    },
    {
      iconClass: 'fas fa-user-friends',
      title: 'Networking & Growth',
      description: 'Connect with industry leaders and peers to expand your professional network and accelerate your career growth.'
    },
    {
      iconClass: 'fas fa-chart-line',
      title: 'Professional Development',
      description: 'Access resources and tools that enhance your skills and improve your employability in the competitive job market.'
    }
  ];

  jobsPosted: number = 0;
  employers: number = 0;
  jobSeekers: number = 0;
  investment: number = 0;
  hasCounted: boolean = false;

  @ViewChild('statsSection', { static: true }) statsSection!: ElementRef;

  constructor() {}

  ngOnInit(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.hasCounted) {
        this.startCounting();
        this.hasCounted = true;
      }
    }, options);

    observer.observe(this.statsSection.nativeElement);
  }

  startCounting(): void {
    this.incrementCounter((value) => this.jobsPosted = value, 1500, 30, 10);
    this.incrementCounter((value) => this.employers = value, 200, 5, 20);
    this.incrementCounter((value) => this.jobSeekers = value, 3000, 50, 10);
    this.incrementCounter((value) => this.investment = value, 50, 1, 200);
  }

  incrementCounter(setter: (value: number) => void, finalValue: number, increment: number, delay: number): void {
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= finalValue) {
        setter(finalValue);
        clearInterval(interval);
      } else {
        setter(current);
      }
    }, delay);
  }
}
