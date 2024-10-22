import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { PostsService } from '../../services/posts.service';
import { SheetComponent } from '../../ui/sheet/sheet.component';
import { Router, RouterModule } from '@angular/router';
import { ModalComponent } from '../../ui/modal/modal.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SheetComponent,
    RouterModule,
    ModalComponent,
  ],
 
  templateUrl: './scrapper.component.html',
})
export class ScrapperComponent implements OnInit {
  scrappingForm!: FormGroup;
  addPostForm!: FormGroup;
  editPostForm!: FormGroup;
  scrappedData: any = {};

  resumeForm!: FormGroup;
  activeResumeForm = false;

  keyWords: any[] = [];

  isScrapping = false;
  isGenerating = false;

  resumeSheetIsOpen = false;
  addSheetIsOpen = false;
  editSheetIsOpen = false;

  showPosts = false;

  posts: any[] = [];
  currentIndex: number | null = null;
  editIndex!: number;
  confirmDelete: boolean = false;
  confirmDeleteAll: boolean = false;
  isPublishing: boolean = false;
  isGeneratingPosts = false;

  keywordForm!: FormGroup;

  constructor(
    fb: FormBuilder,
    public postsService: PostsService,
    protected router: Router,
    protected http: HttpClient
  ) {

    this.addPostForm = fb.group({
      title: ['', [Validators.required]],
    });

    this.editPostForm = fb.group({
      title: ['', [Validators.required]],
    });

    this.scrappingForm = fb.group({
      url: ['', [Validators.required, Validators.pattern('https?://.+'), Validators.minLength(5)]],
    });

    this.resumeForm = fb.group({
      description: ['', [Validators.required]],
      keyword: [''],
    });
  }

  ngOnInit(): void {
      this.getPostsFromLocalStorage();
  }

  getPostsFromLocalStorage() {
    const storedPosts = localStorage.getItem('ScrapperPosts');

    // Si hay mensajes almacenados, convertirlos a un array, de lo contrario, inicializar un array vacío
    const existingPosts = storedPosts ? JSON.parse(storedPosts) : [];

    console.log(storedPosts);

    this.posts = existingPosts; // Actualiza los posts en el servicio
  }

  setPostsInLocalStorage(posts: any[]) {
    window.localStorage.setItem('ScrapperPosts', JSON.stringify(posts));
  }

  generatePosts() {
    this.isGeneratingPosts = true;
    // Obtenemos los posts actuales desde el observable

    this.postsService.createHtmlPostWithAi(this.posts).subscribe({
      next: (r) => {
        console.log(r);

        const newPosts = JSON.parse(r.message);

        this.posts = newPosts;

        this.setPostsInLocalStorage(this.posts);
      },
      error: (error) => {
        console.log(error);
        this.postsService.handleError(
          'Error al generar el html de los posts. intentalo otra vez.'
        );
      },
      complete: () => {
        this.isGeneratingPosts = false;
      },
    });
  }

  addKeyword() {
    const keyword: string = this.resumeForm.get('keyword')?.value;

    this.keyWords.push(keyword);
  }

  removeKeyword(indexId: number) {
    this.keyWords = this.keyWords.filter((_, index) => index !== indexId);
  }

  publish() {
    console.log(this.postsService.WP_URL);
    console.log(this.postsService.WP_USER);
    console.log(this.postsService.WP_PASSWORD);

    //if(this.postsService.WP_URL.length)

    if (this.postsService.WP_URL.length <= 0) {
      this.postsService.openConf = true;
    } else {
      this.isPublishing = true; // Indicador de que se está publicando

      for (const post of this.posts) {
        const title = post.title;
        const content = post.content;

        // Llamar al servicio para publicar el post en WordPress
        this.postsService.publishPostOnWordpress(title, content).subscribe({
          next: (response) => {
            console.log(
              `Post "${title}" publicado con éxito en WordPress`,
              response
            );
            post.status = 'published'; // Marca el post como publicado
            post.id = response.id; // Asigna el ID de WordPress
          },
          error: (error) => {
            this.isPublishing = false;

            console.error(`Error al publicar el post "${title}":`, error);
            post.status = 'error'; // Marca el post como fallido si hubo un error
            this.postsService.handleError(
              'No se puedo publicar el post.'
            );
          },
          complete: () => {
            this.isPublishing = false;
          },
        });
      }
    }
  }

  fetchInfo(): void {
    this.isScrapping = true;
    const url = this.scrappingForm.get('url')?.value;


    this.postsService.extractInfo(url).subscribe({
      next: (data) => {
        const { title, description } = data;
        this.postsService.AiInfoAnalisis(title, description).subscribe({
          next: (data) => {
            console.log(data);

            const jsonData = JSON.parse(data.message);

            this.activeResumeForm = true;
            this.isScrapping = false;

            this.resumeSheetIsOpen = true;
            this.resumeForm.get('description')?.setValue(jsonData.resumen);

            this.keyWords = jsonData.palabras_claves;
          },
          error: (error) => {
            console.log(error);
            this.isScrapping = false;

            this.postsService.handleError(
              'No se pudo obtener la información del sitio. Intentelo nuevamente.'
            );
          },
          complete: () => {
            this.isScrapping = false;

          }
        });
      },
      error: (error) => {
        console.error('Error extracting article:', error);
        this.postsService.handleError(
          'No se pudo obtener la información del sitio. Intentelo nuevamente.'
        );
      },
    });
  }

  getListOfPosts() {
    this.isGenerating = true;
    this.postsService
      .generatePostTitles(
        this.resumeForm.get('description')?.value,
        this.keyWords
      )
      .subscribe({
        next: (data) => {
          const posts = JSON.parse(data.message); // Obtiene los posts generados en formato JSON
          this.isGenerating = false;

          const postsArray: any[] = posts.posts;

          console.log(postsArray);

          this.posts = postsArray.map((post: any) => {
            return { title: post, content: '' };
          });

          this.setPostsInLocalStorage(this.posts);
          this.showPosts = true;
        },
        error: (error) => {
          console.log(error);
          this.isGenerating = false;

          this.postsService.handleError(
            'No se pueod obtener la lista de de posts.'
          );
        },
        complete: () => {
          this.isGenerating = false;
          this.resumeSheetIsOpen = false;
        },
      });
  }

  addPost() {
    const title: string = this.addPostForm.get('title')?.value;

    const newPost = {
      title,
      content: '',
    };
    this.posts.push(newPost);

    this.toggleAddSheet();

    this.setPostsInLocalStorage(this.posts);
  }

  editPost() {
    const title: string = this.editPostForm.get('title')?.value;

    // Asigna el nuevo título directamente al elemento del array
    this.posts[this.editIndex].title = title;

    this.setPostsInLocalStorage(this.posts);

    this.toggleEditSheet();
  }

  deletePost() {
    console.log(this.currentIndex);

    this.posts = this.posts.filter((_, index) => index !== this.currentIndex);

    this.setPostsInLocalStorage(this.posts);

    this.toggleModal();
  }

  openConfirmationDeleteModal(index: number) {
    this.currentIndex = index;
    this.toggleModal();
  }

  deleteAllPosts() {
    this.posts = [];
    this.setPostsInLocalStorage(this.posts);

    this.toggleDeleteModalAll();
  }

  toggleResumeSheet() {
    this.resumeSheetIsOpen = !this.resumeSheetIsOpen;
  }

  toggleAddSheet() {
    this.addSheetIsOpen = !this.addSheetIsOpen;
  }

  toggleModal() {
    this.confirmDelete = !this.confirmDelete;
  }

  toggleDeleteModalAll() {
    this.confirmDeleteAll = !this.confirmDeleteAll;
  }

  setEditValues(index: number) {
    this.editIndex = index;
    const title = this.posts[index].title;

    this.editPostForm.get('title')?.setValue(title);

    this.toggleEditSheet();
  }

  toggleEditSheet() {
    this.editSheetIsOpen = !this.editSheetIsOpen;
  }
}
