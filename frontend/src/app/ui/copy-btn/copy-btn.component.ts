import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-copy-btn',
  template: `
  <div class="flex gap-2">
      <button
        (click)="setCode()"
        class="bg-black text-white rounded-xl p-2 font-bold"
      >
        Añadir
      </button>
      <button
        (click)="copyClick()"
        class="p-2 bg-transparent text-white rounded-md inline-flex justify-center items-center"
      >
        <ng-container *ngIf="isCopied">
          <span><i class="fa-solid fa-check"></i></span>
        </ng-container>
        <ng-container *ngIf="!isCopied">
          <span><i class="fa-regular fa-clipboard"></i></span>
        </ng-container>
      </button>
    </div>
  `,
})
export class CopyBtnComponent {
  constructor(public postsService: PostsService) {}

  isCopied = false;

  copyClick() {
    this.isCopied = true;

    setTimeout(() => {
      this.isCopied = false;
    }, 2000);
  }

  async setCode() {
    try {
      const copiedText = await navigator.clipboard.readText();
      this.postsService.postForm.get('content')?.setValue(copiedText);
      this.postsService.newPostSheet = true;
    } catch (error) {
      console.error('Error al leer el contenido del portapapeles:', error);
    }
  }
}
