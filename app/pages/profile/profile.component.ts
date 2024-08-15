import { Component, OnInit } from '@angular/core';
import { MyServiceService } from 'src/app/my-service.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: any = {
    fullName: '',
    email: '',
    password: '',
    profileImageUrl: '',
  };

  isEditMode = false;
  showPassword = false;
  selectedFile: File | null = null;
  uploadPercent: number | undefined;
  previewImageUrl: string | ArrayBuffer | null = null; // Added to hold the preview URL

  constructor( private router: Router,public dataservice: MyServiceService, private storage: AngularFireStorage) {}

  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails(): void {
    this.dataservice.getuser().subscribe(
      (res: any) => {
        this.user = res;
      
        console.log('User details:', this.user);
      },
      (error) => {
        console.error('Error loading user details:', error);
      }
    );
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  saveChanges() {
    if (this.selectedFile) {
      const filePath = `profile_images/${Date.now()}_${this.selectedFile.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.selectedFile);

      task.percentageChanges().subscribe((percent: number | undefined) => {
        this.uploadPercent = percent || 0;
      });

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.user.profileImageUrl = url;
            this.updateUserDetails();
          });
        })
      ).subscribe();
    } else {
      // If no file selected, just update user details
      this.updateUserDetails();
    }
  }

  updateUserDetails() {
    console.log('Updating user with details:', this.user); // Debugging
    this.dataservice.updateUser(this.user).subscribe(
      (res: any) => {
        console.log('User details updated:', res);
        this.getUserDetails(); // Refresh user details
        this.toggleEditMode(); // Exit edit mode
      },
      (error) => {
        console.error('Error updating user details:', error);
      }
    );
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
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
}
