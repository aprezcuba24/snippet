import { PageLoadService } from './../services/page-load.service';
import { SnippetComponent } from './snippet.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'snippet/import', data: { action: 'import' }, component: SnippetComponent, canActivate: [PageLoadService] },
  { path: 'snippet/new', data: { action: 'new' }, component: SnippetComponent, canActivate: [PageLoadService] },
  { path: 'snippet/detail', data: { action: 'detail' }, component: SnippetComponent, canActivate: [PageLoadService] },
  { path: 'snippet/edit', data: { action: 'edit' }, component: SnippetComponent, canActivate: [PageLoadService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SnippetRoutingModule { }
