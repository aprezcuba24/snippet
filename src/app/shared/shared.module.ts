import { LayoutComponent } from './layout/layout.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select2Component } from './select2/select2.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [LayoutComponent, Select2Component],
  exports: [LayoutComponent, Select2Component]
})
export class SharedModule { }
