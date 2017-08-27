import { SnippetInterface } from './../../domain_types';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-snippet-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailComponent {

  @Input() model: SnippetInterface;
}
