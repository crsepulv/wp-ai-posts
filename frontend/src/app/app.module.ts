import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SheetComponent } from './ui/sheet/sheet.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlertComponent } from './ui/alert/alert.component';
import { HttpClientModule } from '@angular/common/http';
import { PostsService } from './services/posts.service';
import { ClipboardButtonComponent, ClipboardOptions, MarkdownModule } from 'ngx-markdown';
import { ChatContainerComponent } from './features/chat-container/chat-container.component';
import { ChatComponent } from './features/chat/chat.component';
import { ModalComponent } from './ui/modal/modal.component';
import { CopyBtnComponent } from './ui/copy-btn/copy-btn.component';

@NgModule({
  declarations: [AppComponent, ChatContainerComponent, ChatComponent, CopyBtnComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SheetComponent,
    ReactiveFormsModule,
    RouterModule,
    AlertComponent,
    HttpClientModule,
    MarkdownModule.forRoot({
      clipboardOptions: {
        provide: ClipboardOptions,
        useValue: {
          buttonComponent: CopyBtnComponent,
        },
      },
    }),
    ModalComponent
  ],

  providers: [PostsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
