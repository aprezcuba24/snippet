import {Observable, Subscription} from 'rxjs/Rx';
import {SnippetInterface, TagInterface} from './../domain_types';
import {Component, OnInit, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {SnippetStoreService} from "../services/store/snippet-store.service";
import {AppStoreService} from "../services/store/app-store.service";
import {TagStoreService} from "../services/store/tag-store.service";

@Component({
  selector: 'app-snippet',
  templateUrl: './snippet.component.html',
  styleUrls: ['./snippet.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SnippetComponent implements OnInit, OnDestroy {

  action: string;
  newEntity: SnippetInterface = {
    title: '',
    body: '',
    tags: '',
  };
  entity$: Observable<SnippetInterface>;
  ready$: Observable<boolean>;
  tags$: Observable<TagInterface[]>;
  private subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snippetStore: SnippetStoreService,
    private appStore: AppStoreService,
    private tagStore: TagStoreService
  ) {
  }

  ngOnInit() {
    this.action = this.route.snapshot.data['action'];
    this.tags$ = this.tagStore.all$;
    if (this.action == 'new') {
      this.ready$ = this.tags$.map(() => true);
    } else {
      let id = this.route.snapshot.paramMap.get('id');
      this.entity$ = this.snippetStore.get$(id, this.action == 'detail');
      this.ready$ = this.entity$.concat(this.tags$).map(() => true);
    }
    this.subscription = this.ready$
        .filter(ready => ready == true)
        .subscribe(() => this.appStore.setPageReady(true))
    ;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  save($event: SnippetInterface) {
    this.snippetStore.save$($event).subscribe((entity: SnippetInterface) => {
      this.router.navigate(['/snippet/detail', {
        id: entity._id
      }]);
    });
  }
}
