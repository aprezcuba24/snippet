import {Observable, Subscription} from 'rxjs/Rx';
import {SnippetInterface, TagInterface} from './../domain_types';
import {Component, OnInit, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router, ParamMap} from '@angular/router';
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
    this.tags$ = this.tagStore.all$;
    let params$ = this.route.paramMap
      .map((params: ParamMap) => {
        return {
          action: this.route.snapshot.data['action'],
          id: params.get('id'),
        }
      })
      .do((data: any) => this.action = data.action)
    ;
    let new$ = params$
      .filter((data: any) => data.action == 'new')
      .switchMap(() => this.tags$)
      .map(() => true)
    ;
    this.entity$ = params$
      .filter((data: any) => data.action != 'new')//edit, detail
      .switchMap((data: any) => this.snippetStore.get$(data.id, data.action == 'detail'))
      .publishReplay(1)
      .refCount()
    ;
    this.ready$ = Observable.race(new$, Observable.combineLatest(this.entity$, this.tags$))
      .map(() => true)
    ;
    this.subscription = this.ready$
      .subscribe(() => {
          this.appStore.setPageReady(true);
      })
    ;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  save($event: SnippetInterface) {
    this.snippetStore.save$($event).subscribe((entity: SnippetInterface) => {
      this.router.navigate(['/snippet/detail', {
        id: entity._id
      }]);
    });
  }
}
