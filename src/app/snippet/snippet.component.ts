import {Observable, Subscription} from 'rxjs/Rx';
import { SnippetInterface } from './../domain_types';
import {Component, OnInit, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {SnippetStoreService} from "../services/store/snippet-store.service";
import {AppStoreService} from "../services/store/app-store.service";

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
    body: ''
  };
  entity$: Observable<SnippetInterface>;
  ready$: Observable<boolean>;
  private subscription: Subscription;

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
      return this.appStore.setPageReady(true);
    }
    let id = this.route.snapshot.paramMap.get('id');
    this.entity$ = this.snippetStore.get$(id);
    this.ready$ = this.entity$.map(() => true);
    this.subscription = this.entity$.subscribe(() => this.appStore.setPageReady(true));
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
