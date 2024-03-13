import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberDetailsComponent } from './members/member-details/member-details.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { authGuard } from './_guard/auth.guard';
import { TestErrorComponent } from './errors/test-error/test-error.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'list', component: ListsComponent, canActivate: [authGuard] },
  { path: 'members', component: MemberListComponent, canActivate: [authGuard] },
  {
    path: 'members/:id',
    component: MemberDetailsComponent,
    canActivate: [authGuard],
  },
  { path: 'messages', component: MessagesComponent, canActivate: [authGuard] },
  { path: 'error', component: TestErrorComponent },
  { path: 'not-found', component : NotFoundComponent},
  { path: 'server-error', component : ServerErrorComponent},
  { path: '**', component: HomeComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
