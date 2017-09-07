import { SnippetRoutingModule } from './snippet-routing.module';
import { SharedModule } from './../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormComponent } from './form/form.component';
import { DetailComponent } from './detail/detail.component';
import { SnippetComponent } from './snippet.component';
import { MarkdownModule } from 'angular2-markdown';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    SnippetRoutingModule,
    MarkdownModule.forRoot(),
  ],
  declarations: [FormComponent, DetailComponent, SnippetComponent]
})
export class SnippetModule { }
