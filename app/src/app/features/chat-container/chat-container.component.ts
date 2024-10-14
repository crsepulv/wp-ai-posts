import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucidePencil,
  lucidePlus,
  lucideSettings,
  lucideTrash2,
  lucideX,
} from '@ng-icons/lucide';

import { v4 as uuidv4 } from 'uuid';
import { Base64 } from 'js-base64'; // Si estás usando la biblioteca js-base64
import {
  CommonModule,
  isPlatformBrowser,
  isPlatformServer,
} from '@angular/common';
import { ModalComponent } from '../../ui/modal/modal.component';
import { SheetComponent } from '../../ui/sheet/sheet.component';
import { ChatComponent } from '../chat/chat.component';
import { PostsService } from '../../services/posts.service';

const WP_USER = 'michell';
const WP_PASSWORD = 'xKAB rZ9s OmlX QNlR 69JR 9XOy';
const WP_URL = 'http://localhost:80/test/index.php/wp-json/wp/v2/posts/';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgIconComponent,
    ReactiveFormsModule,
    SheetComponent,
    ChatComponent,
    ModalComponent,
    CommonModule,
  ],
  providers: [
    provideIcons({
      lucideX,
      lucideTrash2,
      lucidePlus,
      lucidePencil,
      lucideSettings,
    }),
  ],
  templateUrl: './chat-container.component.html',
  styleUrl: './chat-container.component.scss',
})
export class ChatContainerComponent implements OnInit {
  currentPostId: string = '';
  posts: any = {};
  showMobilePostsList = false;

  isPublishing = false;
  isSaving = false;
  isBrowser: boolean;
  isServer: boolean;
  error = false;

  modalOpen = false;

  // Sheet editor
  newPostSheet = false;
  editPostSheet = false;

  constructor(
    protected http: HttpClient,
    public postsService: PostsService,
    @Inject(PLATFORM_ID) protected platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.isServer = isPlatformServer(platformId);
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  iterateObjectKeysAndValues(obj: any): { key: string; value: any }[] {
    return Object.entries({ ...obj }).map(([key, value]) => ({ key, value }));
  }

  async ngOnInit() {
    if (this.isBrowser) {
      this.getPostsFromLocalStorage();
    }
  }

  getPostsFromLocalStorage() {
    const storedPosts = localStorage.getItem('posts');

    // Si hay mensajes almacenados, convertirlos a un array, de lo contrario, inicializar un array vacío
    const existingPosts = storedPosts ? JSON.parse(storedPosts) : {};

    this.posts = existingPosts;
  }

  setPostsInLocalStorage() {
    window.localStorage.setItem('posts', JSON.stringify(this.posts));
  }

  publishOnWordpress(id: string) {
    this.posts[id].publishing = true;

    const title = this.posts[id].title;

    const content = this.posts[id].content;

    const encodedCredentials = Base64.encode(`${WP_USER}:${WP_PASSWORD}`);

    const authHeader = `Basic ${encodedCredentials}`;

    if (this.posts[this.currentPostId]?.id) {
      this.http
        .put(
          `${WP_URL}/${this.posts[this.currentPostId]?.id}`,
          {
            title,
            content,
            status: 'publish',
          },
          {
            headers: {
              Authorization: authHeader,
            },
          }
        )
        .subscribe({
          next: (r: any) => {
            this.posts[this.currentPostId] = {
              title,
              content,
              status: 'publish',
              updated: true,
              id: r.id,
            };
          },
          error: (e) => {
            this.isPublishing = false;
            this.error = true;

            setTimeout(() => {
              this.error = false;
            }, 2000);
          },
          complete: () => {
            this.isPublishing = false;
            this.postsService.editPostSheet = false;
            this.setPostsInLocalStorage();
          },
        });
    } else {
      this.http
        .post(
          WP_URL,
          {
            title,
            content,
            status: 'publish',
          },
          {
            headers: {
              Authorization: authHeader,
            },
          }
        )
        .subscribe({
          next: (r: any) => {
            console.log(r);
            this.posts[id].updated = true;
            this.posts[id].id = r.id;
          },
          error: (e) => {
            console.log(this.error);
          },
          complete: () => {
            this.posts[id].publishing = false;
            this.postsService.editPostSheet = false;
            this.setPostsInLocalStorage();
          },
        });
    }
  }

  saveNewPostOnWordpress() {
    this.isPublishing = true;
    const newPostId = uuidv4();

    const title = this.postsService.postForm.get('title')?.value;
    const content = this.postsService.postForm.get('content')?.value;

    const encodedCredentials = Base64.encode(`${WP_USER}:${WP_PASSWORD}`);

    const authHeader = `Basic ${encodedCredentials}`;

    this.http
      .post(
        `${WP_URL}`,
        {
          title,
          content,
          status: 'publish',
        },
        {
          headers: {
            Authorization: authHeader,
          },
        }
      )
      .subscribe({
        next: (r: any) => {
          this.posts[newPostId] = {
            title,
            content,
            status: 'publish',
            updated: true,
            id: r.id,
          };
        },
        error: (e) => {
          this.isPublishing = false;
          this.error = true;

          setTimeout(() => {
            this.error = false;
          }, 2000);
        },
        complete: () => {
          this.isPublishing = false;
          this.postsService.newPostSheet = false;
          this.setPostsInLocalStorage();
        },
      });
  }

  editOnWordpress() {
    this.isPublishing = true;

    const title = this.postsService.postForm.get('title')?.value;
    const content = this.postsService.postForm.get('content')?.value;

    const encodedCredentials = Base64.encode(`${WP_USER}:${WP_PASSWORD}`);

    const authHeader = `Basic ${encodedCredentials}`;

    const id = this.posts[this.currentPostId].id;

    this.http
      .put(
        `${WP_URL}/${id}`,
        {
          title,
          content,
          status: 'publish',
        },
        {
          headers: {
            Authorization: authHeader,
          },
        }
      )
      .subscribe({
        next: (r: any) => {
          this.posts[this.currentPostId] = {
            title,
            content,
            status: 'publish',
            updated: true,
            id: r.id,
          };
        },
        error: (e) => {
          this.isPublishing = false;
          this.error = true;

          setTimeout(() => {
            this.error = false;
          }, 2000);
        },
        complete: () => {
          this.isPublishing = false;
          this.setPostsInLocalStorage();
        },
      });
  }

  openEditor(id: string) {
    const { title, content } = this.posts[id];
    this.postsService.postForm.get('title')?.setValue(title);
    this.postsService.postForm.get('content')?.setValue(content);

    this.currentPostId = id;
    this.postsService.editPostSheet = true;
  }

  clearForm() {
    this.postsService.postForm.reset();
  }

  // Open and Close Editor Sheet
  toggleNewPostSheet() {
    this.postsService.newPostSheet = !this.postsService.newPostSheet;
    this.clearForm();
  }

  toggleEditPostSheet() {
    this.postsService.editPostSheet = !this.postsService.editPostSheet;
    this.clearForm();
  }

  toggleModal() {
    this.modalOpen = !this.modalOpen;
  }

  toggleMobilePostList() {
    this.showMobilePostsList = !this.showMobilePostsList;
  }

  openModal(id: string) {
    this.currentPostId = id;

    this.modalOpen = true;
  }

  // CRUD

  newPost() {
    this.isSaving = true;
    const newPostId = uuidv4();

    const title = this.postsService.postForm.get('title')?.value;
    const content = this.postsService.postForm.get('content')?.value;

    this.posts[newPostId] = {
      title,
      content,
      status: 'draft',
      updated: false,
    };

    this.setPostsInLocalStorage();

    this.clearForm();
    this.postsService.newPostSheet = false;
    this.isSaving = false;
  }

  editPost() {
    const title = this.postsService.postForm.get('title')?.value;
    const content = this.postsService.postForm.get('content')?.value;

    this.posts[this.currentPostId] = {
      title,
      content,
      status: 'draft',
      updated: false,
      id: this.posts[this.currentPostId].id,
    };

    this.setPostsInLocalStorage();
    this.clearForm();
    this.postsService.editPostSheet = false;
  }

  deletePost() {
    delete this.posts[this.currentPostId];
    this.toggleModal();

    this.setPostsInLocalStorage();
  }
}
