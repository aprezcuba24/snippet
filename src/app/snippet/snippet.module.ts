import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SnippetRoutingModule } from './snippet-routing.module';
import { FormComponent } from './form/form.component';
import { DetailComponent } from './detail/detail.component';
import { SnippetComponent } from './snippet.component';

@NgModule({
  imports: [
    CommonModule,
    SnippetRoutingModule,
    FormsModule
  ],
  declarations: [FormComponent, DetailComponent, SnippetComponent]
})
export class SnippetModule { }
