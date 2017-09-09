/**
 * Componente para gestionar el formulario de snippet
 */

import {SnippetInterface, TagInterface} from './../../domain_types';
import {
  Component, EventEmitter, Input, Output, ChangeDetectionStrategy, ViewChild, ElementRef,
  AfterViewChecked
} from '@angular/core';
import * as marked from 'marked';
import '../prism.languages';
declare let Prism:any;

@Component({
  selector: 'app-snippet-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements AfterViewChecked {

  @Input() model:SnippetInterface;
  @Input() tags:TagInterface[];
  @Output() onSaved = new EventEmitter<SnippetInterface>();
  @ViewChild("markdown") markdown:ElementRef;

  constructor() {
  }

  onSubmit() {
    this.onSaved.emit(this.model)
  }

  ngAfterViewChecked() {
    this.markdown.nativeElement.innerHTML = marked(this.model.body);
    Prism.highlightAll(false);
  }
}
