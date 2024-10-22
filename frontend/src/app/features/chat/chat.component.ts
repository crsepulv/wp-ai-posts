
import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,

} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { Marked } from '@ts-stack/markdown';

const API_URL = 'https://ubiqq-upload-files.azurewebsites.net/api/chatGPT';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
})
export class ChatComponent implements OnInit {
  messages: any[] = [];

  chatInput!: FormGroup;

  isLoading: boolean = false

  constructor(
    protected fb: FormBuilder,
    protected http: HttpClient,
    private sanitizer: DomSanitizer,

  ) {
  
    this.chatInput = this.fb.group({
      prompt: ['', [Validators.required, Validators.maxLength(3000)]],
    });
  }

  convertToMarkdown(html: string): SafeHtml {
    const parsedContent = Marked.parse(html);

    return this.sanitizer.bypassSecurityTrustHtml(parsedContent);
  }

  async ngOnInit() {
      this.getMessagesFromLocalStorage();
    
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
    this.isLoading = true
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
        this.isLoading = false

      },
    });
  }
}
