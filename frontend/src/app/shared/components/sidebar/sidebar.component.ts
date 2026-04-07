import { Component, inject, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { MotionService } from '../../../core/services/motion.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements AfterViewInit {
  authService = inject(AuthService);
  currentUser$ = this.authService.currentUser$;
  private motion = inject(MotionService);

  ngAfterViewInit() {
    this.motion.slideInLeft('.nav-item');
  }
}
