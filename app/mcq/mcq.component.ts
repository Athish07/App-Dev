import { Component, OnInit } from '@angular/core';
import { GeminiService } from '../gemini.service';
import { ActivatedRoute } from '@angular/router';
import { JobPosting } from '../interface';
import { MyServiceService } from '../my-service.service';

interface Question {
  question: string;
  options: string[];
  answer: string;
}

@Component({
  selector: 'app-mcq',
  templateUrl: './mcq.component.html',
  styleUrls: ['./mcq.component.css'],
})
export class McqComponent implements OnInit {
  mcqs: { [key: string]: Question[] } = {};
  userAnswers: { [key: string]: { [index: number]: string } } = {};
  showScore = false;
  scores: { [key: string]: number } = {};
  skills: string[] = []; // Example initial skills
  loading = true; // To manage loading state
  jobId!: number;
  jobquize!: JobPosting;

  constructor(
    private geminiService: GeminiService,
    private route: ActivatedRoute,
    public dataservice: MyServiceService
  ) {}

  ngOnInit(): void {
    this.loadJobDataFromLocalStorage();
    this.loadMCQs();
  }

  loadJobDataFromLocalStorage(): void {
    const jobData = localStorage.getItem('job');
    if (jobData) {
      try {
        const job: JobPosting = JSON.parse(jobData);
        this.jobId = job.id;
        this.jobquize = job;
    
        // Add webStacks technologies to skills with camel case values
        job.webStacks.forEach((stack) => {
          const technology = stack.technology
            .trim() // Remove leading and trailing spaces
            .replace(/\s+(.)/g, (match, p1) => p1.toUpperCase()) // Convert spaces to camel case
            .replace(/\s+/g, ''); // Remove remaining spaces
  
          if (technology && !this.skills.includes(technology)) {
            this.skills.push(technology);
          }
        });
    
        console.log('Skills after adding webStacks:', this.skills);
      } catch (error) {
        console.error('Error parsing job data from localStorage:', error);
      }
    }
  }  

  loadMCQs(): void {
    this.geminiService.generateMCQs(this.skills).subscribe({
      next: (response) => {
        console.log('Response:', response);
        this.parseResponse(response);
        this.loading = false; // Set loading to false once data is loaded
      },
      error: (err) => {
        console.error('Error fetching MCQs:', err);
        this.loading = false;
      },
    });
  }

  parseResponse(response: any): void {
    try {
      const skillMcqsText = response.candidates[0].content.parts[0].text;

      // Log the raw JSON data to inspect
      console.log('Raw JSON data:', skillMcqsText);

      // Optional: Replace problematic characters (if known)
      const sanitizedText = skillMcqsText.replace(/[\r\n]+/g, ''); // Example: Remove new lines

      // Try to parse the sanitized text
      const parsedResponse = JSON.parse(sanitizedText);

      if (parsedResponse && typeof parsedResponse === 'object') {
        Object.keys(parsedResponse).forEach((skill) => {
          const skillData = parsedResponse[skill];

          this.userAnswers[skill] = {};

          // Check if skillData is an array, if not, wrap it in an array
          const questions = Array.isArray(skillData) ? skillData : [skillData];

          this.mcqs[skill] = questions.map((q: any) => ({
            question: q.question,
            options: q.options,
            answer: q.answer,
          }));
        });

        console.log('Parsed MCQs:', this.mcqs);
      } else {
        console.error('Parsed response is not an object:', parsedResponse);
      }
    } catch (error) {
      console.error('Error parsing response:', error);
    }
  }

  hasMcqs(): boolean {
    return Object.keys(this.mcqs).length > 0;
  }

  submitAnswers(): void {
    this.calculateScores();
  }

  calculateScores(): void {
    this.skills.forEach((skill) => {
      let score = 0;
      this.mcqs[skill].forEach((q, i) => {
        if (this.userAnswers[skill][i] === q.answer) {
          score++;
        }
      });
      this.scores[skill] = score;
    });
    this.showScore = true;
  }
}
