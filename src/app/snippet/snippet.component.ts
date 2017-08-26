import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-snippet',
  templateUrl: './snippet.component.html',
  styleUrls: ['./snippet.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SnippetComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
