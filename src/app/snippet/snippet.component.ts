import { Observable } from 'rxjs/Rx';
import { SnippetInterface } from './../domain_types';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {SnippetStoreService} from "../services/store/snippet-store.service";
import {AppStoreService} from "../services/store/app-store.service";

@Component({
  selector: 'app-snippet',
  templateUrl: './snippet.component.html',
  styleUrls: ['./snippet.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SnippetComponent implements OnInit {

  action: string;
  model$: Observable<SnippetInterface>
  newModel: SnippetInterface = {
    title: '',
    body: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snippetStore: SnippetStoreService,
    private appStore: AppStoreService
  ) {
  }

  ngOnInit() {
    this.action = this.route.snapshot.data['action'];
    if (this.action == 'new') {
      this.appStore.setPageReady(true);
    }
    let id = this.route.snapshot.paramMap.get('id');
    this.model$ = this.snippetStore.get$(id)
        .do(() => this.appStore.setPageReady(true))
    ;
  }

  save($event: SnippetInterface) {
    this.snippetStore.save$($event).subscribe((entity: SnippetInterface) => {
      this.router.navigate(['/snippet/detail', {
        id: entity._id
      }]);
    });
  }
}
