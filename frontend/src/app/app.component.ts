import { Component, OnInit } from '@angular/core';

import { PostsService } from './services/posts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  categories: any[] = []
  constructor(public postsService: PostsService) {}

  ngOnInit(): void {
    this.getConfFromLocalStorage();
  }

  openConf() {
    this.postsService.openConf = !this.postsService.openConf;
  }

  saveConf() {
    const user = this.postsService.confForm.get('user')?.value;
    const password = this.postsService.confForm.get('password')?.value;
    const url = this.postsService.confForm.get('url')?.value;
    const status = this.postsService.confForm.get('status')?.value;
    const category = this.postsService.confForm.get('category')?.value;

    this.postsService.WP_USER = user;
    this.postsService.WP_PASSWORD = password;
    this.postsService.WP_URL = url;
    this.postsService.WP_STATUS = status
    this.postsService.WP_CATEGORY = category

    this.setConfInLocalStorage(user, password, url, status, category);

    this.postsService.openConf = false;
  }

  getConfFromLocalStorage() {
    const storedConf = localStorage.getItem('conf');

    // Si hay mensajes almacenados, convertirlos a un array, de lo contrario, inicializar un array vacío
    const existingConf = storedConf ? JSON.parse(storedConf) : {};

    this.postsService.confForm.get('user')?.setValue(existingConf.user);
    this.postsService.confForm.get('password')?.setValue(existingConf.password);
    this.postsService.confForm.get('url')?.setValue(existingConf.url);
    this.postsService.confForm.get('status')?.setValue(existingConf.status);
    this.postsService.confForm.get('category')?.setValue(existingConf.category);
    if (existingConf.user && existingConf.password && existingConf.url) {
      this.postsService.WP_USER = existingConf.user;
      this.postsService.WP_PASSWORD = existingConf.password;
      this.postsService.WP_URL = existingConf.url;
      this.postsService.WP_STATUS = existingConf.status;
      this.postsService.WP_CATEGORY = existingConf.category;
    }

    if(this.postsService.WP_URL){
      this.handleCategories()
    }
  }

  handleCategories(){
    this.postsService.getCategoriesFromWordpress().subscribe({
      next: (data: any) => {
        console.log(data);
        this.categories = data
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  setConfInLocalStorage(user: string, password: string, url: string, status: string, category: string) {
    const conf = {
      user,
      password,
      url,
      status,
      category
    };
    window.localStorage.setItem('conf', JSON.stringify(conf));
  }
}
