import {
  CommonModule,
  isPlatformBrowser,
  isPlatformServer,
} from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { extract } from '@extractus/article-extractor';
import { Marked } from '@ts-stack/markdown';
import { MarkdownComponent } from 'ngx-markdown';

const API_URL = 'https://ubiqq-upload-files.azurewebsites.net/api/chatGPT';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MarkdownComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
  messages: any[] = [];

  chatInput!: FormGroup;
  isBrowser: boolean;
  isServer: boolean;

  constructor(
    protected fb: FormBuilder,
    protected http: HttpClient,
    @Inject(PLATFORM_ID) platformId: object,
    private sanitizer: DomSanitizer
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.isServer = isPlatformServer(platformId);
    this.chatInput = this.fb.group({
      prompt: ['', [Validators.required, Validators.maxLength(3000)]],
    });
  }

  convertToMarkdown(html: string): SafeHtml {
    const parsedContent = Marked.parse(html);

    return this.sanitizer.bypassSecurityTrustHtml(parsedContent);
  }

  async ngOnInit() {
    if (this.isBrowser) {
      this.getMessagesFromLocalStorage();
    }
  }

  getMessagesFromLocalStorage() {
    const storedMessages = localStorage.getItem('messages');

    console.log(storedMessages);

    // Si hay mensajes almacenados, convertirlos a un array, de lo contrario, inicializar un array vacío
    const existingMessages = storedMessages ? JSON.parse(storedMessages) : [];

    this.messages = existingMessages;
  }

  setMessagesInLocalStorage() {
    window.localStorage.setItem('messages', JSON.stringify(this.messages));
  }

  sendPrompt() {
    const newMessage = this.chatInput.get('prompt')?.value;

    this.messages.push({
      role: 'user',
      content: newMessage,
    });

    this.http.post(API_URL, { messages: this.messages }).subscribe({
      next: (response: any) => {
        this.messages.push({
          role: 'assistant',
          content: response.message,
        });

        this.setMessagesInLocalStorage();
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.chatInput.setValue({ prompt: '' });
      },
    });
  }
}
