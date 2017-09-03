import {SnippetInterface, TagInterface} from './../../domain_types';
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
declare let $: any;

@Component({
  selector: 'app-snippet-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent {

  @Input() model: SnippetInterface;
  @Input() tags: TagInterface[];
  @Output() onSaved = new EventEmitter<SnippetInterface>();

  constructor() { }

  onSubmit() {
    console.log(this.model);
    this.onSaved.emit(this.model)
  }
}
