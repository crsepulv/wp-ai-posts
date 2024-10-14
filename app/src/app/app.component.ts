import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';

import { RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideSettings } from '@ng-icons/lucide';
import { PostsService } from './services/posts.service';
import { SheetComponent } from './ui/sheet/sheet.component';
import { ReactiveFormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { AlertComponent } from "./ui/alert/alert.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NgIconComponent, SheetComponent, ReactiveFormsModule, AlertComponent],
  providers: [
    provideIcons({
      lucideSettings,
    }),
  ],
  template: `
    <main class="w-screen h-screen overflow-hidden overflow-y-auto">
      <router-outlet />

      <app-sheet
        [isOpen]="this.postsService.openConf"
        (toggleEvent)="openConf()"
      >
        <form
          [formGroup]="this.postsService.confForm"
          class="flex w-full flex-col gap-2"
        >
          <input
            type="text"
            formControlName="user"
            class="p-2 border rounded-md"
            placeholder="nombre de usuario de wordpress"
          />
          <input
            type="password"
            formControlName="password"
            class="p-2 border rounded-md"
            placeholder="contraseña de wordpress"
          />
          <input
            type="text"
            formControlName="url"
            class="p-2 border rounded-md"
            placeholder="Url de wordpress"
          />

          <button
            [disabled]="!this.postsService.confForm.valid"
            (click)="saveConf()"
            class="rounded-md justify-self-end self-end  bg-black px-4 py-2 text-white font-bold hover:opacity-80 disabled:opacity-30"
          >
            guardar
          </button>
        </form>
      </app-sheet>
      <app-alert/>
    </main>
  `,
})
export class AppComponent implements OnInit {
  isBrowser: boolean;
  constructor(
    public postsService: PostsService,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.getConfFromLocalStorage();
    }
  }

  openConf() {
    this.postsService.openConf = !this.postsService.openConf;
  }

  saveConf() {
    const user = this.postsService.confForm.get('user')?.value;
    const password = this.postsService.confForm.get('password')?.value;
    const url = this.postsService.confForm.get('url')?.value;

    this.postsService.WP_USER = user;
    this.postsService.WP_PASSWORD = password;
    this.postsService.WP_URL = url;

    this.setConfInLocalStorage(user, password, url);

    this.postsService.openConf = false;
  }

  getConfFromLocalStorage() {
    const storedConf = localStorage.getItem('conf');

    // Si hay mensajes almacenados, convertirlos a un array, de lo contrario, inicializar un array vacío
    const existingConf = storedConf ? JSON.parse(storedConf) : {};

    this.postsService.confForm
      .get('user')
      ?.setValue(existingConf.user);
    this.postsService.confForm
      .get('password')
      ?.setValue(existingConf.password);
    this.postsService.confForm
      .get('url')
      ?.setValue(existingConf.url);
    if (existingConf.user && existingConf.password && existingConf.url) {
      this.postsService.WP_USER = existingConf.user;
      this.postsService.WP_PASSWORD = existingConf.password;
      this.postsService.WP_URL = existingConf.url;
    }

  }

  setConfInLocalStorage(user: string, password: string, url: string) {
    const conf = {
      user,
      password,
      url,
    };
    window.localStorage.setItem('conf', JSON.stringify(conf));
  }
}
