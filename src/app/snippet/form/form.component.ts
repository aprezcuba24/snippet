import { SnippetInterface } from './../../domain_types';
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';


interface SnippetInterfaceAA {
  title: String,
  body: String,
}

@Component({
  selector: 'app-snippet-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent {

  @Input() model: SnippetInterface;
  @Output() onSaved = new EventEmitter<SnippetInterface>();

  constructor() { }

  onSubmit() {
    this.onSaved.emit(this.model)
  }
}
