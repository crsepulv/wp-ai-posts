import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

/**
 * 
 * const WP_USER = 'michell';
const WP_PASSWORD = 'xKAB rZ9s OmlX QNlR 69JR 9XOy';
const WP_URL = 'http://localhost:80/test/index.php/wp-json/wp/v2/posts/';

 * 
 */
@Injectable({
  providedIn: 'root',
})
export class PostsService {
  postForm!: FormGroup;

  WP_USER: string = '';
  WP_PASSWORD: string = '';
  WP_URL: string = '';

  openConf = false;

  editPostSheet = false;
  newPostSheet = false;

  scrappingForm!: FormGroup;

  public confForm!: FormGroup;

  public error: { showAlert: boolean; message: string | null } = {
    showAlert: false,
    message: null,
  };

  private apiUrl = 'http://localhost:10000/extract/'; // URL del endpoint

  private aiApiUrl = 'https://ubiqq-upload-files.azurewebsites.net/api/chatGPT';

  constructor(protected fb: FormBuilder, protected http: HttpClient) {
    this.postForm = fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
    });

    this.confForm = fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required],
      url: ['', Validators.required],
    });
  }

  extractInfo(url: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + encodeURIComponent(url));
  }

  AiInfoAnalisis(title: string, description: string): Observable<any> {
    return this.http.post<any>(this.aiApiUrl, {
      messages: [
        {
          role: 'user',
          content:
            title +
            ' ' +
            description +
            'hazme un resumen y que la respuesta solo sea en json no escibas texto ni nada solo la repsuesta en json del resumen y algunas palabras claves json con esta estructura resumen y palabras_claves',
        },
      ],
    });
  }

  publishPostOnWordpress(title: string, content: string): Observable<any> {
    const encodedCredentials = btoa(`${this.WP_USER}:${this.WP_PASSWORD}`);
    const authHeader = `Basic ${encodedCredentials}`;

    return this.http.post(
      this.WP_URL,
      { title, content, status: 'publish' },
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );
  }
  createHtmlPostWithAi(posts: any[]) {
    return this.http.post<any>(this.aiApiUrl, {
      messages: [
        {
          role: 'user',
          content:
            `Aquí tienes un array de posts: ${JSON.stringify(posts)}. ` +
            `Necesito que devuelvas otro array con la misma estructura, ` +
            `rellenando el campo 'content' de cada post con un artículo en formato HTML relacionado con el título del post. ` +
            `Los posts deben ser artículos largos y detallados, bien estructurados, con introducción, subtítulos, párrafos explicativos, listas, ejemplos prácticos, y conclusiones. ` +
            `Debes asegurarte de que cada post tenga al menos **15000 caracteres**. ` +
            `Por favor, enriquece el contenido con secciones bien desarrolladas y asegurándote de cubrir el tema en profundidad. ` +
            `La respuesta debe estar solo en formato JSON, sin texto adicional.`,
        },
      ],
    });
  }

  handleError(message: string) {
    this.error = {
      showAlert: true,
      message,
    };

    setTimeout(() => {
      this.error = {
        showAlert: false,
        message: null,
      };
    }, 5000);
  }

  generatePostTitles(description: string, keywords: string[]) {
    return this.http.post<any>(this.aiApiUrl, {
      messages: [
        {
          role: 'user',
          content:
            description +
            ' ' +
            keywords[0] +
            'con este contexto creame 5 titulos para posts en wordpress relacionados con el contexto proporcionado y respondeme con un array posts con solo el titulo de los posts solo neecsito los titulos y respondeme solo en json, sin texto ni nada solo json',
        },
      ],
    });
  }
}
