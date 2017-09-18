/**
 * Muestra un snippet en pantalla
 */

import {SnippetInterface} from './../../domain_types';
import {
  ChangeDetectionStrategy, Component, Input, ViewChild, ElementRef,
  AfterViewChecked, Output, EventEmitter
} from '@angular/core';
import * as marked from 'marked';
import '../prism.languages';
import {SafeUrl} from "@angular/platform-browser";
import {SnippetStoreService} from "../../services/store/snippet-store.service";
declare let Prism:any;

@Component({
  selector: 'app-snippet-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailComponent implements AfterViewChecked {

  @Input() model:SnippetInterface;
  @ViewChild("markdown") markdown:ElementRef;

  downloadJsonHref:SafeUrl;

  constructor(private snippetStore:SnippetStoreService) {
  }

  generateDownloadJson($event) {
    this.downloadJsonHref = this.snippetStore.generateDownloadJson(this.model);
  }

  ngAfterViewChecked() {
    this.markdown.nativeElement.innerHTML = marked(this.model.body);
    Prism.highlightAll(false);
  }
}
