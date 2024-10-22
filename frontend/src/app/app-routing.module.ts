import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScrapperComponent } from './features/scrapper/scrapper.component';
import { ChatContainerComponent } from './features/chat-container/chat-container.component';

const routes: Routes = [
  {
    path: '',
    component: ScrapperComponent,
  },
  {
    path: 'chat',
    component: ChatContainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
