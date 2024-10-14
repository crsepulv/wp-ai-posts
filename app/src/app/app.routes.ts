import { Routes } from '@angular/router';
import { ScrapperComponent } from './features/scrapper/scrapper.component';
import { ChatContainerComponent } from './features/chat-container/chat-container.component';

export const routes: Routes = [
  {
    path: '',
    component: ScrapperComponent,
  },
  {
    path: 'chat',
    component: ChatContainerComponent
  }
];
