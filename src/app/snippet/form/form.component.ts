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
import {BehaviorSubject} from "rxjs/Rx";
declare let Prism:any;

@Component({
  selector: 'app-snippet-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements AfterViewChecked {

  @Input() action: string;
  @Input() model:SnippetInterface;
  @Input() tags:TagInterface[];
  @Output() onSaved = new EventEmitter<SnippetInterface>();
  @ViewChild("markdown") markdown:ElementRef;
  fullscreen$ = new BehaviorSubject(false);
  private fullscreen = false;

  constructor() {
  }

  onSubmit() {
    this.onSaved.emit(this.model)
  }

  ngAfterViewChecked() {
    this.markdown.nativeElement.innerHTML = marked(this.model.body);
    Prism.highlightAll(false);
  }

  toogleFullscreen(event) {
    event.preventDefault();
    this.fullscreen = !this.fullscreen;
    this.fullscreen$.next(this.fullscreen);
  }
}
