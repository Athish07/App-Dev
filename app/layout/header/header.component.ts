import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarService } from 'src/app/service/sidebar/sidebar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private sidebarService: SidebarService, private router: Router) {}

  ngOnInit(): void {
      this.toggleSidebar();
  }

  isLanding(): boolean {
    const currentRoute = this.router.url;
    return currentRoute === '/';
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
}
