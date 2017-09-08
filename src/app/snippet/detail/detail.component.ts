import { SnippetInterface } from './../../domain_types';
import {
  ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, ElementRef,
  AfterViewChecked
} from '@angular/core';
import * as marked from 'marked';
import '../prism.languages';
declare let Prism: any;

@Component({
  selector: 'app-snippet-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailComponent implements AfterViewChecked {

  @Input() model: SnippetInterface;
  @ViewChild("markdown") markdown: ElementRef;

  ngAfterViewChecked() {
    this.markdown.nativeElement.innerHTML = marked(this.model.body);
    Prism.highlightAll(false);
  }
}
