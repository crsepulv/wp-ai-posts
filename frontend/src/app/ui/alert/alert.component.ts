import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],

  template: `
    <div
      class="fixed top-1 z-[100] bg-white right-1 rounded-md border transition-all flex px-8 py-4 items-center gap-2"
      [ngClass]="{
    'scale-0 opacity-0 pointer-events-none': !postsService.error.showAlert,
    'scale-1 opacity-100 pointer-events-auto': !postsService.error.showAlert,
  }"
    >
      <p class="text-red-500">{{ postsService.error.message }}</p>
      <button
        (click)="closeAlert()"
        class="hover:opacity-80 inline-flex justify-center items-center"
      >
        <i class="fa-solid fa-x"></i>
      </button>
    </div>
  `,
})
export class AlertComponent {
  constructor(public postsService: PostsService) {}

  closeAlert() {
    this.postsService.error.showAlert = !this.postsService.error.showAlert;
  }
}
