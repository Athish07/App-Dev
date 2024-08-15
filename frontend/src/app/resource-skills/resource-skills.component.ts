import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobPosting } from '../interface';

interface Resource {
  type: string;
  link: string;
  title: string;
}

@Component({
  selector: 'app-resource-skills',
  templateUrl: './resource-skills.component.html',
  styleUrls: ['./resource-skills.component.css']
})
export class ResourceSkillsComponent implements OnInit {
  job: JobPosting | null = null;
  resources: { [key: string]: Resource[] } = {};
  loading = false;
  error: string | null = null;
  skillset: string = '';
  show = false;
  txtshow = true;
  jobId: string | null = null;
  skills: string[] = []; // To store converted skills from webStacks

  private API_KEY = 'AIzaSyBYOhBkzDl6qp2KhM7kRgEtgMVWLKzcCfY';
  API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.API_KEY}`;
  
  skillForm: FormGroup;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.skillForm = this.fb.group({
      skills: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    
      this.loadJobDataFromLocalStorage();
    
  }

  loadJobDataFromLocalStorage(): void {
    const jobData = localStorage.getItem('job');
    if (jobData) {
      try {
        this.job = JSON.parse(jobData) as JobPosting;
        this.jobId = this.job.id.toString(); // Convert number to string

        // Add webStacks technologies to skills with camel case values
        this.skills = this.job.webStacks.map(stack => 
          stack.technology
            .trim() // Remove leading and trailing spaces
            .replace(/\s+(.)/g, (match, p1) => p1.toUpperCase()) // Convert spaces to camel case
            .replace(/\s+/g, '') // Remove remaining spaces
        );

        console.log('Skills after adding webStacks:', this.skills);
      } catch (error) {
        console.error('Error parsing job data from localStorage:', error);
      }
    }
  }

  fetchResources(): void {
    if (!this.skillset && !this.job) {
      this.error = 'Please enter skills or wait for job data to load.';
      return;
    }

    const skills = this.skillset || (this.job && this.skills.join(', '));
    this.loading = true;
    this.error = null;
    this.txtshow = false;

    this.http.post(this.API_URL, {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `For the skills: ${skills}, provide a list of best online resources more than 5, including links to roadmap, articles, courses, coding practice, and tutorials that can help in further learning and practice. Give it in form of skill and array of type, link, and title.`
            }
          ]
        },
        {
          role: 'user',
          parts: [
            {
              text: 'INSERT_INPUT_HERE'
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 1,
        topK: 64,
        topP: 0.95,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json'
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ]
    }).subscribe({
      next: (response: any) => {
        try {
          const content = JSON.parse(response.candidates[0].content.parts[0].text);
          this.resources = content;
          this.show = true;
        } catch (error) {
          this.error = 'Error parsing response data.';
        }
      },
      error: (err) => {
        this.error = 'An error occurred while fetching resources.';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  getSkillKeys(): string[] {
    return Object.keys(this.resources);
  }
}
