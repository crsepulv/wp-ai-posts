import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideCopy, lucideCopyCheck } from '@ng-icons/lucide';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-copy-btn',
  standalone: true,
  imports: [NgIconComponent, CommonModule],
  providers: [
    provideIcons({
      lucideCopy,
      lucideCopyCheck,
    }),
  ],
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
        class="p-2 bg-transparent text-white rounded-md inline-flex justify-center items-center "
      >
        @if (isCopied) {
        <span>
          <ng-icon name="lucideCopyCheck" />
        </span>
        }@else {
        <span>
          <ng-icon name="lucideCopy" />
        </span>
        }
      </button>
    </div>
  `,
})
export class CopyBtnComponent {
  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    public postsService: PostsService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  isCopied = false;

  copyClick() {
    this.isCopied = true;

    setTimeout(() => {
      this.isCopied = false;
    }, 2000);
  }

  async setCode() {
    if (this.isBrowser) {
      try {
        const copiedText = await navigator.clipboard.readText();
        this.postsService.postForm.get('content')?.setValue(copiedText);
        this.postsService.newPostSheet = true;
      } catch (error) {
        console.error('Error al leer el contenido del portapapeles:', error);
      }
    }
  }
}
